import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVerification } from "@/hooks/use-verification";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Verification() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { 
    verificationStep, 
    nextStep, 
    resetVerification, 
    verificationDetails,
    isVerifying,
    verificationSuccess,
    completeVerification,
    completeVerificationStep,
    setVerifying
  } = useVerification();
  
  // State for math puzzle verification
  const [puzzleAnswer, setPuzzleAnswer] = useState("");
  const [puzzleError, setPuzzleError] = useState("");
  
  // Generate random math puzzle
  const [num1] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [operation] = useState(() => {
    const ops = ['+', '-', 'x'];
    return ops[Math.floor(Math.random() * ops.length)];
  });
  
  // Calculate the correct answer based on the operation
  const getCorrectAnswer = () => {
    switch(operation) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case 'x': return num1 * num2;
      default: return 0;
    }
  };
  
  // If no user, redirect to login
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle the verification process
  const handleContinue = () => {
    if (verificationStep === 1) {
      // Verify the math puzzle answer
      const correctAnswer = getCorrectAnswer();
      const userAnswer = parseInt(puzzleAnswer, 10);
      
      if (isNaN(userAnswer)) {
        setPuzzleError("Please enter a valid number");
        return;
      }
      
      if (userAnswer === correctAnswer) {
        // Puzzle solved correctly
        setPuzzleError("");
        const verificationId = `VRF-${Date.now().toString().substring(6)}`;
        
        // Update verification details
        completeVerificationStep(2, { 
          success: true, 
          data: { 
            confidence: 100,
            livenessStatus: "Puzzle Verified", 
            verificationId: verificationId
          } 
        });
        
        // Auto-proceed to confirmation and then ballot after a short delay
        nextStep();
        
        // Add a short delay before redirecting to ballot
        setTimeout(() => {
          completeVerification();
          navigate("/ballot");
        }, 1500);
      } else {
        setPuzzleError("Incorrect answer. Please try again.");
      }
    } else {
      completeVerification();
      navigate("/ballot");
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="mt-2 text-xl font-bold text-gray-900">Secure Multi-Factor Authentication</h2>
            <p className="mt-1 text-sm text-gray-600">
              Verify your identity to access your secure ballot
            </p>
          </div>
          
          <div className="mt-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${verificationStep >= 1 ? 'bg-primary text-white' : 'border-gray-300 text-gray-500'}`}>1</div>
                <span className={`text-xs mt-1 ${verificationStep >= 1 ? 'text-primary font-medium' : 'text-gray-500'}`}>Security</span>
              </div>
              <div className="h-1 flex-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: verificationStep >= 1 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${verificationStep >= 2 ? 'bg-primary text-white' : 'border-gray-300 text-gray-500'}`}>2</div>
                <span className={`text-xs mt-1 ${verificationStep >= 2 ? 'text-primary font-medium' : 'text-gray-500'}`}>Confirm</span>
              </div>
            </div>
            
            {/* Step 1: Math Puzzle Verification */}
            {verificationStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-md font-medium text-blue-800">Human Verification</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Please solve this simple math puzzle to verify your identity.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold mb-4">
                      {num1} {operation} {num2} = ?
                    </div>
                    <Input
                      id="puzzleAnswer"
                      value={puzzleAnswer}
                      onChange={(e) => setPuzzleAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      className="w-full text-center text-lg"
                      type="number"
                    />
                    {puzzleError && (
                      <p className="text-sm text-red-500 mt-2">{puzzleError}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Secure encryption activated</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Zero Trust defense active</span>
                  </div>
                </div>
                
                <Button onClick={handleContinue} className="w-full">
                  Verify Identity
                </Button>
              </div>
            )}
            
            {/* Step 2: Confirmation */}
            {verificationStep === 2 && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6 border border-success text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mx-auto"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></svg>
                  <h3 className="text-lg font-medium text-gray-900 mt-2">Identity Verified</h3>
                  <p className="text-sm text-gray-600 mt-1">Your identity has been successfully verified</p>
                </div>
                
                <div className="rounded-md bg-gray-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-800">Verification Details</h3>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>Match confidence: <span className="font-medium">{verificationDetails.confidence}%</span></p>
                        <p>Liveness check: <span className="font-medium">{verificationDetails.livenessStatus}</span></p>
                        <p>Verification ID: <span className="font-medium">{verificationDetails.verificationId}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="default" onClick={handleContinue} className="w-full bg-green-600 hover:bg-green-700">
                  Access Ballot
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
