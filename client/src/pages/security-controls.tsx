import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield, Lock, Eye, RefreshCw, Zap, CheckCircle, Settings, Database, Users, FileText } from "lucide-react";

export default function SecurityControls() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [securityScore, setSecurityScore] = useState(92);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch security metrics
  const { data: securityMetrics, isLoading } = useQuery({
    queryKey: ['/api/admin/security-metrics'],
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // Sample security controls data
  const securityControls = {
    authentication: {
      multiFactor: true,
      passwordPolicy: true,
      sessionTimeout: true,
      accessControl: true,
      loginAttempts: true
    },
    encryption: {
      dataEncryption: true,
      keyRotation: true,
      endToEndEncryption: true,
      certificateManagement: true
    },
    monitoring: {
      realTimeAlerts: true,
      logCollection: true,
      threatIntelligence: true,
      behaviorAnalysis: true
    },
    compliance: {
      dataProtection: true,
      accessibilityStandards: true,
      securityAudits: true,
      vulnerabilityScan: false
    }
  };

  // Security events data
  const securityEvents = [
    {
      id: 1,
      timestamp: new Date(2024, 4, 4, 10, 15, 32),
      type: "Authentication",
      event: "Failed Login Attempts",
      details: "Multiple failed login attempts from IP 203.0.113.42",
      severity: "High",
      status: "Resolved"
    },
    {
      id: 2,
      timestamp: new Date(2024, 4, 3, 15, 45, 12),
      type: "Access Control",
      event: "Unusual Access Pattern",
      details: "Admin account accessed voter data outside normal pattern",
      severity: "Medium",
      status: "Resolved"
    },
    {
      id: 3,
      timestamp: new Date(2024, 4, 2, 9, 30, 55),
      type: "System",
      event: "Security Scan",
      details: "Automated security scan completed successfully",
      severity: "Info",
      status: "Resolved"
    },
    {
      id: 4,
      timestamp: new Date(2024, 4, 1, 14, 20, 15),
      type: "Data",
      event: "Database Encryption Check",
      details: "Verified all sensitive fields are encrypted at rest",
      severity: "Info",
      status: "Resolved"
    },
    {
      id: 5,
      timestamp: new Date(2024, 3, 30, 11, 10, 45),
      type: "Authentication",
      event: "Password Reset",
      details: "Admin account password reset by user",
      severity: "Low",
      status: "Resolved"
    }
  ];

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
                Security Controls
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage security settings and monitor system protection
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" className="mr-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Security Scan
              </Button>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Security Report
              </Button>
            </div>
          </div>
          
          {/* Security Score Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{securityScore}</span>
                    </div>
                    <svg className="w-32 h-32" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={securityScore > 90 ? "#4ade80" : securityScore > 70 ? "#facc15" : "#f87171"}
                        strokeWidth="2"
                        strokeDasharray={`${securityScore}, 100`}
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Security Score</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Your system's overall security rating is <span className="font-medium">Excellent</span>. Last security scan completed on May 4, 2024.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Authentication</p>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <p className="text-sm">Strong</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Encryption</p>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <p className="text-sm">Secure</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Monitoring</p>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <p className="text-sm">Active</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Compliance</p>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                        <p className="text-sm">Action Needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Controls Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="encryption">Encryption</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Security Events</CardTitle>
                    <CardDescription>
                      Recent security-related system events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableBody>
                        {securityEvents.slice(0, 3).map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-mono text-xs">
                              {event.timestamp.toLocaleString()}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {event.severity === 'High' && (
                                <Badge className="bg-red-500">High</Badge>
                              )}
                              {event.severity === 'Medium' && (
                                <Badge className="bg-yellow-500">Medium</Badge>
                              )}
                              {event.severity === 'Low' && (
                                <Badge className="bg-blue-500">Low</Badge>
                              )}
                              {event.severity === 'Info' && (
                                <Badge variant="outline">Info</Badge>
                              )}
                            </TableCell>
                            <TableCell>{event.event}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="link" size="sm" className="p-0 h-auto">View All Events</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recommended Actions</CardTitle>
                    <CardDescription>
                      Security improvements to consider
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Schedule Vulnerability Scan</p>
                        <p className="text-xs text-gray-500">
                          Regular vulnerability scans are recommended. Last scan was over 30 days ago.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">Schedule Scan</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Review Admin Access Policies</p>
                        <p className="text-xs text-gray-500">
                          Some administrator accounts have broad access permissions. Consider implementing least privilege principles.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">Review Policies</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Security Configurations Up to Date</p>
                        <p className="text-xs text-gray-500">
                          All other security configurations are up to date with current best practices.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Security Controls Status</CardTitle>
                  <CardDescription>
                    Overview of enabled security features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Authentication Controls */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Authentication
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Multi-Factor Auth</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.authentication.multiFactor ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Password Policy</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.authentication.passwordPolicy ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Session Timeout</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.authentication.sessionTimeout ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Access Control</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.authentication.accessControl ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Login Attempt Limits</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.authentication.loginAttempts ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Encryption Controls */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-primary" />
                        Encryption
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Data Encryption</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.encryption.dataEncryption ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Key Rotation</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.encryption.keyRotation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">End-to-End</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.encryption.endToEndEncryption ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Certificate Mgmt</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.encryption.certificateManagement ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Monitoring Controls */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-primary" />
                        Monitoring
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Real-time Alerts</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.monitoring.realTimeAlerts ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Log Collection</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.monitoring.logCollection ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Threat Intelligence</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.monitoring.threatIntelligence ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Behavior Analysis</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.monitoring.behaviorAnalysis ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Compliance Controls */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        Compliance
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Data Protection</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.compliance.dataProtection ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accessibility</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.compliance.accessibilityStandards ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Security Audits</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.compliance.securityAudits ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Vulnerability Scans</span>
                          <div className={`h-2 w-2 rounded-full ${securityControls.compliance.vulnerabilityScan ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline">Security Configuration</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="authentication" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Controls</CardTitle>
                  <CardDescription>
                    Manage identity and access security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Multi-Factor Authentication</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Require MFA for All Users</p>
                          <p className="text-xs text-gray-500">All users must complete two-factor authentication</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Require MFA for Admins</p>
                          <p className="text-xs text-gray-500">Administrators must use multi-factor authentication</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Time-based OTP (TOTP)</p>
                          <p className="text-xs text-gray-500">Enable time-based one-time password authentication</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Biometric Verification</p>
                          <p className="text-xs text-gray-500">Allow biometric verification where available</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Password Policy</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Minimum Password Length</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>8 characters</option>
                            <option>10 characters</option>
                            <option selected>12 characters</option>
                            <option>16 characters</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Password Complexity</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Basic (letters + numbers)</option>
                            <option>Medium (+ special characters)</option>
                            <option selected>High (+ upper/lowercase mix)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Password Expiration</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Never</option>
                            <option>90 days</option>
                            <option selected>60 days</option>
                            <option>30 days</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Password History</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>None</option>
                            <option>Last 3 passwords</option>
                            <option selected>Last 5 passwords</option>
                            <option>Last 10 passwords</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Prevent reuse of previous passwords
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Password Breach Detection</p>
                        <p className="text-xs text-gray-500">Check passwords against known breached passwords</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Access Controls</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Session Timeout</p>
                          <p className="text-xs text-gray-500">Automatically log out inactive users after 30 minutes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Concurrent Session Limits</p>
                          <p className="text-xs text-gray-500">Limit each user to one active session</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Failed Login Limits</p>
                          <p className="text-xs text-gray-500">Lock account after 5 failed login attempts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">IP-based Access Controls</p>
                          <p className="text-xs text-gray-500">Restrict access based on IP address ranges</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Role-based Access Control</p>
                          <p className="text-xs text-gray-500">Strictly enforce role-based permissions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Authentication Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="encryption" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Encryption & Data Protection</CardTitle>
                  <CardDescription>
                    Manage data security and encryption settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Data Encryption</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Encryption at Rest</p>
                          <p className="text-xs text-gray-500">Encrypt all stored data</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Encryption in Transit</p>
                          <p className="text-xs text-gray-500">Encrypt all data during transmission</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">End-to-End Encryption</p>
                          <p className="text-xs text-gray-500">Enable E2E encryption for sensitive operations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Database Field Encryption</p>
                          <p className="text-xs text-gray-500">Encrypt sensitive fields in database</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Database Encryption Verified</AlertTitle>
                      <AlertDescription>
                        All sensitive voter data is properly encrypted in the database.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Encryption Key Management</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Automatic Key Rotation</p>
                          <p className="text-xs text-gray-500">Rotate encryption keys every 90 days</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Secure Key Storage</p>
                          <p className="text-xs text-gray-500">Store encryption keys in a hardware security module</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Key Access Controls</p>
                          <p className="text-xs text-gray-500">Restrict access to encryption keys</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Database className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Last Key Rotation</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>Encryption keys were last rotated on April 15, 2024.</p>
                            <p className="mt-1">Next scheduled rotation: July 14, 2024</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Certificate Management</h3>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Certificate</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">TLS/SSL Certificate</p>
                              <p className="text-xs text-gray-500">securevote.example.com</p>
                            </div>
                          </TableCell>
                          <TableCell>Sep 15, 2024</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Valid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" size="sm" className="p-0 h-auto">Renew</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Code Signing Certificate</p>
                              <p className="text-xs text-gray-500">SecureVote Authority</p>
                            </div>
                          </TableCell>
                          <TableCell>Dec 10, 2024</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Valid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" size="sm" className="p-0 h-auto">Renew</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">API Encryption Certificate</p>
                              <p className="text-xs text-gray-500">api.securevote.example.com</p>
                            </div>
                          </TableCell>
                          <TableCell>Aug 20, 2024</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Valid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" size="sm" className="p-0 h-auto">Renew</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">Certificate Management</Button>
                  <Button>Save Encryption Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="monitoring" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Monitoring</CardTitle>
                  <CardDescription>
                    Configure real-time monitoring and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Real-Time Monitoring</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">User Activity Monitoring</p>
                          <p className="text-xs text-gray-500">Monitor and log all user actions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Authentication Monitoring</p>
                          <p className="text-xs text-gray-500">Monitor all login attempts and failures</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Data Access Monitoring</p>
                          <p className="text-xs text-gray-500">Track all access to sensitive data</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">System Change Monitoring</p>
                          <p className="text-xs text-gray-500">Monitor configuration and system changes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Alert Configuration</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Failed Login Threshold</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>3 attempts</option>
                            <option selected>5 attempts</option>
                            <option>10 attempts</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Number of failed login attempts before alert
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Unusual Access Pattern</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Low sensitivity</option>
                            <option selected>Medium sensitivity</option>
                            <option>High sensitivity</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Detection sensitivity for unusual access patterns
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Alert Recipients</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Security Team Only</option>
                            <option selected>Security & Admin Team</option>
                            <option>All System Administrators</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Alert Channels</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input type="checkbox" id="email" className="h-4 w-4 text-primary rounded border-gray-300" checked />
                              <label htmlFor="email" className="ml-2 text-sm">Email</label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="sms" className="h-4 w-4 text-primary rounded border-gray-300" checked />
                              <label htmlFor="sms" className="ml-2 text-sm">SMS</label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="dashboard" className="h-4 w-4 text-primary rounded border-gray-300" checked />
                              <label htmlFor="dashboard" className="ml-2 text-sm">Dashboard</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Threat Intelligence</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">IP Reputation Checking</p>
                          <p className="text-xs text-gray-500">Check IPs against threat intelligence feeds</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Behavioral Analysis</p>
                          <p className="text-xs text-gray-500">Detect anomalous behavior patterns</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Threat Feed Integration</p>
                          <p className="text-xs text-gray-500">Connect to external threat intelligence feeds</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <Zap className="h-4 w-4" />
                      <AlertTitle>Threat Intelligence Active</AlertTitle>
                      <AlertDescription>
                        Threat intelligence feeds are currently active and updated.
                        Last update: May 4, 2024 14:30:15
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">View Security Logs</Button>
                  <Button>Save Monitoring Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}