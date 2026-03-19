import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, LayoutTemplate, Shield, CheckCircle, AlertTriangle, Eye, Download, Copy, Save, Upload, FileText } from "lucide-react";

export default function BallotDesign() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("template");
  const [activeElection, setActiveElection] = useState<string>("1"); // Active election ID
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch ballot templates
  const { data: ballotTemplates, isLoading } = useQuery({
    queryKey: ['/api/admin/ballot-templates'],
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // Sample elections for dropdown
  const elections = [
    { id: "1", name: "2024 Presidential Election" },
    { id: "2", name: "2024 Gubernatorial Election" },
    { id: "3", name: "2024 Local Referendum" }
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
                Ballot Design
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Design and customize election ballots
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mr-2">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Ballot
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Ballot Preview</DialogTitle>
                    <DialogDescription>
                      Preview how your ballot will appear to voters
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="border p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center w-full">
                          <h3 className="text-lg font-bold">OFFICIAL BALLOT</h3>
                          <p className="text-sm text-gray-500">2024 Presidential Election</p>
                          <div className="flex justify-center mt-2 space-x-2">
                            <Badge variant="outline">Ballot ID: BLT-123456</Badge>
                            <Badge variant="outline">Precinct: Eastern District</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-2">President of the United States</h4>
                          <div className="space-y-2">
                            <div className="border rounded-md p-3 flex items-center">
                              <div className="w-6 h-6 rounded-full border mr-3"></div>
                              <div>
                                <p className="font-medium">Jane Smith</p>
                                <p className="text-sm text-gray-500">Liberty Party</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center">
                              <div className="w-6 h-6 rounded-full border mr-3"></div>
                              <div>
                                <p className="font-medium">John Doe</p>
                                <p className="text-sm text-gray-500">Progress Party</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center">
                              <div className="w-6 h-6 rounded-full border mr-3"></div>
                              <div>
                                <p className="font-medium">Robert Johnson</p>
                                <p className="text-sm text-gray-500">Unity Party</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Vice President of the United States</h4>
                          <div className="space-y-2">
                            <div className="border rounded-md p-3 flex items-center">
                              <div className="w-6 h-6 rounded-full border mr-3"></div>
                              <div>
                                <p className="font-medium">Sarah Williams</p>
                                <p className="text-sm text-gray-500">Liberty Party</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center">
                              <div className="w-6 h-6 rounded-full border mr-3"></div>
                              <div>
                                <p className="font-medium">Michael Brown</p>
                                <p className="text-sm text-gray-500">Progress Party</p>
                              </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center">
                              <div className="w-6 h-6 rounded-full border mr-3"></div>
                              <div>
                                <p className="font-medium">Lisa Davis</p>
                                <p className="text-sm text-gray-500">Unity Party</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Button>Submit Ballot</Button>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Design
              </Button>
            </div>
          </div>
          
          {/* Election Selector */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-sm font-medium text-gray-500 min-w-[130px]">Selected Election:</div>
                <Select 
                  value={activeElection} 
                  onValueChange={setActiveElection}
                >
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Select an election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map(election => (
                      <SelectItem key={election.id} value={election.id}>
                        {election.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge className="ml-auto bg-green-500">Active</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Ballot Design Tabs */}
          <Tabs defaultValue="template" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="security">Security Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ballot Templates</CardTitle>
                      <CardDescription>
                        Select a base template for your ballot
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="standard" name="template" className="h-4 w-4 text-primary" checked />
                          <label htmlFor="standard" className="text-sm font-medium cursor-pointer">Standard Ballot</label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Classic ballot format with clear sections for each position.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="compact" name="template" className="h-4 w-4 text-primary" />
                          <label htmlFor="compact" className="text-sm font-medium cursor-pointer">Compact Ballot</label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Space-efficient design for elections with many positions.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="accessible" name="template" className="h-4 w-4 text-primary" />
                          <label htmlFor="accessible" className="text-sm font-medium cursor-pointer">Accessible Ballot</label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Enhanced readability with larger text and high contrast.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="custom" name="template" className="h-4 w-4 text-primary" />
                          <label htmlFor="custom" className="text-sm font-medium cursor-pointer">Custom Template</label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Design your ballot from scratch.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="outline" className="w-full" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Template
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ballot Appearance</CardTitle>
                      <CardDescription>
                        Customize the visual elements of your ballot
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Header Design</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Ballot Title</label>
                            <Input defaultValue="OFFICIAL BALLOT" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Subtitle</label>
                            <Input defaultValue="2024 Presidential Election" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="flex items-center space-x-2">
                            <Switch id="show-logo" />
                            <label htmlFor="show-logo" className="text-sm cursor-pointer">
                              Show Official Seal
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="show-barcode" defaultChecked />
                            <label htmlFor="show-barcode" className="text-sm cursor-pointer">
                              Include Ballot ID Barcode
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Layout Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Position Font Size</label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue placeholder="Font size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Candidate Font Size</label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue placeholder="Font size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Selection Style</label>
                            <Select defaultValue="circle">
                              <SelectTrigger>
                                <SelectValue placeholder="Selection style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="circle">Circle</SelectItem>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                <SelectItem value="button">Button</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="flex items-center space-x-2">
                            <Switch id="show-party" defaultChecked />
                            <label htmlFor="show-party" className="text-sm cursor-pointer">
                              Show Party Affiliations
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="show-instructions" defaultChecked />
                            <label htmlFor="show-instructions" className="text-sm cursor-pointer">
                              Include Voting Instructions
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Ballot Footer</h3>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Footer Text</label>
                          <Input defaultValue="Thank you for voting. Your vote has been securely recorded." />
                        </div>
                        
                        <Alert variant="outline" className="bg-primary/10 border-primary/20">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <AlertTitle>Accessibility Check</AlertTitle>
                          <AlertDescription>
                            Your current design meets all accessibility requirements.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="outline">Reset to Default</Button>
                      <Button>Apply Changes</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="positions" className="pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Ballot Positions</CardTitle>
                      <CardDescription>
                        Define positions and races on the ballot
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Position
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">President of the United States</h3>
                          <p className="text-sm text-gray-500">Executive Branch • Federal Position</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0 space-x-2">
                          <Badge variant="outline">3 Candidates</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Vice President of the United States</h3>
                          <p className="text-sm text-gray-500">Executive Branch • Federal Position</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0 space-x-2">
                          <Badge variant="outline">3 Candidates</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Senate Representative</h3>
                          <p className="text-sm text-gray-500">Legislative Branch • Federal Position</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0 space-x-2">
                          <Badge variant="outline">2 Candidates</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">House Representative</h3>
                          <p className="text-sm text-gray-500">Legislative Branch • Federal Position</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0 space-x-2">
                          <Badge variant="outline">4 Candidates</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-md p-4 flex justify-center items-center">
                      <Button variant="ghost">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Another Position
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Positions
                  </Button>
                  <div>
                    <Button variant="outline" className="mr-2">
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Save as Template
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="candidates" className="pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Candidates Management</CardTitle>
                      <CardDescription>
                        Manage candidates for each position on the ballot
                      </CardDescription>
                    </div>
                    <div>
                      <Select defaultValue="president">
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="president">President of the United States</SelectItem>
                          <SelectItem value="vice-president">Vice President of the United States</SelectItem>
                          <SelectItem value="senate">Senate Representative</SelectItem>
                          <SelectItem value="house">House Representative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                            JS
                          </div>
                          <div>
                            <h3 className="text-base font-medium">Jane Smith</h3>
                            <p className="text-sm text-gray-500">Liberty Party</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Badge className="mr-2">Confirmed</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                            JD
                          </div>
                          <div>
                            <h3 className="text-base font-medium">John Doe</h3>
                            <p className="text-sm text-gray-500">Progress Party</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Badge className="mr-2">Confirmed</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                            RJ
                          </div>
                          <div>
                            <h3 className="text-base font-medium">Robert Johnson</h3>
                            <p className="text-sm text-gray-500">Unity Party</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Badge className="mr-2">Confirmed</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-md p-4 flex justify-center items-center">
                      <Button variant="ghost">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Candidate
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Candidates
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ballot Security Features</CardTitle>
                  <CardDescription>
                    Configure security elements for your ballot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Identification Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Unique Ballot Identifiers
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Each ballot receives a unique, traceable ID while maintaining voter anonymity.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            QR Code Verification
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Include QR codes that can be scanned to verify ballot authenticity.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Watermarks
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Add official watermarks to prevent ballot counterfeiting.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Holographic Elements
                          </label>
                          <Switch />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Add holographic elements for physical ballots (requires special printing).
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Digital Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Blockchain Verification
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Record ballot submissions on a secure blockchain for auditing.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            End-to-End Encryption
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Encrypt ballot data from submission through counting.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Digital Signatures
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Cryptographically sign ballots to verify authenticity.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Tamper-Evident Records
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Create records that show if ballot data has been altered.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Verification & Audit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Voter Verification Receipts
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Allow voters to receive a code to verify their vote was counted.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Audit Trail Generation
                          </label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          Create detailed audit logs for election verification.
                        </p>
                      </div>
                    </div>
                    
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Security Check Passed</AlertTitle>
                      <AlertDescription>
                        Your ballot design meets Zero Trust security standards with multiple layers of protection.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">Reset to Defaults</Button>
                  <div>
                    <Button variant="outline" className="mr-2">
                      <FileText className="mr-2 h-4 w-4" />
                      Security Report
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Security Settings
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}