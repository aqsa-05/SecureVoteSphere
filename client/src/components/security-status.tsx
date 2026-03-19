import { SecurityLog } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SecurityStatusProps {
  logs: SecurityLog[];
}

interface DefenseLayer {
  name: string;
  icon: string;
  status: "active" | "warning" | "error";
  description: string;
}

export default function SecurityStatus({ logs }: SecurityStatusProps) {
  const [defenseLayers] = useState<DefenseLayer[]>([
    {
      name: "Biometric Authentication",
      icon: "verified_user",
      status: "active",
      description: "AI face verification processing at normal levels"
    },
    {
      name: "End-to-End Encryption",
      icon: "lock",
      status: "active",
      description: "AES-256 encryption running on all data transfers"
    },
    {
      name: "Adversarial Defense",
      icon: "shield",
      status: "active",
      description: "ML protection against spoofing attacks enabled"
    },
    {
      name: "Role-Based Access",
      icon: "admin_panel_settings",
      status: "active",
      description: "Strict permission enforcement active on all routes"
    },
    {
      name: "Blockchain Ledger",
      icon: "article",
      status: "active",
      description: "Immutable vote recording with blocks stored"
    },
    {
      name: "Intrusion Detection",
      icon: "warning",
      status: "warning",
      description: "Suspicious login attempts detected (IP blocked)"
    }
  ]);

  // Get security incidents from logs
  const securityIncidents = logs.filter(log => 
    log.severity === "Critical" || log.severity === "Warning"
  ).slice(0, 15);

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Real-Time Security Monitoring</CardTitle>
          <CardDescription>
            Zero Trust Defense System Status
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Security Layers */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Defense Layers Status</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {defenseLayers.map((layer, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`mr-2 ${
                          layer.status === "active" ? "text-green-500" :
                          layer.status === "warning" ? "text-yellow-500" : "text-red-500"
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {layer.icon === "verified_user" && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m6 12 3 3 6-6"/></>}
                            {layer.icon === "lock" && <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                            {layer.icon === "shield" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>}
                            {layer.icon === "admin_panel_settings" && <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>}
                            {layer.icon === "article" && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}
                            {layer.icon === "warning" && <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{layer.name}</span>
                      </div>
                      <Badge variant={
                        layer.status === "active" ? "success" :
                        layer.status === "warning" ? "warning" : "destructive"
                      }>
                        {layer.status === "active" ? "Active" : 
                         layer.status === "warning" ? "Alert" : "Error"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {layer.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Security Incidents */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Security Incidents</h4>
              <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {securityIncidents.length > 0 ? (
                      securityIncidents.map((log, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.event}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={
                              log.severity === "Critical" ? "destructive" : 
                              log.severity === "Warning" ? "warning" : "outline"
                            }>
                              {log.severity}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.details?.action || "No action taken"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No security incidents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Zero Trust Settings</CardTitle>
          <CardDescription>
            Configure security thresholds and monitoring parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Authentication Factors</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Biometric Verification</span>
                  <Badge variant="outline" className="bg-green-50">Required</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password Authentication</span>
                  <Badge variant="outline" className="bg-green-50">Required</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Token (Admin)</span>
                  <Badge variant="outline" className="bg-green-50">Required</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Security Thresholds</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP Blocking Threshold</span>
                  <span className="text-sm font-medium">3 attempts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Face Match Confidence</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admin Session Timeout</span>
                  <span className="text-sm font-medium">15 minutes</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-3">Activity Monitoring</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Real-time security monitoring active</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Suspicious activity detection enabled</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Comprehensive audit logging active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
