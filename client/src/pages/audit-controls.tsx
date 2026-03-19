import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Download, Info, AlertTriangle, CheckCircle, FileText, Eye, Filter, Calendar, Clock } from "lucide-react";

// Define types for audit logs
type AuditLog = {
  id: number;
  timestamp: Date;
  action: string;
  user: string;
  userRole: string;
  details: string;
  ip: string;
  category: 'authentication' | 'voter' | 'ballot' | 'system' | 'security';
  severity: 'info' | 'warning' | 'critical';
};

export default function AuditControls() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("logs");
  const [searchQuery, setSearchQuery] = useState("");
  const [logDetailsOpen, setLogDetailsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch audit logs
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs', timeRange, categoryFilter],
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // Sample audit logs for UI development
  const sampleLogs: AuditLog[] = [
    {
      id: 1,
      timestamp: new Date(2024, 4, 4, 9, 15, 32),
      action: "User Login",
      user: "admin",
      userRole: "Administrator",
      details: "Successful login from trusted device",
      ip: "192.168.1.5",
      category: "authentication",
      severity: "info"
    },
    {
      id: 2,
      timestamp: new Date(2024, 4, 4, 9, 30, 15),
      action: "Voter Verification",
      user: "system",
      userRole: "System",
      details: "Voter VOT-789456 successfully verified identity",
      ip: "192.168.1.100",
      category: "voter",
      severity: "info"
    },
    {
      id: 3,
      timestamp: new Date(2024, 4, 4, 9, 45, 22),
      action: "Ballot Cast",
      user: "voter1",
      userRole: "Voter",
      details: "Ballot submitted for General Election 2024",
      ip: "192.168.1.105",
      category: "ballot",
      severity: "info"
    },
    {
      id: 4,
      timestamp: new Date(2024, 4, 4, 10, 5, 8),
      action: "Failed Verification",
      user: "voter2",
      userRole: "Voter",
      details: "Failed biometric verification attempt (3rd attempt)",
      ip: "192.168.1.110",
      category: "security",
      severity: "warning"
    },
    {
      id: 5,
      timestamp: new Date(2024, 4, 4, 10, 30, 45),
      action: "System Configuration",
      user: "admin",
      userRole: "Administrator",
      details: "Security settings updated: Enhanced verification requirements",
      ip: "192.168.1.5",
      category: "system",
      severity: "info"
    },
    {
      id: 6,
      timestamp: new Date(2024, 4, 4, 11, 15, 30),
      action: "Multiple Login Attempts",
      user: "unknown",
      userRole: "Unknown",
      details: "5 failed login attempts for admin account from unknown IP",
      ip: "203.0.113.42",
      category: "security",
      severity: "critical"
    },
    {
      id: 7,
      timestamp: new Date(2024, 4, 4, 11, 45, 12),
      action: "Database Backup",
      user: "system",
      userRole: "System",
      details: "Automated database backup completed successfully",
      ip: "192.168.1.2",
      category: "system",
      severity: "info"
    },
    {
      id: 8,
      timestamp: new Date(2024, 4, 4, 12, 30, 5),
      action: "Verification System",
      user: "system",
      userRole: "System",
      details: "Verification system performance degradation detected",
      ip: "192.168.1.2",
      category: "system",
      severity: "warning"
    }
  ];

  // Filter logs based on search and filters
  const filteredLogs = sampleLogs
    .filter(log => 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(log => {
      if (categoryFilter === "all") return true;
      return log.category === categoryFilter;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const openLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setLogDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
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
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Audit Controls
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor and analyze system activity logs
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" className="mr-2">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Audit Report
              </Button>
            </div>
          </div>
          
          {/* Audit Tabs */}
          <Tabs defaultValue="logs" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
              <TabsTrigger value="reports">Audit Reports</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="pt-4">
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search logs by action, user, or details..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    {/* Time Range Filter */}
                    <div className="flex-shrink-0 w-full md:w-44">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <Calendar className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last 1 Hour</SelectItem>
                          <SelectItem value="24h">Last 24 Hours</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex-shrink-0 w-full md:w-44">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="authentication">Authentication</SelectItem>
                          <SelectItem value="voter">Voter</SelectItem>
                          <SelectItem value="ballot">Ballot</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Audit Logs</CardTitle>
                  <CardDescription>
                    Showing {filteredLogs.length} audit log entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openLogDetails(log)}>
                          <TableCell className="font-mono text-xs">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-400" />
                              {log.timestamp.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{log.user}</span>
                              <span className="text-xs text-gray-500">{log.userRole}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {log.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {log.severity === 'info' && (
                              <Badge className="bg-blue-500">Info</Badge>
                            )}
                            {log.severity === 'warning' && (
                              <Badge className="bg-yellow-500">Warning</Badge>
                            )}
                            {log.severity === 'critical' && (
                              <Badge className="bg-red-500">Critical</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <div className="text-sm text-gray-500">
                    Showing {filteredLogs.length} of {sampleLogs.length} logs
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Log Details Dialog */}
              <Dialog open={logDetailsOpen} onOpenChange={setLogDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Audit Log Details</DialogTitle>
                    <DialogDescription>
                      Detailed information about the selected audit log entry
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedLog && (
                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Log ID</div>
                          <div className="font-mono text-sm">{selectedLog.id}</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Timestamp</div>
                          <div className="font-mono text-sm">{selectedLog.timestamp.toLocaleString()}</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Action</div>
                          <div>{selectedLog.action}</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-medium">User</div>
                          <div>
                            {selectedLog.user} ({selectedLog.userRole})
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-medium">IP Address</div>
                          <div className="font-mono text-sm">{selectedLog.ip}</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Category</div>
                          <Badge variant="outline" className="capitalize">
                            {selectedLog.category}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Severity</div>
                          {selectedLog.severity === 'info' && (
                            <Badge className="bg-blue-500">Info</Badge>
                          )}
                          {selectedLog.severity === 'warning' && (
                            <Badge className="bg-yellow-500">Warning</Badge>
                          )}
                          {selectedLog.severity === 'critical' && (
                            <Badge className="bg-red-500">Critical</Badge>
                          )}
                        </div>
                        
                        <div className="pt-2">
                          <div className="font-medium mb-2">Details</div>
                          <div className="bg-gray-50 p-3 rounded-md text-sm">
                            {selectedLog.details}
                          </div>
                        </div>
                        
                        {selectedLog.severity === 'warning' || selectedLog.severity === 'critical' ? (
                          <div className="bg-yellow-50 p-3 rounded-md flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-yellow-800">Attention Required</p>
                              <p className="text-sm text-yellow-700">
                                This log entry indicates a potential security concern that requires review.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green-50 p-3 rounded-md flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-green-800">Normal Activity</p>
                              <p className="text-sm text-green-700">
                                This log entry represents normal system activity.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLogDetailsOpen(false)}>Close</Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Export Entry
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            <TabsContent value="reports" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Reports</CardTitle>
                  <CardDescription>
                    Generate and view detailed system audit reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">System Activity Report</CardTitle>
                        <CardDescription>
                          Overview of all system activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Time Period</span>
                            <Select defaultValue="last7days">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="last7days">Last 7 Days</SelectItem>
                                <SelectItem value="last30days">Last 30 Days</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Include Categories</span>
                            <div className="flex space-x-2">
                              <Badge>All</Badge>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Format</span>
                            <Select defaultValue="pdf">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full">Generate Report</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Security Audit Report</CardTitle>
                        <CardDescription>
                          Detailed security events analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Time Period</span>
                            <Select defaultValue="last30days">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="last7days">Last 7 Days</SelectItem>
                                <SelectItem value="last30days">Last 30 Days</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Security Level</span>
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="critical">Critical Only</SelectItem>
                                <SelectItem value="warnings">Warnings & Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Format</span>
                            <Select defaultValue="pdf">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full">Generate Report</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              <span>Security_Audit_Report_2024-05-03.pdf</span>
                            </div>
                          </TableCell>
                          <TableCell>May 3, 2024</TableCell>
                          <TableCell>Security Audit</TableCell>
                          <TableCell>2.4 MB</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              <span>System_Activity_Report_2024-04-30.pdf</span>
                            </div>
                          </TableCell>
                          <TableCell>Apr 30, 2024</TableCell>
                          <TableCell>System Activity</TableCell>
                          <TableCell>1.8 MB</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-green-500" />
                              <span>Voter_Activity_Export_2024-04-28.csv</span>
                            </div>
                          </TableCell>
                          <TableCell>Apr 28, 2024</TableCell>
                          <TableCell>Voter Activity</TableCell>
                          <TableCell>540 KB</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compliance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Tools</CardTitle>
                  <CardDescription>
                    Ensure system compliance with regulatory requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Security Compliance</CardTitle>
                          <Badge className="bg-green-500">Passed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Last Check:</span>
                          <span className="text-sm font-medium">May 4, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <span className="text-sm font-medium text-green-600">All Tests Passed</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Controls:</span>
                          <span className="text-sm font-medium">25/25 Compliant</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full" variant="outline">Run Security Check</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Data Privacy</CardTitle>
                          <Badge className="bg-green-500">Compliant</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Last Check:</span>
                          <span className="text-sm font-medium">May 2, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <span className="text-sm font-medium text-green-600">All Tests Passed</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Controls:</span>
                          <span className="text-sm font-medium">18/18 Compliant</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full" variant="outline">Run Privacy Check</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Access Controls</CardTitle>
                          <Badge className="bg-yellow-500">Review Needed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Last Check:</span>
                          <span className="text-sm font-medium">Apr 28, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <span className="text-sm font-medium text-yellow-600">1 Issue Found</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Controls:</span>
                          <span className="text-sm font-medium">14/15 Compliant</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full" variant="outline">Run Access Check</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Compliance Issue Found</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>One access control issue requires attention:</p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Inactive administrator accounts have not been reviewed in 30+ days</li>
                          </ul>
                          <p className="mt-2">
                            <Button size="sm" variant="outline" className="text-yellow-800 border-yellow-300 hover:bg-yellow-100">
                              View Issue Details
                            </Button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Compliance Standards</h3>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Election Security Standards</h4>
                              <p className="text-sm text-gray-500">Version 2.1 • Last Updated: Jan 2024</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Data Protection Regulations</h4>
                              <p className="text-sm text-gray-500">Version 3.0 • Last Updated: Mar 2024</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Accessibility Requirements</h4>
                              <p className="text-sm text-gray-500">Version 1.5 • Last Updated: Feb 2024</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Compliance Report
                  </Button>
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Run All Compliance Checks
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}