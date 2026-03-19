import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { WebSocketProvider } from "@/hooks/use-websocket";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Verification from "@/pages/verification";
import VoterBallot from "@/pages/voter-ballot";
import AdminDashboard from "@/pages/admin-dashboard";
import ManageElections from "@/pages/manage-elections";
import VoterRegistry from "@/pages/voter-registry";
import BallotDesign from "@/pages/ballot-design";
import AuditControls from "@/pages/audit-controls";
import AIDefenses from "@/pages/ai-defenses";
import SecurityControls from "@/pages/security-controls";
import SecurityBanner from "@/components/security-banner";
import Footer from "@/components/footer";

// Simple ProtectedRoute component for admin routes
function ProtectedRoute({ component: Component, adminOnly = false, ...rest }: any) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Add debugging
    console.log("ProtectedRoute authentication state:", { 
      isLoading, 
      isAuthenticated, 
      user,
      userRole: user?.role
    });
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("ProtectedRoute: Not authenticated, redirecting to login");
        navigate('/');
      } else if (adminOnly && user?.role !== 'admin') {
        console.error("Access denied: Admin role required. Current role:", user?.role);
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, adminOnly]);
  
  if (isLoading) {
    console.log("ProtectedRoute: Loading...");
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, rendering null");
    return null;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    console.log("ProtectedRoute: Not admin, rendering null. Current role:", user?.role);
    return null;
  }
  
  console.log("ProtectedRoute: Rendering component for authenticated user with role:", user?.role);
  return <Component {...rest} />;
}

function Router() {
  const [location] = useLocation();
  const [sessionId] = useState(`SEC-${Math.floor(Math.random() * 10000)}-VOT`);

  return (
    <div className="min-h-screen flex flex-col">
      <SecurityBanner sessionId={sessionId} />
      
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/verification" component={Verification} />
          <Route path="/ballot" component={VoterBallot} />
          
          {/* Admin Routes */}
          <Route path="/admin">
            <ProtectedRoute component={AdminDashboard} adminOnly={true} />
          </Route>
          <Route path="/admin/elections">
            <ProtectedRoute component={ManageElections} adminOnly={true} />
          </Route>
          <Route path="/admin/voters">
            <ProtectedRoute component={VoterRegistry} adminOnly={true} />
          </Route>
          <Route path="/admin/ballots">
            <ProtectedRoute component={BallotDesign} adminOnly={true} />
          </Route>
          <Route path="/admin/logs">
            <ProtectedRoute component={AuditControls} adminOnly={true} />
          </Route>
          <Route path="/admin/ai-defense">
            <ProtectedRoute component={AIDefenses} adminOnly={true} />
          </Route>
          <Route path="/admin/security">
            <ProtectedRoute component={SecurityControls} adminOnly={true} />
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </div>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WebSocketProvider>
            <Toaster />
            <Router />
          </WebSocketProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
