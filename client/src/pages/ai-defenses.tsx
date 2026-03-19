import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield, Activity, Brain, Zap, CheckCircle, AlertTriangle, RefreshCw, Settings, Lock } from "lucide-react";

export default function AIDefenses() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch AI metrics and stats
  const { data: aiMetrics, isLoading } = useQuery({
    queryKey: ['/api/admin/ai-defense-metrics'],
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // Sample AI metrics for UI development
  const sampleMetrics = {
    threatDetection: {
      status: "Active",
      lastScan: "May 4, 2024 15:30:22",
      threatsDetected: 7,
      threatsBlocked: 7,
      threatTypes: {
        adversarial: 3,
        injection: 2,
        modelExploitation: 1,
        dataExfiltration: 1
      }
    },
    modelProtection: {
      status: "Active",
      confidenceThreshold: 0.85,
      inputValidationLevel: "High",
      modelAccuracy: 0.97,
      modelHealth: 0.95
    },
    adversarialDetection: {
      status: "Active",
      attacksDetected: 12,
      falsePositives: 1,
      detectionRate: 0.98,
      lastAttackTimestamp: "May 3, 2024 09:17:45"
    },
    aiPerformance: {
      verificationTime: {
        current: 1.4,
        improvement: 0.6
      },
      accuracy: {
        current: 0.98,
        improvement: 0.05
      },
      errorDistribution: {
        lighting: 30,
        partialFace: 45,
        spoofing: 15,
        other: 10
      }
    }
  };

  // Sample threat logs
  const threatLogs = [
    {
      id: 1,
      timestamp: new Date(2024, 4, 3, 9, 17, 45),
      type: "Adversarial Attack",
      target: "Math Puzzle Verification",
      severity: "Critical",
      status: "Blocked",
      details: "Detected automated script attempting to bypass puzzle verification"
    },
    {
      id: 2,
      timestamp: new Date(2024, 4, 2, 15, 32, 10),
      type: "Model Poisoning",
      target: "Verification System",
      severity: "High",
      status: "Blocked",
      details: "Attempt to poison model with crafted input data"
    },
    {
      id: 3,
      timestamp: new Date(2024, 4, 1, 11, 25, 18),
      type: "Prompt Injection",
      target: "User Assistance System",
      severity: "Medium",
      status: "Blocked",
      details: "Detected attempt to bypass system restrictions through prompt engineering"
    },
    {
      id: 4,
      timestamp: new Date(2024, 3, 30, 16, 45, 22),
      type: "Data Exfiltration",
      target: "Inference API",
      severity: "High",
      status: "Blocked",
      details: "Attempt to extract private voter data through model responses"
    },
    {
      id: 5,
      timestamp: new Date(2024, 3, 28, 8, 12, 5),
      type: "Adversarial Attack",
      target: "Math Puzzle Verification",
      severity: "Critical",
      status: "Blocked",
      details: "Sophisticated automated solving attempt to circumvent verification"
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
                AI Defenses
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage AI security protections and monitor threat intelligence
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" className="mr-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Now
              </Button>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                AI Defense Settings
              </Button>
            </div>
          </div>
          
          {/* System Status Card */}
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">AI Security Status</h3>
                  <p className="text-sm text-green-700">
                    All AI defense systems are active and functioning optimally. Last security scan completed at 15:30:22.
                  </p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <Badge className="bg-green-500">Protected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Defense Tabs */}
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
              <TabsTrigger value="models">Model Protection</TabsTrigger>
              <TabsTrigger value="settings">Defense Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Threat Detection Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      Threat Detection
                    </CardTitle>
                    <CardDescription>
                      AI threats detected and mitigated
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status</span>
                        <Badge className="bg-green-500">{sampleMetrics.threatDetection.status}</Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Threats Detected</span>
                          <span className="font-medium">{sampleMetrics.threatDetection.threatsDetected}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Threats Blocked</span>
                          <span className="font-medium">{sampleMetrics.threatDetection.threatsBlocked}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Threat Categories</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center text-sm">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span>Adversarial: {sampleMetrics.threatDetection.threatTypes.adversarial}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <span>Injection: {sampleMetrics.threatDetection.threatTypes.injection}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span>Model: {sampleMetrics.threatDetection.threatTypes.modelExploitation}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                            <span>Data: {sampleMetrics.threatDetection.threatTypes.dataExfiltration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="link" size="sm" className="p-0 h-auto">View Threat Log</Button>
                  </CardFooter>
                </Card>
                
                {/* Model Protection Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-primary" />
                      Model Protection
                    </CardTitle>
                    <CardDescription>
                      AI model security status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status</span>
                        <Badge className="bg-green-500">{sampleMetrics.modelProtection.status}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Model Accuracy</span>
                            <span className="font-medium">{(sampleMetrics.modelProtection.modelAccuracy * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={sampleMetrics.modelProtection.modelAccuracy * 100} className="h-2" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Model Health</span>
                            <span className="font-medium">{(sampleMetrics.modelProtection.modelHealth * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={sampleMetrics.modelProtection.modelHealth * 100} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Threshold</span>
                          <span className="font-medium">{sampleMetrics.modelProtection.confidenceThreshold}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Input Validation</span>
                          <span className="font-medium">{sampleMetrics.modelProtection.inputValidationLevel}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="link" size="sm" className="p-0 h-auto">Tune Model Settings</Button>
                  </CardFooter>
                </Card>
                
                {/* Adversarial Detection Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-primary" />
                      Adversarial Detection
                    </CardTitle>
                    <CardDescription>
                      Advanced anti-manipulation controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status</span>
                        <Badge className="bg-green-500">{sampleMetrics.adversarialDetection.status}</Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Attacks Detected</span>
                          <span className="font-medium">{sampleMetrics.adversarialDetection.attacksDetected}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>False Positives</span>
                          <span className="font-medium">{sampleMetrics.adversarialDetection.falsePositives}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Detection Rate</span>
                          <span className="font-medium">{(sampleMetrics.adversarialDetection.detectionRate * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Latest Detection</span>
                          <span className="font-medium">May 3, 2024</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Detected and blocked adversarial facial image attack
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="link" size="sm" className="p-0 h-auto">View Detection Logs</Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* AI Performance Metrics */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>AI Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for AI systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium mb-4">Verification Performance</h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Verification Time</span>
                            <div>
                              <span className="font-medium">{sampleMetrics.aiPerformance.verificationTime.current}s</span>
                              <span className="text-green-600 ml-2">(-{sampleMetrics.aiPerformance.verificationTime.improvement}s)</span>
                            </div>
                          </div>
                          <Progress value={70} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Target: 1.0s</span>
                            <span>Current: {sampleMetrics.aiPerformance.verificationTime.current}s</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Accuracy Rate</span>
                            <div>
                              <span className="font-medium">{(sampleMetrics.aiPerformance.accuracy.current * 100).toFixed(1)}%</span>
                              <span className="text-green-600 ml-2">(+{(sampleMetrics.aiPerformance.accuracy.improvement * 100).toFixed(1)}%)</span>
                            </div>
                          </div>
                          <Progress value={98} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Target: 99.5%</span>
                            <span>Current: {(sampleMetrics.aiPerformance.accuracy.current * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-4">Error Distribution</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Lighting Conditions</span>
                            <span className="font-medium">{sampleMetrics.aiPerformance.errorDistribution.lighting}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${sampleMetrics.aiPerformance.errorDistribution.lighting}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Partial Face Visibility</span>
                            <span className="font-medium">{sampleMetrics.aiPerformance.errorDistribution.partialFace}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${sampleMetrics.aiPerformance.errorDistribution.partialFace}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Spoofing Attempts</span>
                            <span className="font-medium">{sampleMetrics.aiPerformance.errorDistribution.spoofing}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${sampleMetrics.aiPerformance.errorDistribution.spoofing}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Other Factors</span>
                            <span className="font-medium">{sampleMetrics.aiPerformance.errorDistribution.other}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${sampleMetrics.aiPerformance.errorDistribution.other}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Last updated: May 4, 2024 16:15:32
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Metrics
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="threats" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Threat Intelligence</CardTitle>
                  <CardDescription>
                    Detected and mitigated AI-related security threats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Target System</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[350px]">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {threatLogs.map((threat) => (
                        <TableRow key={threat.id}>
                          <TableCell className="font-mono text-xs">
                            {threat.timestamp.toLocaleString()}
                          </TableCell>
                          <TableCell>{threat.type}</TableCell>
                          <TableCell>{threat.target}</TableCell>
                          <TableCell>
                            {threat.severity === 'Critical' && (
                              <Badge className="bg-red-500">Critical</Badge>
                            )}
                            {threat.severity === 'High' && (
                              <Badge className="bg-orange-500">High</Badge>
                            )}
                            {threat.severity === 'Medium' && (
                              <Badge className="bg-yellow-500">Medium</Badge>
                            )}
                            {threat.severity === 'Low' && (
                              <Badge className="bg-blue-500">Low</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {threat.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {threat.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Showing most recent 5 threat events
                  </div>
                  <Button variant="outline" size="sm">View Full Threat Log</Button>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">AI Threat Statistics</CardTitle>
                    <CardDescription>
                      Overview of detected threats over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-64 flex items-end space-x-2">
                      {[3, 1, 0, 2, 5, 3, 7].map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="bg-primary rounded-t w-full transition-all duration-300" 
                            style={{ height: `${(value / 7) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-1">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Apr 28</span>
                      <span>Apr 29</span>
                      <span>Apr 30</span>
                      <span>May 1</span>
                      <span>May 2</span>
                      <span>May 3</span>
                      <span>May 4</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <div className="text-sm text-gray-500">
                      Total threats this week: 21
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Threat Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of threat types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm">Adversarial Attacks</span>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-sm">Prompt Injection</span>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">Model Exploitation</span>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-sm">Data Exfiltration</span>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                          <span className="text-sm">Other</span>
                        </div>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <div className="text-sm text-gray-500">
                      Based on last 30 days of data
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Latest Threat Intelligence</CardTitle>
                  <CardDescription>
                    Recent updates from threat intelligence feed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4 py-1">
                    <p className="font-medium">New Adversarial Attack Vector Identified</p>
                    <p className="text-sm text-gray-500 mt-1">
                      A new technique using automated scripts to solve math puzzles has been observed in the wild. Defense signatures have been updated.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">May 4, 2024</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="font-medium">Model Extraction Vulnerability Patched</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Security update applied to verification models to prevent extraction attacks through repeated query patterns.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">May 2, 2024</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <p className="font-medium">Enhanced Puzzle Automation Detection</p>
                    <p className="text-sm text-gray-500 mt-1">
                      New automated solver detection algorithms deployed to verification pipeline with 15% improved detection accuracy.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Apr 30, 2024</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button variant="link" size="sm" className="p-0 h-auto">View Complete Intelligence Feed</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="models" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Protection</CardTitle>
                  <CardDescription>
                    Manage security settings for AI models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Verification Models</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-green-500">Active</Badge>
                            <span className="font-medium">Math Puzzle Generator V2.1</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last Updated: May 1, 2024
                          </div>
                        </div>
                        <div className="pl-6 text-sm">
                          <div className="flex justify-between mt-2">
                            <span>Accuracy</span>
                            <span>98.5%</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Security Rating</span>
                            <span>A+</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="mr-2" variant="outline">Standby</Badge>
                            <span className="font-medium">Anti-Automation System V1.5</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last Updated: Apr 15, 2024
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="mr-2" variant="outline">Standby</Badge>
                            <span className="font-medium">Puzzle Difficulty Adaptation V1.0</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last Updated: Apr 10, 2024
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Model Protection Settings</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Input Validation</p>
                            <p className="text-xs text-gray-500">Validates all inputs against known attack patterns</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Rate Limiting</p>
                            <p className="text-xs text-gray-500">Limits API calls to prevent brute force attacks</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Query Monitoring</p>
                            <p className="text-xs text-gray-500">Monitors unusual query patterns</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Adversarial Detection</p>
                            <p className="text-xs text-gray-500">Detects and blocks adversarial examples</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-4">Adversarial Robustness</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <Shield className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Model Hardening</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                All models are trained with adversarial examples to improve robustness
                              </p>
                              <Badge className="mt-2 bg-green-500">Active</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <Zap className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Ensemble Models</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Using multiple model types to verify each input for increased security
                              </p>
                              <Badge className="mt-2 bg-green-500">Active</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <Lock className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Model Encryption</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Models are encrypted at rest and during inference to prevent tampering
                              </p>
                              <Badge className="mt-2 bg-green-500">Active</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Models
                  </Button>
                  <Button>
                    <Shield className="mr-2 h-4 w-4" />
                    Run Security Scan
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Model Validation Testing</CardTitle>
                  <CardDescription>
                    Results from security validation tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Security Score</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Adversarial Robustness</TableCell>
                        <TableCell>May 4, 2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Passed</Badge>
                        </TableCell>
                        <TableCell>92/100</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Report</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Model Extraction Resistance</TableCell>
                        <TableCell>May 3, 2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Passed</Badge>
                        </TableCell>
                        <TableCell>95/100</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Report</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Prompt Injection Testing</TableCell>
                        <TableCell>May 2, 2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Passed</Badge>
                        </TableCell>
                        <TableCell>97/100</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Report</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Membership Inference Resistance</TableCell>
                        <TableCell>Apr 30, 2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Passed</Badge>
                        </TableCell>
                        <TableCell>94/100</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Report</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Data Poisoning Defense</TableCell>
                        <TableCell>Apr 28, 2024</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500">Warning</Badge>
                        </TableCell>
                        <TableCell>86/100</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Report</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-700">
                      One warning detected in data poisoning defense testing. Review recommended.
                    </span>
                  </div>
                  <Button variant="outline">Run Tests Again</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Defense Settings</CardTitle>
                  <CardDescription>
                    Configure and manage AI security controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">General AI Security Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Zero Trust AI Architecture</p>
                          <p className="text-xs text-gray-500">Verify every AI interaction, regardless of source</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Real-time Threat Monitoring</p>
                          <p className="text-xs text-gray-500">Monitor and analyze AI interactions in real-time</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Automated Threat Response</p>
                          <p className="text-xs text-gray-500">Automatically block detected threats</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Threat Intelligence Integration</p>
                          <p className="text-xs text-gray-500">Receive and apply external threat intelligence</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Advanced Protection Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Confidence Threshold</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Very High (0.95)</option>
                            <option selected>High (0.85)</option>
                            <option>Medium (0.75)</option>
                            <option>Low (0.65)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Minimum confidence level required for verification success
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Adversarial Detection Level</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Maximum (may impact performance)</option>
                            <option selected>High</option>
                            <option>Medium</option>
                            <option>Basic</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Level of sensitivity for detecting adversarial examples
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">API Rate Limiting</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Strict (10 calls/min)</option>
                            <option selected>Moderate (30 calls/min)</option>
                            <option>Relaxed (100 calls/min)</option>
                            <option>None</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Limit API requests to prevent brute force attacks
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Model Rotation Schedule</label>
                          <select className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm">
                            <option>Weekly</option>
                            <option selected>Monthly</option>
                            <option>Quarterly</option>
                            <option>Manual Only</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            How often to rotate and update AI models
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Notification Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Critical Threat Alerts</p>
                          <p className="text-xs text-gray-500">Immediate notification for critical threats</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Security Status Reports</p>
                          <p className="text-xs text-gray-500">Daily security status summaries</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Model Performance Alerts</p>
                          <p className="text-xs text-gray-500">Notifications for AI model performance degradation</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Compliance Notifications</p>
                          <p className="text-xs text-gray-500">Alerts for compliance-related issues</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}