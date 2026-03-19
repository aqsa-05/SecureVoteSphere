import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { User, VoterLogin, AdminLogin } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/use-websocket';

// Auth types
type LoginCredentials = 
  | { type: 'voter'; credentials: VoterLogin }
  | { type: 'admin'; credentials: AdminLogin };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => { throw new Error('AuthContext not initialized'); }
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { send } = useWebSocket();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (loginData: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    
    try {
      let endpoint = '';
      let credentials = {};
      
      if (loginData.type === 'voter') {
        endpoint = '/api/auth/voter/login';
        credentials = loginData.credentials;
      } else {
        endpoint = '/api/auth/admin/login';
        credentials = loginData.credentials;
        console.log('Admin login attempt with endpoint:', endpoint);
        console.log('Admin credentials:', credentials);
      }
      
      console.log(`Sending ${loginData.type} login request to ${endpoint}`);
      const response = await apiRequest('POST', endpoint, credentials);
      const userData = await response.json();
      console.log('Login response data:', userData);
      
      setUser(userData);
      console.log('User state updated:', userData);
      
      // Send login event to WebSocket for monitoring
      send({
        type: 'USER_LOGIN',
        userId: userData.id,
        role: userData.role
      });
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}`,
        variant: 'default'
      });
      
      if (loginData.type === 'admin') {
        console.log('Admin login successful - user role:', userData.role);
      }
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive'
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      
      // Send logout event to WebSocket for monitoring
      if (user) {
        send({
          type: 'USER_LOGOUT',
          userId: user.id,
          role: user.role
        });
      }
      
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
        variant: 'default'
      });
    } catch (error) {
      console.error('Logout failed:', error);
      
      toast({
        title: 'Logout Failed',
        description: 'Failed to log out properly',
        variant: 'destructive'
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
