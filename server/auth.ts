import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { voterLoginSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import { createSecurityLog } from "./security";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";

// Extend Express Request to include user session
declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      name: string;
      role: string;
      voterId?: string;
    };
  }
}

export function setupAuthRoutes(app: Express, storage: IStorage) {
  // Set up session management
  const MemorySessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'zero-trust-voting-system-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 3600000 // 1 hour
    },
    store: new MemorySessionStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    })
  }));
  
  // Authentication middleware for protected routes
  const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };
  
  // Role-based authorization middleware
  const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      if (!roles.includes(req.session.user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      
      next();
    };
  };
  
  // Check authentication status
  app.get('/api/auth/session', (req, res) => {
    if (req.session.user) {
      return res.json(req.session.user);
    }
    res.status(401).json({ message: 'Not authenticated' });
  });
  
  // Voter login
  app.post('/api/auth/voter/login', async (req, res) => {
    try {
      const { voterId, password } = voterLoginSchema.parse(req.body);
      
      // Get user by voter ID
      const user = await storage.getUserByVoterId(voterId);
      
      if (!user) {
        // Log failed login attempt
        await createSecurityLog({
          event: 'Failed voter login attempt: voter ID not found',
          category: 'Authentication',
          severity: 'Warning',
          details: { voterId },
          ipAddress: req.ip
        }, storage);
        
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if user is active
      if (!user.isActive) {
        await createSecurityLog({
          event: 'Login attempt with inactive voter account',
          category: 'Authentication',
          severity: 'Warning',
          details: { voterId, userId: user.id },
          ipAddress: req.ip,
          userId: user.id
        }, storage);
        
        return res.status(401).json({ message: 'Account is inactive' });
      }
      
      // Compare password with hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        await createSecurityLog({
          event: 'Failed voter login attempt: incorrect password',
          category: 'Authentication',
          severity: 'Warning',
          details: { voterId, userId: user.id },
          ipAddress: req.ip,
          userId: user.id
        }, storage);
        
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create session
      req.session.user = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        voterId: user.voterId
      };
      
      // Update last login time
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Log successful login
      await createSecurityLog({
        event: 'Voter login successful',
        category: 'Authentication',
        severity: 'Info',
        details: { voterId, userId: user.id },
        ipAddress: req.ip,
        userId: user.id
      }, storage);
      
      // Return user data (excluding sensitive fields)
      const { password: _, securityToken: __, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid login data', errors: error.errors });
      }
      
      console.error('Voter login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Admin login
  app.post('/api/auth/admin/login', async (req, res) => {
    try {
      const { username, password, securityToken } = adminLoginSchema.parse(req.body);
      
      // Get admin user
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.role !== 'admin') {
        await createSecurityLog({
          event: 'Failed admin login attempt: invalid username',
          category: 'Authentication',
          severity: 'Warning',
          details: { username },
          ipAddress: req.ip
        }, storage);
        
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Compare password with hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        await createSecurityLog({
          event: 'Failed admin login attempt: incorrect password',
          category: 'Authentication',
          severity: 'Warning',
          details: { username, userId: user.id },
          ipAddress: req.ip,
          userId: user.id
        }, storage);
        
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check security token (MFA)
      if (user.securityToken !== securityToken) {
        await createSecurityLog({
          event: 'Failed admin login attempt: incorrect security token',
          category: 'Authentication',
          severity: 'Warning',
          details: { username, userId: user.id },
          ipAddress: req.ip,
          userId: user.id
        }, storage);
        
        return res.status(401).json({ message: 'Invalid security token' });
      }
      
      // Create session
      req.session.user = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      };
      
      // Update last login time
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Log successful login
      await createSecurityLog({
        event: 'Admin login successful',
        category: 'Authentication',
        severity: 'Info',
        details: { username, userId: user.id },
        ipAddress: req.ip,
        userId: user.id
      }, storage);
      
      // Return user data (excluding sensitive fields)
      const { password: _, securityToken: __, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid login data', errors: error.errors });
      }
      
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Logout
  app.post('/api/auth/logout', (req, res) => {
    // Log the logout if user was logged in
    if (req.session.user) {
      const { id, username, role } = req.session.user;
      
      createSecurityLog({
        event: `${role} logout`,
        category: 'Authentication',
        severity: 'Info',
        details: { username, userId: id },
        ipAddress: req.ip,
        userId: id
      }, storage).catch(error => {
        console.error('Error logging logout:', error);
      });
    }
    
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error during logout' });
      }
      
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  // Export middlewares for use in other routes
  app.locals.authenticate = authenticate;
  app.locals.authorize = authorize;
}
