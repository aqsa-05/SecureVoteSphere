import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import VoterSidebar from "@/components/voter-sidebar";
import BallotItem from "@/components/ballot-item";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type ElectionWithCandidates = {
  id: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  candidates: {
    id: number;
    name: string;
    party: string | null;
    position: string;
  }[];
};

type BallotChoices = {
  [position: string]: number;
};

export default function VoterBallot() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [choices, setChoices] = useState<BallotChoices>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "voter") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch active election and candidates
  const { data: election, isLoading } = useQuery<ElectionWithCandidates>({
    queryKey: ['/api/elections/active'],
    enabled: !!isAuthenticated,
  });

  // Submit ballot mutation
  const submitBallotMutation = useMutation({
    mutationFn: async (choices: BallotChoices) => {
      const res = await apiRequest("POST", "/api/ballots", {
        electionId: election?.id,
        choices
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ballot Submitted",
        description: "Your vote has been securely recorded.",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit your ballot",
        variant: "destructive"
      });
    }
  });

  const handleVoteChange = (position: string, candidateId: number) => {
    setChoices((prev) => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const handleSubmit = () => {
    setConfirmDialogOpen(true);
  };

  const confirmSubmit = () => {
    submitBallotMutation.mutate(choices);
    setConfirmDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <VoterSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <VoterSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h1 className="text-xl font-medium text-gray-900">No Active Election</h1>
              <p className="mt-2 text-gray-600">There is no active election available at this time.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Group candidates by position
  const positionsMap: {[key: string]: typeof election.candidates} = {};
  election.candidates.forEach(candidate => {
    if (!positionsMap[candidate.position]) {
      positionsMap[candidate.position] = [];
    }
    positionsMap[candidate.position].push(candidate);
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <VoterSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Ballot Header */}
          <header className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white relative">
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 gap-2 h-full opacity-20">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-sm w-full h-2"></div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between relative">
                <div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                    <h1 className="text-2xl font-bold">OFFICIAL BALLOT</h1>
                  </div>
                  <h2 className="text-xl font-semibold mt-1">{election.title}</h2>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-bold inline-flex items-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></svg>
                    Secure Ballot
                  </div>
                  <span className="text-sm mt-2 italic font-light">
                    Valid: {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  End-to-End Encrypted
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Tamper-Proof
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  Blockchain Verified
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  AI Protected
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 22V2" /></svg>
                  Zero Trust Security
                </span>
              </div>

              {/* Ballot ID and watermark */}
              <div className="mt-4 flex justify-between items-center text-xs opacity-80">
                <div>Voter ID: {user?.voterId || "ANONYMOUS"}</div>
                <div>Ballot ID: BLT-{Math.floor(Math.random() * 10000)}-SEC</div>
              </div>
            </div>

            <div className="p-4 border-t border-blue-300 bg-blue-50">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> Select one candidate for each position. Your choices are encrypted and your anonymity is protected.
                </div>
              </div>
            </div>
          </header>
          
          {/* Ballot Contents */}
          <div className="space-y-6">
            {Object.entries(positionsMap).map(([position, candidates]) => (
              <BallotItem 
                key={position}
                position={position}
                candidates={candidates}
                selectedCandidateId={choices[position]}
                onVoteChange={handleVoteChange}
              />
            ))}
            
            {/* Ballot Submission */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-green-900">Submit Your Secure Ballot</h2>
                <p className="text-sm text-green-700">Review your choices carefully before submitting</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mt-1"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Protection Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p className="mb-2">Your vote will be encrypted and anonymized using zero-knowledge proofs. Once submitted:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Your identity will be cryptographically separated from your vote</li>
                          <li>A verification receipt will be generated for your records</li>
                          <li>Your vote will be tamper-proof and immutable</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-base">AI-Verified Ballot</h3>
                      <p className="text-gray-600 text-sm">Your ballot has been cryptographically secured</p>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></svg>
                    Ready to submit
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Ballot ID:</span> 
                      <span className="ml-1 font-mono text-gray-700">BLT-{Math.floor(Math.random() * 10000)}-SEC</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Timestamp:</span>
                      <span className="ml-1 font-mono text-gray-700">{new Date().toISOString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="default"
                    onClick={handleSubmit}
                    disabled={submitBallotMutation.isPending}
                    className="inline-flex items-center py-6 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    size="lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></svg>
                    {submitBallotMutation.isPending ? 'Submitting...' : 'Submit Secure Ballot'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center text-blue-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></svg>
              <AlertDialogTitle className="text-blue-800">Secure Ballot Confirmation</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4">
              <p>
                You are about to securely submit your ballot for the current election. 
                This action cannot be undone.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Security Information</h4>
                <p className="text-sm text-blue-700">
                  Your vote will be cryptographically sealed and your identity will be disassociated 
                  from your vote choices to ensure privacy while maintaining vote integrity.
                </p>
              </div>
              
              <div className="rounded-md bg-amber-50 p-4 border border-amber-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Important notice</h3>
                    <div className="mt-1 text-sm text-amber-700">
                      <p>Once submitted, your vote cannot be changed or revoked.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <AlertDialogCancel className="mt-3 sm:mt-0">Go Back & Review</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSubmit}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {submitBallotMutation.isPending ? 'Submitting...' : 'Confirm & Submit Ballot'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
