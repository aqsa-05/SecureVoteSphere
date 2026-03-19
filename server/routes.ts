import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { setupWebSocketServer } from "./websocket";
import { setupAuthRoutes } from "./auth";
import { createSecurityLog, setupSecurityRoutes } from "./security";
import { 
  insertUserSchema, 
  insertElectionSchema, 
  insertCandidateSchema, 
  insertBallotSchema,
  voterLoginSchema,
  adminLoginSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  setupWebSocketServer(wss, storage);
  
  // Set up authentication routes
  setupAuthRoutes(app, storage);
  
  // Set up security monitoring routes
  setupSecurityRoutes(app, storage);
  
  // API routes
  // All routes are prefixed with /api
  
  // Users API
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return sensitive information
      const { password, securityToken, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/api/users', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(validatedData);
      
      // Log user creation
      await createSecurityLog({
        event: `User created: ${newUser.username}`,
        category: 'User Management',
        severity: 'Info',
        details: { userId: newUser.id, role: newUser.role },
        ipAddress: req.ip
      }, storage);
      
      const { password, securityToken, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Elections API
  app.get('/api/elections/active', async (req, res) => {
    try {
      const activeElection = await storage.getActiveElection();
      
      if (!activeElection) {
        return res.status(404).json({ message: 'No active election found' });
      }
      
      // Get candidates for this election
      const candidates = await storage.getCandidatesByElection(activeElection.id);
      
      res.json({
        ...activeElection,
        candidates
      });
    } catch (error) {
      console.error('Error fetching active election:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/api/elections', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      const validatedData = insertElectionSchema.parse(req.body);
      const newElection = await storage.createElection(validatedData);
      
      // Log election creation
      await createSecurityLog({
        event: `Election created: ${newElection.title}`,
        category: 'Election Management',
        severity: 'Info',
        details: { electionId: newElection.id },
        ipAddress: req.ip,
        userId: req.session.user.id
      }, storage);
      
      res.status(201).json(newElection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid election data', errors: error.errors });
      }
      console.error('Error creating election:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Candidates API
  app.post('/api/candidates', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      const validatedData = insertCandidateSchema.parse(req.body);
      const newCandidate = await storage.createCandidate(validatedData);
      
      res.status(201).json(newCandidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid candidate data', errors: error.errors });
      }
      console.error('Error creating candidate:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Ballots API
  app.post('/api/ballots', async (req, res) => {
    try {
      // Verify voter authorization
      if (!req.session.user || req.session.user.role !== 'voter') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      // Check if user has already voted in this election
      const { electionId } = req.body;
      const existingBallot = await storage.getBallotByUserAndElection(
        req.session.user.id,
        electionId
      );
      
      if (existingBallot) {
        return res.status(400).json({ message: 'You have already voted in this election' });
      }
      
      // Generate a verification ID
      const verificationId = `BALLOT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Create ballot with validated data
      const ballotData = {
        userId: req.session.user.id,
        electionId,
        choices: req.body.choices,
        verificationId
      };
      
      const validatedData = insertBallotSchema.parse(ballotData);
      const newBallot = await storage.createBallot(validatedData);
      
      // Log ballot submission for auditing
      await createSecurityLog({
        event: `Ballot submitted for election #${electionId}`,
        category: 'Voting',
        severity: 'Info',
        details: { 
          verificationId,
          electionId
          // Note: Choices are not logged to preserve vote anonymity
        },
        ipAddress: req.ip,
        userId: req.session.user.id
      }, storage);
      
      res.status(201).json({
        message: 'Vote successfully recorded',
        verificationId: newBallot.verificationId
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ballot data', errors: error.errors });
      }
      console.error('Error submitting ballot:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Admin Dashboard APIs
  app.get('/api/admin/system-status', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      // Get current election
      const activeElection = await storage.getActiveElection();
      
      if (!activeElection) {
        return res.status(404).json({ message: 'No active election found' });
      }
      
      // Get voter turnout data
      const registeredVoters = await storage.getVoterCount();
      const ballots = await storage.getBallotsByElection(activeElection.id);
      const voterTurnout = {
        percentage: registeredVoters > 0 ? (ballots.length / registeredVoters) * 100 : 0,
        totalVotes: ballots.length,
        registeredVoters
      };
      
      // Get security status
      const recentSecurityLogs = await storage.getRecentSecurityLogs(24); // Last 24 hours
      const criticalAlerts = recentSecurityLogs.filter(log => log.severity === 'Critical').length;
      const warningAlerts = recentSecurityLogs.filter(log => log.severity === 'Warning').length;
      
      const securityStatus = {
        status: criticalAlerts > 0 ? 'Moderate' : warningAlerts > 0 ? 'Strong' : 'Strong',
        allDefensesActive: criticalAlerts === 0
      };
      
      // Get verification statistics
      const verificationStats = await storage.getVerificationStatistics();
      
      // Get system performance metrics
      const activeSessions = await storage.getActiveSessionCount();
      
      const systemStatus = {
        voterTurnout,
        security: securityStatus,
        verification: {
          successRate: verificationStats.successRate,
          issuesCount: verificationStats.issueCount
        },
        performance: {
          status: 'Optimal',
          load: Math.min(activeSessions / 10, 100), // Example calculation
          activeSessions
        }
      };
      
      res.json(systemStatus);
    } catch (error) {
      console.error('Error getting system status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/admin/ai-metrics', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      // Get AI verification metrics
      const aiMetrics = await storage.getAIMetrics();
      
      res.json(aiMetrics);
    } catch (error) {
      console.error('Error getting AI metrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/admin/security-logs', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      // Get recent security logs
      const logs = await storage.getRecentSecurityLogs(72); // Last 72 hours
      
      res.json(logs);
    } catch (error) {
      console.error('Error getting security logs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/admin/users', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      // Get all users
      const users = await storage.getAllUsers();
      
      // Remove sensitive information
      const safeUsers = users.map(user => {
        const { password, securityToken, ...safeUser } = user;
        return safeUser;
      });
      
      res.json(safeUsers);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Verification API
  app.post('/api/verification/complete', async (req, res) => {
    try {
      // Verify user authentication
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { verificationId, confidence } = req.body;
      
      // Record verification completion
      await storage.recordVerification({
        userId: req.session.user.id,
        verificationId,
        confidence,
        timestamp: new Date()
      });
      
      // Log verification for security
      await createSecurityLog({
        event: 'Identity verification completed',
        category: 'Verification',
        severity: 'Info',
        details: { 
          verificationId,
          confidence,
          method: 'facial-recognition'
        },
        ipAddress: req.ip,
        userId: req.session.user.id
      }, storage);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error completing verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  return httpServer;
}
