import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

export default function VoterSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <aside className="w-full md:w-64 bg-white shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m16 13-3.5 3.5-2-2L8 17"/></svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name || "Voter"}</p>
            <p className="text-xs text-gray-500">ID: {user?.voterId || "Unknown"}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/ballot"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                location === "/ballot"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/>
              </svg>
              Current Ballot
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                location === "/history"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
              </svg>
              Voting History
            </Link>
          </li>
          <li>
            <Link
              href="/verification"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                location === "/verification"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 16v-2a2 2 0 0 0-2-2h-1"/><path d="M18 10V8a2 2 0 0 0-2-2h-1"/>
              </svg>
              ID Verification
            </Link>
          </li>
          <li>
            <Link
              href="/help"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                location === "/help"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
              </svg>
              Help & Support
            </Link>
          </li>
        </ul>
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="px-4 py-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Security Status</div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-xs">
                <span className="before:mr-1.5 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-green-500">Connection Secure</span>
              </div>
              <div className="flex items-center text-xs">
                <span className="before:mr-1.5 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-green-500">Encryption Active</span>
              </div>
              <div className="flex items-center text-xs">
                <span className="before:mr-1.5 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-green-500">AI Defense Enabled</span>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-2 mt-2">
            <button
              onClick={() => logout()}
              className="w-full flex items-center px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
