import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, Archive, Edit, Check, AlertTriangle, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ManageElections() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [openNewElectionDialog, setOpenNewElectionDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch elections
  const { data: elections, isLoading } = useQuery({
    queryKey: ['/api/admin/elections'],
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // Sample elections data for UI development
  const sampleElections = [
    {
      id: 1,
      title: "2024 Presidential Election",
      startDate: new Date(2024, 10, 5),
      endDate: new Date(2024, 10, 5),
      isActive: true,
      status: "Active",
      voterCount: 1250,
      positions: 12,
      candidates: 36
    },
    {
      id: 2,
      title: "2024 Gubernatorial Election",
      startDate: new Date(2024, 10, 5),
      endDate: new Date(2024, 10, 5),
      isActive: false,
      status: "Scheduled",
      voterCount: 875,
      positions: 5,
      candidates: 15
    },
    {
      id: 3,
      title: "2024 Local Referendum",
      startDate: new Date(2024, 9, 15),
      endDate: new Date(2024, 9, 15),
      isActive: false,
      status: "Draft",
      voterCount: 0,
      positions: 3,
      candidates: 0
    },
    {
      id: 4,
      title: "2023 Mayoral Election",
      startDate: new Date(2023, 5, 10),
      endDate: new Date(2023, 5, 10),
      isActive: false,
      status: "Completed",
      voterCount: 945,
      positions: 1,
      candidates: 3
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
                Manage Elections
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create, edit, and manage all election events
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Dialog open={openNewElectionDialog} onOpenChange={setOpenNewElectionDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Election
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Election</DialogTitle>
                    <DialogDescription>
                      Configure the basic details for the new election event. You'll be able to 
                      add positions and candidates in the next step.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    {/* Election creation form would go here */}
                    <p className="text-sm text-gray-500">Form implementation pending...</p>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenNewElectionDialog(false)}>Cancel</Button>
                    <Button onClick={() => setOpenNewElectionDialog(false)}>Create Election</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Elections List */}
          <Card>
            <CardHeader>
              <CardTitle>Elections</CardTitle>
              <CardDescription>
                Manage all election events in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Election Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Voters</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleElections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>
                        {election.status === "Active" && (
                          <Badge className="bg-green-500">Active</Badge>
                        )}
                        {election.status === "Scheduled" && (
                          <Badge variant="outline" className="text-blue-500 border-blue-500">Scheduled</Badge>
                        )}
                        {election.status === "Draft" && (
                          <Badge variant="outline" className="text-gray-500 border-gray-500">Draft</Badge>
                        )}
                        {election.status === "Completed" && (
                          <Badge variant="outline" className="text-purple-500 border-purple-500">Completed</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {election.startDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{election.positions}</TableCell>
                      <TableCell>{election.candidates}</TableCell>
                      <TableCell>{election.voterCount}</TableCell>
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
                              <Check className="mr-2 h-4 w-4" />
                              <span>Set Active</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Reschedule</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              <span>Archive</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Election Management Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Election Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zero Trust Architecture</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Multi-Factor Authentication</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ballot Encryption</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Real-time Monitoring</span>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <span className="text-xs text-gray-500 flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  All security measures active
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto">View Details</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Elections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleElections
                    .filter(e => e.status === "Scheduled" || e.status === "Draft")
                    .map((election) => (
                      <div key={election.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{election.title}</p>
                          <p className="text-xs text-gray-500">{election.startDate.toLocaleDateString()}</p>
                        </div>
                        <Badge variant={election.status === "Draft" ? "outline" : "secondary"}>
                          {election.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  2 upcoming events
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto">View Calendar</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-md bg-yellow-50 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Schedule Reminder</h3>
                        <div className="mt-1 text-xs text-yellow-700">
                          <p>Presidential Election scheduled for next month. Configuration incomplete.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-blue-50 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">New Candidates</h3>
                        <div className="mt-1 text-xs text-blue-700">
                          <p>3 new candidates added to the Gubernatorial election.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <span className="text-xs text-gray-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  2 active alerts
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto">Dismiss All</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}