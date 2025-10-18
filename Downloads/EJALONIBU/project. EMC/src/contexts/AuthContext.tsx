import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'worker';
  avatar?: string;
  projects: string[];
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('emc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    if (email === 'demo@emcmetalworks.com' && password === 'demo123') {
      const mockUser: User = {
        id: 'user_001',
        name: 'John Doe',
        email: 'demo@emcmetalworks.com',
        phone: '+234 123 456 7890',
        role: 'customer',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        projects: ['proj_001', 'proj_002'],
        joinDate: '2024-01-15'
      };
      
      setUser(mockUser);
      localStorage.setItem('emc_user', JSON.stringify(mockUser));
      setLoading(false);
      return true;
    }
    
    // Admin login credentials
    if ((email === 'admin@emcmetalworks.com' && password === 'admin123') ||
        (email === 'manager@emcmetalworks.com' && password === 'manager123')) {
      const adminUser: User = {
        id: email === 'admin@emcmetalworks.com' ? 'admin_001' : 'manager_001',
        name: email === 'admin@emcmetalworks.com' ? 'Super Admin' : 'Manager Admin',
        email: email,
        phone: '+234 123 456 7890',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        projects: [],
        joinDate: '2020-01-01'
      };
      
      setUser(adminUser);
      localStorage.setItem('emc_user', JSON.stringify(adminUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('emc_user');
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: 'customer',
      projects: [],
      joinDate: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('emc_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;