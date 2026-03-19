import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import SecurityStatus from "@/components/security-status";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebSocket } from "@/hooks/use-websocket";
import { User, SecurityLog } from "@shared/schema";

type SystemStatus = {
  voterTurnout: {
    percentage: number;
    totalVotes: number;
    registeredVoters: number;
  };
  security: {
    status: "Strong" | "Moderate" | "Weak";
    allDefensesActive: boolean;
  };
  verification: {
    successRate: number;
    issuesCount: number;
  };
  performance: {
    status: "Optimal" | "Normal" | "Degraded";
    load: number;
    activeSessions: number;
  };
};

type AIMetrics = {
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
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { lastMessage } = useWebSocket();
  const [activeTab, setActiveTab] = useState("overview");
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Parse WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'SECURITY_LOG') {
          setSecurityLogs(prev => [data.log, ...prev].slice(0, 100));
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    }
  }, [lastMessage]);

  // Fetch system status
  const { data: systemStatus, isLoading: isLoadingStatus } = useQuery<SystemStatus>({
    queryKey: ['/api/admin/system-status'],
    enabled: !!isAuthenticated && user?.role === "admin",
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch AI metrics
  const { data: aiMetrics, isLoading: isLoadingAI } = useQuery<AIMetrics>({
    queryKey: ['/api/admin/ai-metrics'],
    enabled: !!isAuthenticated && user?.role === "admin",
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  // Fetch security logs if not coming from WebSocket
  const { data: initialLogs } = useQuery<SecurityLog[]>({
    queryKey: ['/api/admin/security-logs'],
    enabled: !!isAuthenticated && user?.role === "admin" && securityLogs.length === 0,
    onSuccess: (data) => {
      if (securityLogs.length === 0) {
        setSecurityLogs(data);
      }
    }
  });

  // Fetch users
  const { data: voters } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: !!isAuthenticated && user?.role === "admin" && activeTab === "users",
  });

  if (isLoadingStatus || isLoadingAI) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white h-32 rounded-lg shadow"></div>
                ))}
              </div>
              <div className="bg-white h-96 rounded-lg shadow"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Election Management Dashboard
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-sm"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  General Election {new Date().getFullYear()}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-sm"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Polls Open: 7AM - 8PM
                </div>
                <div className="mt-2 flex items-center text-sm text-green-500 font-medium">
                  <svg className="mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  System Active
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                Export Report
              </Button>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                System Settings
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="ai">AI Performance</TabsTrigger>
              <TabsTrigger value="users">Voter Registry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Status Cards */}
              {systemStatus && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Voter Turnout */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary rounded-md p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <h3 className="text-sm font-medium text-gray-500 truncate">
                            Voter Turnout
                          </h3>
                          <p className="text-lg font-medium text-gray-900">
                            {systemStatus.voterTurnout.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={systemStatus.voterTurnout.percentage} className="h-2" />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>{systemStatus.voterTurnout.totalVotes.toLocaleString()} votes</span>
                          <span>{systemStatus.voterTurnout.registeredVoters.toLocaleString()} registered</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* System Security */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <h3 className="text-sm font-medium text-gray-500 truncate">
                            System Security
                          </h3>
                          <p className="text-lg font-medium text-gray-900">
                            {systemStatus.security.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            All Defenses Active
                          </span>
                          <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Verification Rate */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 17V3h2a4 4 0 0 1 0 8h-2"/><path d="M8 3h1"/><line x1="16" y1="13" x2="20" y2="13"/><line x1="18" y1="11" x2="18" y2="15"/><line x1="8" y1="13" x2="14" y2="13"/><path d="M8 17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4h-8Z"/></svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <h3 className="text-sm font-medium text-gray-500 truncate">
                            Puzzle Verification Success
                          </h3>
                          <p className="text-lg font-medium text-gray-900">
                            {systemStatus.verification.successRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {systemStatus.verification.issuesCount} Verification Issues
                          </span>
                          <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto">
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* System Load */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <h3 className="text-sm font-medium text-gray-500 truncate">
                            System Performance
                          </h3>
                          <p className="text-lg font-medium text-gray-900">
                            {systemStatus.performance.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={systemStatus.performance.load} className="h-2" />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>{systemStatus.performance.load}% Load</span>
                          <span>{systemStatus.performance.activeSessions} Active Sessions</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Latest Security Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Security Events</CardTitle>
                  <CardDescription>
                    Most recent security events from the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Severity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {securityLogs.slice(0, 5).map((log, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.event}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={
                                log.severity === "Critical" ? "destructive" : 
                                log.severity === "Warning" ? "warning" : "success"
                              }>
                                {log.severity}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.details?.action || "No action taken"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing <span className="font-medium">{Math.min(5, securityLogs.length)}</span> of <span className="font-medium">{securityLogs.length}</span> events
                        </div>
                        <Button variant="outline" size="sm">
                          View All Events
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityStatus logs={securityLogs} />
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-6">
              {aiMetrics && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Verification Speed */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Avg. Verification Time</h4>
                      <div className="text-2xl font-bold text-gray-900">{aiMetrics.verificationTime.current}s</div>
                      <div className="mt-1 flex items-center text-sm text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                        <span>{aiMetrics.verificationTime.improvement}s faster than last week</span>
                      </div>
                      <div className="mt-4 h-16 bg-gray-50 rounded-md">
                        {/* Placeholder for chart */}
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Performance chart
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Accuracy Rate */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Verification Accuracy</h4>
                      <div className="text-2xl font-bold text-gray-900">{aiMetrics.accuracy.current}%</div>
                      <div className="mt-1 flex items-center text-sm text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="18 15 12 9 6 15"/></svg>
                        <span>{aiMetrics.accuracy.improvement}% improvement</span>
                      </div>
                      <div className="mt-4 h-16 bg-gray-50 rounded-md">
                        {/* Placeholder for chart */}
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Accuracy chart
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Error Classification */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Error Distribution</h4>
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Incorrect Answers</span>
                            <span>{aiMetrics.errorDistribution.lighting}%</span>
                          </div>
                          <div className="mt-1 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-yellow-500" style={{ width: `${aiMetrics.errorDistribution.lighting}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Timeout Errors</span>
                            <span>{aiMetrics.errorDistribution.partialFace}%</span>
                          </div>
                          <div className="mt-1 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-yellow-500" style={{ width: `${aiMetrics.errorDistribution.partialFace}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Automated Solving Attempts</span>
                            <span>{aiMetrics.errorDistribution.spoofing}%</span>
                          </div>
                          <div className="mt-1 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-red-500" style={{ width: `${aiMetrics.errorDistribution.spoofing}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Other Errors</span>
                            <span>{aiMetrics.errorDistribution.other}%</span>
                          </div>
                          <div className="mt-1 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-gray-500" style={{ width: `${aiMetrics.errorDistribution.other}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Advanced AI Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Management</CardTitle>
                  <CardDescription>
                    Configure and monitor the math puzzle verification system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Puzzle Difficulty</h4>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            defaultValue="3"
                            className="w-full"
                          />
                          <span className="ml-2 text-sm">Medium</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Higher values create more complex math puzzles
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Anti-Bot Measures</h4>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            defaultValue="3"
                            className="w-full"
                          />
                          <span className="ml-2 text-sm">Medium</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Controls how strict the anti-automation measures are
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Current Puzzle Version</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">MathVerify v1.2.3</span>
                          <Badge>Latest</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Verification Performance</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Success Rate: 98.4%</span>
                          <Badge variant="outline">Good</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Based on last 10,000 verification attempts
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline">Reset to Defaults</Button>
                      <Button>Apply Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voter Registry</CardTitle>
                  <CardDescription>
                    Manage registered voters and their verification status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Voter ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verification Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {voters?.filter(u => u.role === "voter").map((voter) => (
                          <tr key={voter.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {voter.voterId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {voter.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={voter.isActive ? "success" : "secondary"}>
                                {voter.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {voter.lastLogin ? new Date(voter.lastLogin).toLocaleString() : "Never"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {voter.faceData ? (
                                <Badge variant="outline" className="bg-green-50">Verified</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50">Not Verified</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500">Reset</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!voters || voters.length === 0) && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No voters found</p>
                      </div>
                    )}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing <span className="font-medium">{voters?.length || 0}</span> voters
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Export</Button>
                          <Button size="sm">Add Voter</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
