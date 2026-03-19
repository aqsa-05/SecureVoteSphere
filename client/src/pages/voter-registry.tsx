import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, MoreHorizontal, UserPlus, Edit, MailOpen, UserX, CheckCircle, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function VoterRegistry() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [openNewVoterDialog, setOpenNewVoterDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch voters
  const { data: voters, isLoading } = useQuery({
    queryKey: ['/api/admin/voters'],
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // Sample voters data for UI development
  const sampleVoters = [
    {
      id: 1,
      voterId: "VOT-123456",
      name: "John Smith",
      email: "john.smith@example.com",
      status: "Active",
      verificationStatus: "Verified",
      district: "Eastern District",
      lastLogin: new Date(2024, 4, 1),
      registrationDate: new Date(2024, 1, 15)
    },
    {
      id: 2,
      voterId: "VOT-789456",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      status: "Active",
      verificationStatus: "Verified",
      district: "Western District",
      lastLogin: new Date(2024, 4, 2),
      registrationDate: new Date(2024, 1, 16)
    },
    {
      id: 3,
      voterId: "VOT-654321",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      status: "Pending",
      verificationStatus: "Awaiting Verification",
      district: "Northern District",
      lastLogin: null,
      registrationDate: new Date(2024, 3, 10)
    },
    {
      id: 4,
      voterId: "VOT-987123",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      status: "Inactive",
      verificationStatus: "Failed Verification",
      district: "Southern District",
      lastLogin: new Date(2024, 2, 5),
      registrationDate: new Date(2024, 1, 20)
    },
    {
      id: 5,
      voterId: "VOT-345678",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      status: "Active",
      verificationStatus: "Verified",
      district: "Central District",
      lastLogin: new Date(2024, 4, 3),
      registrationDate: new Date(2024, 1, 25)
    }
  ];

  // Filter voters based on search query and active tab
  const filteredVoters = sampleVoters
    .filter(voter => 
      voter.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      voter.voterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.district.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(voter => {
      if (activeTab === "all") return true;
      if (activeTab === "active") return voter.status === "Active";
      if (activeTab === "pending") return voter.status === "Pending";
      if (activeTab === "inactive") return voter.status === "Inactive";
      return true;
    });

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
                Voter Registry
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage voter registrations and verification status
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Dialog open={openNewVoterDialog} onOpenChange={setOpenNewVoterDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register New Voter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Register New Voter</DialogTitle>
                    <DialogDescription>
                      Add a new voter to the system. Each voter will receive a unique
                      voter ID and verification credentials.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    {/* Voter registration form would go here */}
                    <p className="text-sm text-gray-500">Form implementation pending...</p>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenNewVoterDialog(false)}>Cancel</Button>
                    <Button onClick={() => setOpenNewVoterDialog(false)}>Register Voter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search voters by name, ID, or district..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Voters List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Voters</CardTitle>
              <CardDescription>
                Total voters: {filteredVoters.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter</TableHead>
                    <TableHead>Voter ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVoters.map((voter) => (
                    <TableRow key={voter.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="text-xs">
                              {voter.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{voter.name}</p>
                            <p className="text-xs text-gray-500">{voter.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{voter.voterId}</TableCell>
                      <TableCell>
                        {voter.status === "Active" && (
                          <Badge className="bg-green-500">Active</Badge>
                        )}
                        {voter.status === "Pending" && (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>
                        )}
                        {voter.status === "Inactive" && (
                          <Badge variant="outline" className="text-gray-500 border-gray-500">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {voter.verificationStatus === "Verified" && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
                        {voter.verificationStatus === "Awaiting Verification" && (
                          <div className="flex items-center text-yellow-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Awaiting</span>
                          </div>
                        )}
                        {voter.verificationStatus === "Failed Verification" && (
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Failed</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{voter.district}</TableCell>
                      <TableCell className="text-sm">
                        {voter.lastLogin ? voter.lastLogin.toLocaleDateString() : 'Never logged in'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MailOpen className="mr-2 h-4 w-4" />
                              <span>Send Credentials</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Verify Identity</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="text-sm text-gray-500">
                Showing {filteredVoters.length} of {sampleVoters.length} voters
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Voter Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Verified</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Failed</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="link" size="sm" className="p-0 h-auto">View Verification Details</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Registration Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end space-x-2">
                  {[25, 40, 35, 60, 75, 90, 85].map((value, i) => (
                    <div key={i} className="flex-1">
                      <div 
                        className="bg-primary rounded-t w-full transition-all duration-300" 
                        style={{ height: `${value}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Mar 1</span>
                  <span>Mar 15</span>
                  <span>Apr 1</span>
                  <span>Apr 15</span>
                  <span>May 1</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="link" size="sm" className="p-0 h-auto">View Full Analytics</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">District Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Eastern District</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Western District</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Northern District</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Southern District</span>
                    <span className="text-sm font-medium">17%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Central District</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="link" size="sm" className="p-0 h-auto">View District Map</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}