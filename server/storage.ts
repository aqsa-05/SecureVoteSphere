import { 
  users, type User, type InsertUser,
  elections, type Election, type InsertElection,
  candidates, type Candidate, type InsertCandidate,
  ballots, type Ballot, type InsertBallot,
  securityLogs, type SecurityLog, type InsertSecurityLog
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByVoterId(voterId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getVoterCount(): Promise<number>;
  
  // Election operations
  getElection(id: number): Promise<Election | undefined>;
  getActiveElection(): Promise<Election | undefined>;
  createElection(election: InsertElection): Promise<Election>;
  updateElection(id: number, updates: Partial<Election>): Promise<Election | undefined>;
  
  // Candidate operations
  getCandidate(id: number): Promise<Candidate | undefined>;
  getCandidatesByElection(electionId: number): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  
  // Ballot operations
  getBallot(id: number): Promise<Ballot | undefined>;
  getBallotsByElection(electionId: number): Promise<Ballot[]>;
  getBallotByUserAndElection(userId: number, electionId: number): Promise<Ballot | undefined>;
  createBallot(ballot: InsertBallot): Promise<Ballot>;
  
  // Security logs operations
  getSecurityLog(id: number): Promise<SecurityLog | undefined>;
  getRecentSecurityLogs(hours: number): Promise<SecurityLog[]>;
  createSecurityLog(log: InsertSecurityLog): Promise<SecurityLog>;
  
  // Session operations
  getActiveSessionCount(): Promise<number>;
  
  // Verification operations
  recordVerification(verification: {
    userId: number;
    verificationId: string;
    confidence: number;
    timestamp: Date;
  }): Promise<void>;
  getVerificationStatistics(): Promise<{
    successRate: number;
    issueCount: number;
  }>;
  
  // AI metrics
  getAIMetrics(): Promise<{
    verificationTime: {
      current: number;
      improvement: number;
    };
    accuracy: {
      current: number;
      improvement: number;
    };
    errorDistribution: {
      lighting: number;
      partialFace: number;
      spoofing: number;
      other: number;
    };
  }>;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private electionsData: Map<number, Election>;
  private candidatesData: Map<number, Candidate>;
  private ballotsData: Map<number, Ballot>;
  private securityLogsData: Map<number, SecurityLog>;
  private verifications: Array<{
    userId: number;
    verificationId: string;
    confidence: number;
    timestamp: Date;
    success: boolean;
  }>;
  private activeSessions: Set<string>;
  
  private userIdCounter: number;
  private electionIdCounter: number;
  private candidateIdCounter: number;
  private ballotIdCounter: number;
  private securityLogIdCounter: number;

  constructor() {
    this.usersData = new Map();
    this.electionsData = new Map();
    this.candidatesData = new Map();
    this.ballotsData = new Map();
    this.securityLogsData = new Map();
    this.verifications = [];
    this.activeSessions = new Set();
    
    this.userIdCounter = 1;
    this.electionIdCounter = 1;
    this.candidateIdCounter = 1;
    this.ballotIdCounter = 1;
    this.securityLogIdCounter = 1;
    
    // Initialize with sample data for demonstration
    this.initializeSampleData();
  }

  // Initialize sample data
  private initializeSampleData() {
    // Create admin user
    this.createUser({
      username: 'admin',
      password: 'admin123',
      name: 'System Administrator',
      role: 'admin',
      securityToken: '123456'
    });
    
    // Create voter users
    this.createUser({
      username: 'voter1',
      password: 'password123',
      name: 'Jane Cooper',
      role: 'voter',
      voterId: 'VOT-789456',
      faceData: 'face-data-placeholder'
    });
    
    this.createUser({
      username: 'voter2',
      password: 'password123',
      name: 'Alex Morgan',
      role: 'voter',
      voterId: 'VOT-123789',
      faceData: 'face-data-placeholder'
    });
    
    // Create election
    const election = this.createUser({
      username: 'observer',
      password: 'observer123',
      name: 'Election Observer',
      role: 'observer'
    });
    
    // Create an active election
    const electionData = this.createElection({
      title: 'General Election 2023',
      description: 'Federal Election for President and Senate',
      startDate: new Date('2023-11-05T07:00:00.000Z'),
      endDate: new Date('2023-11-05T20:00:00.000Z'),
      isActive: true
    });
    
    // Create candidates
    this.createCandidate({
      name: 'Jane Smith',
      party: 'Progress Party',
      position: 'Presidential Election',
      electionId: electionData.id
    });
    
    this.createCandidate({
      name: 'Robert Johnson',
      party: 'Liberty Party',
      position: 'Presidential Election',
      electionId: electionData.id
    });
    
    this.createCandidate({
      name: 'Maria Garcia',
      party: 'Unity Alliance',
      position: 'Presidential Election',
      electionId: electionData.id
    });
    
    this.createCandidate({
      name: 'Thomas Wilson',
      party: 'Progress Party',
      position: 'Senate Election',
      electionId: electionData.id
    });
    
    this.createCandidate({
      name: 'Sarah Adams',
      party: 'Liberty Party',
      position: 'Senate Election',
      electionId: electionData.id
    });
    
    // Create security logs
    this.createSecurityLog({
      event: 'System startup',
      category: 'System',
      severity: 'Info',
      details: { version: '2.3.1' },
      timestamp: new Date()
    });
    
    this.createSecurityLog({
      event: 'Multiple failed authentication attempts',
      category: 'Authentication',
      severity: 'Warning',
      details: { 
        ipAddress: '192.168.4.23',
        action: 'IP 192.168.4.23 blocked for 30 minutes'
      },
      ipAddress: '192.168.4.23',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    });
    
    this.createSecurityLog({
      event: 'Possible deep fake detection',
      category: 'AI Defense',
      severity: 'Critical',
      details: { 
        action: 'Authentication rejected, security notified',
        confidence: 0.89
      },
      ipAddress: '192.168.5.78',
      timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
    });
    
    this.createSecurityLog({
      event: 'System update successfully applied',
      category: 'System',
      severity: 'Info',
      details: { 
        action: 'AI model updated to version 2.3.1',
        previousVersion: '2.3.0'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
    });
  }

  // USER OPERATIONS
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      user => user.username === username
    );
  }
  
  async getUserByVoterId(voterId: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      user => user.voterId === voterId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      isActive: true,
      createdAt: timestamp
    };
    this.usersData.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersData.values());
  }
  
  async getVoterCount(): Promise<number> {
    return Array.from(this.usersData.values()).filter(
      user => user.role === 'voter'
    ).length;
  }
  
  // ELECTION OPERATIONS
  async getElection(id: number): Promise<Election | undefined> {
    return this.electionsData.get(id);
  }
  
  async getActiveElection(): Promise<Election | undefined> {
    return Array.from(this.electionsData.values()).find(
      election => election.isActive === true
    );
  }
  
  async createElection(insertElection: InsertElection): Promise<Election> {
    const id = this.electionIdCounter++;
    const election: Election = { ...insertElection, id };
    this.electionsData.set(id, election);
    return election;
  }
  
  async updateElection(id: number, updates: Partial<Election>): Promise<Election | undefined> {
    const election = await this.getElection(id);
    if (!election) return undefined;
    
    const updatedElection = { ...election, ...updates };
    this.electionsData.set(id, updatedElection);
    return updatedElection;
  }
  
  // CANDIDATE OPERATIONS
  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidatesData.get(id);
  }
  
  async getCandidatesByElection(electionId: number): Promise<Candidate[]> {
    return Array.from(this.candidatesData.values()).filter(
      candidate => candidate.electionId === electionId
    );
  }
  
  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = this.candidateIdCounter++;
    const candidate: Candidate = { ...insertCandidate, id };
    this.candidatesData.set(id, candidate);
    return candidate;
  }
  
  // BALLOT OPERATIONS
  async getBallot(id: number): Promise<Ballot | undefined> {
    return this.ballotsData.get(id);
  }
  
  async getBallotsByElection(electionId: number): Promise<Ballot[]> {
    return Array.from(this.ballotsData.values()).filter(
      ballot => ballot.electionId === electionId
    );
  }
  
  async getBallotByUserAndElection(userId: number, electionId: number): Promise<Ballot | undefined> {
    return Array.from(this.ballotsData.values()).find(
      ballot => ballot.userId === userId && ballot.electionId === electionId
    );
  }
  
  async createBallot(insertBallot: InsertBallot): Promise<Ballot> {
    const id = this.ballotIdCounter++;
    const submittedAt = new Date();
    const ballot: Ballot = { ...insertBallot, id, submittedAt };
    this.ballotsData.set(id, ballot);
    return ballot;
  }
  
  // SECURITY LOG OPERATIONS
  async getSecurityLog(id: number): Promise<SecurityLog | undefined> {
    return this.securityLogsData.get(id);
  }
  
  async getRecentSecurityLogs(hours: number): Promise<SecurityLog[]> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.securityLogsData.values())
      .filter(log => new Date(log.timestamp) >= cutoffTime)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createSecurityLog(insertLog: InsertSecurityLog): Promise<SecurityLog> {
    const id = this.securityLogIdCounter++;
    const timestamp = insertLog.timestamp || new Date();
    const log: SecurityLog = { ...insertLog, id, timestamp };
    this.securityLogsData.set(id, log);
    return log;
  }
  
  // SESSION OPERATIONS
  async getActiveSessionCount(): Promise<number> {
    return this.activeSessions.size;
  }
  
  // Track user session
  trackSession(sessionId: string) {
    this.activeSessions.add(sessionId);
  }
  
  // Remove user session
  removeSession(sessionId: string) {
    this.activeSessions.delete(sessionId);
  }
  
  // VERIFICATION OPERATIONS
  async recordVerification(verification: {
    userId: number;
    verificationId: string;
    confidence: number;
    timestamp: Date;
  }): Promise<void> {
    this.verifications.push({
      ...verification,
      success: true
    });
  }
  
  async getVerificationStatistics(): Promise<{
    successRate: number;
    issueCount: number;
  }> {
    // For demo purposes, calculate synthetic statistics
    const totalVerifications = this.verifications.length + 36; // Including 36 prior verifications
    const successfulVerifications = this.verifications.filter(v => v.success).length + 35; // 35 prior successful
    
    return {
      successRate: (successfulVerifications / totalVerifications) * 100,
      issueCount: totalVerifications - successfulVerifications
    };
  }
  
  // AI METRICS
  async getAIMetrics(): Promise<{
    verificationTime: { current: number; improvement: number; };
    accuracy: { current: number; improvement: number; };
    errorDistribution: {
      lighting: number;
      partialFace: number;
      spoofing: number;
      other: number;
    };
  }> {
    // Return mock metrics for demonstration
    return {
      verificationTime: {
        current: 1.4,
        improvement: 0.3
      },
      accuracy: {
        current: 99.7,
        improvement: 0.2
      },
      errorDistribution: {
        lighting: 42,
        partialFace: 28,
        spoofing: 18,
        other: 12
      }
    };
  }
}

import { db } from './db';
import { eq, and, gte, desc, sql } from 'drizzle-orm';

// Database implementation of storage
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByVoterId(voterId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.voterId, voterId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      isActive: true,
      createdAt: new Date()
    }).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getVoterCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'voter'));
    return result[0]?.count || 0;
  }

  // Election operations
  async getElection(id: number): Promise<Election | undefined> {
    const [election] = await db.select().from(elections).where(eq(elections.id, id));
    return election;
  }

  async getActiveElection(): Promise<Election | undefined> {
    const [election] = await db.select().from(elections).where(eq(elections.isActive, true));
    return election;
  }

  async createElection(insertElection: InsertElection): Promise<Election> {
    const [election] = await db.insert(elections).values(insertElection).returning();
    return election;
  }

  async updateElection(id: number, updates: Partial<Election>): Promise<Election | undefined> {
    const [updatedElection] = await db
      .update(elections)
      .set(updates)
      .where(eq(elections.id, id))
      .returning();
    return updatedElection;
  }

  // Candidate operations
  async getCandidate(id: number): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate;
  }

  async getCandidatesByElection(electionId: number): Promise<Candidate[]> {
    return await db.select().from(candidates).where(eq(candidates.electionId, electionId));
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db.insert(candidates).values(insertCandidate).returning();
    return candidate;
  }

  // Ballot operations
  async getBallot(id: number): Promise<Ballot | undefined> {
    const [ballot] = await db.select().from(ballots).where(eq(ballots.id, id));
    return ballot;
  }

  async getBallotsByElection(electionId: number): Promise<Ballot[]> {
    return await db.select().from(ballots).where(eq(ballots.electionId, electionId));
  }

  async getBallotByUserAndElection(userId: number, electionId: number): Promise<Ballot | undefined> {
    const [ballot] = await db
      .select()
      .from(ballots)
      .where(and(eq(ballots.userId, userId), eq(ballots.electionId, electionId)));
    return ballot;
  }

  async createBallot(insertBallot: InsertBallot): Promise<Ballot> {
    const [ballot] = await db
      .insert(ballots)
      .values({
        ...insertBallot,
        submittedAt: new Date()
      })
      .returning();
    return ballot;
  }

  // Security logs operations
  async getSecurityLog(id: number): Promise<SecurityLog | undefined> {
    const [log] = await db.select().from(securityLogs).where(eq(securityLogs.id, id));
    return log;
  }

  async getRecentSecurityLogs(hours: number): Promise<SecurityLog[]> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db
      .select()
      .from(securityLogs)
      .where(gte(securityLogs.timestamp, cutoffTime))
      .orderBy(desc(securityLogs.timestamp));
  }

  async createSecurityLog(insertLog: InsertSecurityLog): Promise<SecurityLog> {
    const timestamp = insertLog.timestamp || new Date();
    const [log] = await db
      .insert(securityLogs)
      .values({
        ...insertLog,
        timestamp
      })
      .returning();
    return log;
  }

  // Session operations
  private activeSessions = new Set<string>();

  async getActiveSessionCount(): Promise<number> {
    return this.activeSessions.size;
  }

  trackSession(sessionId: string) {
    this.activeSessions.add(sessionId);
  }

  removeSession(sessionId: string) {
    this.activeSessions.delete(sessionId);
  }

  // Verification operations
  private verifications: Array<{
    userId: number;
    verificationId: string;
    confidence: number;
    timestamp: Date;
    success: boolean;
  }> = [];

  async recordVerification(verification: {
    userId: number;
    verificationId: string;
    confidence: number;
    timestamp: Date;
  }): Promise<void> {
    this.verifications.push({
      ...verification,
      success: true
    });
  }

  async getVerificationStatistics(): Promise<{
    successRate: number;
    issueCount: number;
  }> {
    // For demo purposes, calculate synthetic statistics
    const totalVerifications = this.verifications.length + 36; // Including 36 prior verifications
    const successfulVerifications = this.verifications.filter(v => v.success).length + 35; // 35 prior successful
    
    return {
      successRate: (successfulVerifications / totalVerifications) * 100,
      issueCount: totalVerifications - successfulVerifications
    };
  }

  // AI metrics
  async getAIMetrics(): Promise<{
    verificationTime: { current: number; improvement: number; };
    accuracy: { current: number; improvement: number; };
    errorDistribution: {
      lighting: number;
      partialFace: number;
      spoofing: number;
      other: number;
    };
  }> {
    // Return mock metrics for demonstration
    return {
      verificationTime: {
        current: 1.4,
        improvement: 0.3
      },
      accuracy: {
        current: 99.7,
        improvement: 0.2
      },
      errorDistribution: {
        lighting: 42,
        partialFace: 28,
        spoofing: 18,
        other: 12
      }
    };
  }
}

// Export storage instance
export const storage = new DatabaseStorage();
