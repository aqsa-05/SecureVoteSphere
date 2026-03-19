import { useWebSocket } from "@/hooks/use-websocket";
import { useState, useEffect } from "react";

type SecurityStatus = "active" | "warning" | "error";

interface SecurityBannerProps {
  sessionId: string;
}

export default function SecurityBanner({ sessionId }: SecurityBannerProps) {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>("active");
  const { lastMessage } = useWebSocket();
  
  // Listen for security alerts via WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'SECURITY_ALERT') {
          if (data.severity === 'critical') {
            setSecurityStatus("error");
          } else if (data.severity === 'warning') {
            setSecurityStatus("warning");
          }
          
          // Reset to active after 5 seconds
          setTimeout(() => {
            setSecurityStatus("active");
          }, 5000);
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    }
  }, [lastMessage]);

  return (
    <div className="bg-primary text-white px-4 py-2 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        <span className="text-sm font-medium">Secure Voting System</span>
      </div>
      <div className="flex items-center">
        <span
          className={`text-sm mr-4 flex items-center before:mr-1.5 before:inline-block before:h-2 before:w-2 before:rounded-full ${
            securityStatus === "active"
              ? "before:bg-green-400"
              : securityStatus === "warning"
              ? "before:bg-yellow-400"
              : "before:bg-red-400"
          }`}
        >
          {securityStatus === "active"
            ? "System Protected"
            : securityStatus === "warning"
            ? "Security Alert"
            : "Security Breach"}
        </span>
        <span className="text-sm">Session ID: <span>{sessionId}</span></span>
      </div>
    </div>
  );
}
