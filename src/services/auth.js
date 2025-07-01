// Mock user data for demonstration
const MOCK_USERS = {
  admin: {
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin'
  },
  authorities: [
    {
      agencyId: 'PNP001',
      badgeNumber: 'B12345',
      password: 'police123', // In a real app, this would be hashed
      role: 'authority',
      agency: 'Philippine National Police'
    },
    {
      agencyId: 'DILG001',
      badgeNumber: 'D98765',
      password: 'dilg123', // In a real app, this would be hashed
      role: 'authority',
      agency: 'DILG'
    }
  ]
};

export const loginAdmin = async (username, password) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (username === MOCK_USERS.admin.username && password === MOCK_USERS.admin.password) {
    const userData = { ...MOCK_USERS.admin };
    delete userData.password;
    
    // Store auth data in localStorage
    localStorage.setItem('safepin_auth', JSON.stringify({
      user: userData,
      token: 'mock-admin-token' // In a real app, this would be a JWT
    }));
    
    return userData;
  }
  
  throw new Error('Invalid credentials');
};

export const loginAuthority = async (agencyId, badgeNumber, password) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const authority = MOCK_USERS.authorities.find(
    auth => auth.agencyId === agencyId && 
    auth.badgeNumber === badgeNumber && 
    auth.password === password
  );

  if (authority) {
    const userData = { ...authority };
    delete userData.password;
    
    // Store auth data in localStorage
    localStorage.setItem('safepin_auth', JSON.stringify({
      user: userData,
      token: 'mock-authority-token' // In a real app, this would be a JWT
    }));
    
    return userData;
  }
  
  throw new Error('Invalid credentials');
};

export const logout = () => {
  localStorage.removeItem('safepin_auth');
};

export const getCurrentUser = () => {
  const auth = localStorage.getItem('safepin_auth');
  return auth ? JSON.parse(auth).user : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
}; 