import { Express } from "express";
import { IStorage } from "./storage";
import { InsertSecurityLog } from "@shared/schema";
import { WebSocketServer } from "ws";

// Create a security log entry
export async function createSecurityLog(
  logData: Omit<InsertSecurityLog, "timestamp">,
  storage: IStorage
) {
  // Add timestamp if not provided
  const log = {
    ...logData,
    timestamp: new Date()
  };
  
  // Create log in storage
  const securityLog = await storage.createSecurityLog(log);
  
  // Broadcast critical and warning logs to admins via WebSocket if available
  if (global.wss && (log.severity === "Critical" || log.severity === "Warning")) {
    try {
      (global.wss as WebSocketServer).broadcastSecurityEvent(securityLog);
      
      // Send security alert for critical events
      if (log.severity === "Critical") {
        (global.wss as WebSocketServer).broadcastSecurityAlert("critical", log.event);
      }
    } catch (error) {
      console.error("Failed to broadcast security event:", error);
    }
  }
  
  return securityLog;
}

// Set up security routes
export function setupSecurityRoutes(app: Express, storage: IStorage) {
  // Make WebSocket Server available globally for security broadcasts
  if (!global.wss) {
    global.wss = null;
  }
  
  // Zero Trust security middleware - validate requests
  app.use((req, res, next) => {
    // Skip for non-API routes and OPTIONS requests
    if (!req.path.startsWith('/api') || req.method === 'OPTIONS') {
      return next();
    }
    
    // Basic request validation
    const validationErrors = [];
    
    // Check content-type for POST/PUT/PATCH requests with body
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) && 
      req.body && 
      Object.keys(req.body).length > 0 &&
      !req.is('application/json')
    ) {
      validationErrors.push('Content-Type must be application/json');
    }
    
    // Check for suspicious query parameters
    const suspiciousParams = ['script', 'exec', 'eval', '<script'];
    for (const param in req.query) {
      const value = req.query[param] as string;
      if (
        value && 
        suspiciousParams.some(term => value.toLowerCase().includes(term))
      ) {
        validationErrors.push(`Suspicious query parameter detected: ${param}`);
        
        // Log security event
        createSecurityLog({
          event: 'Suspicious query parameter detected',
          category: 'Input Validation',
          severity: 'Warning',
          details: { param, value },
          ipAddress: req.ip,
          userId: req.session?.user?.id
        }, storage).catch(err => console.error('Error logging security event:', err));
      }
    }
    
    // If validation errors, return 400 response
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Request validation failed',
        errors: validationErrors
      });
    }
    
    next();
  });
  
  // Endpoint to report security issues from client
  app.post('/api/security/report', async (req, res) => {
    try {
      const { event, details } = req.body;
      
      if (!event) {
        return res.status(400).json({ message: 'Event description is required' });
      }
      
      // Create security log
      await createSecurityLog({
        event: `Client security report: ${event}`,
        category: 'Client Report',
        severity: 'Warning',
        details,
        ipAddress: req.ip,
        userId: req.session?.user?.id
      }, storage);
      
      res.json({ message: 'Security report received' });
    } catch (error) {
      console.error('Error processing security report:', error);
      res.status(500).json({ message: 'Failed to process security report' });
    }
  });
  
  // Endpoint to check system security status
  app.get('/api/security/status', async (req, res) => {
    try {
      // Verify admin privileges
      if (!req.session?.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      // Get recent security logs
      const recentLogs = await storage.getRecentSecurityLogs(24); // Last 24 hours
      
      // Count incidents by severity
      const criticalCount = recentLogs.filter(log => log.severity === 'Critical').length;
      const warningCount = recentLogs.filter(log => log.severity === 'Warning').length;
      const infoCount = recentLogs.filter(log => log.severity === 'Info').length;
      
      // Determine overall security status
      let status = 'Strong';
      if (criticalCount > 0) {
        status = 'Critical';
      } else if (warningCount > 3) {
        status = 'Warning';
      }
      
      res.json({
        status,
        incidents: {
          critical: criticalCount,
          warning: warningCount,
          info: infoCount,
          total: recentLogs.length
        },
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching security status:', error);
      res.status(500).json({ message: 'Failed to fetch security status' });
    }
  });
}

// Define global namespace to make WebSocketServer available
declare global {
  var wss: WebSocketServer | null;
}
