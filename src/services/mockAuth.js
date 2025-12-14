/**
 * Mock Authentication Service
 * Simule un backend pour tester le frontend sans API réelle
 */

// Base de données mock des utilisateurs
const mockUsers = {
  'etudiant@issatkr.rnu.tn': {
    password: 'Student@2025',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MzI1MzYwMDB9.mocktoken',
    refreshToken: 'refresh-token-student-123',
    user: {
      id: 1,
      email: 'etudiant@issatkr.rnu.tn',
      role: 'student',
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      studentId: '20241234',
      phone: '+216 20 123 456',
      avatar: null,
      department: 'Génie Informatique',
      level: '2ème année',
      enrollmentDate: '2023-09-15'
    }
  },
  'enseignant@issatkr.rnu.tn': {
    password: 'Teacher@2025',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MzI1MzYwMDB9.mocktoken',
    refreshToken: 'refresh-token-teacher-456',
    user: {
      id: 2,
      email: 'enseignant@issatkr.rnu.tn',
      role: 'teacher',
      firstName: 'Fatma',
      lastName: 'Gharbi',
      teacherId: 'PROF789',
      phone: '+216 21 654 321',
      avatar: null,
      department: 'Département Informatique',
      specialization: 'Réseaux et Systèmes',
      hireDate: '2018-09-01'
    }
  },
  'admin@issatkr.rnu.tn': {
    password: 'Admin@2025',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzMyNTM2MDAwfQ.mocktoken',
    refreshToken: 'refresh-token-admin-789',
    user: {
      id: 3,
      email: 'admin@issatkr.rnu.tn',
      role: 'admin',
      firstName: 'Mohamed',
      lastName: 'Trabelsi',
      adminId: 'ADM001',
      phone: '+216 98 765 432',
      avatar: null,
      position: 'Chef du Service Scolarité',
      department: 'Administration',
      hireDate: '2015-01-10'
    }
  }
};

// Simuler un délai réseau
const simulateNetworkDelay = (min = 500, max = 1500) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Mock Login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
export const mockLogin = async (email, password) => {
  await simulateNetworkDelay();

  const userData = mockUsers[email];

  // Vérifier si l'utilisateur existe
  if (!userData) {
    throw new Error('Email incorrect');
  }

  // Vérifier le mot de passe
  if (userData.password !== password) {
    throw new Error('Mot de passe incorrect');
  }

  // Le rôle est automatiquement détecté depuis les données de l'utilisateur
  // Retourner les données de l'utilisateur authentifié
  return {
    access: userData.token,
    refresh: userData.refreshToken,
    user: userData.user
  };
};

/**
 * Mock Register
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
export const mockRegister = async (userData) => {
  await simulateNetworkDelay();

  // Vérifier si l'email existe déjà
  if (mockUsers[userData.email]) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Simuler la création d'un nouvel utilisateur
  const newUser = {
    id: Object.keys(mockUsers).length + 1,
    email: userData.email,
    role: userData.role,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    avatar: null,
    studentId: userData.role === 'student' ? `STD${Date.now()}` : undefined,
    teacherId: userData.role === 'teacher' ? `PROF${Date.now()}` : undefined,
    adminId: userData.role === 'admin' ? `ADM${Date.now()}` : undefined,
  };

  return {
    access: 'mock-new-user-token',
    refresh: 'mock-new-user-refresh-token',
    user: newUser
  };
};

/**
 * Mock Refresh Token
 * @param {string} refreshToken 
 * @returns {Promise<Object>}
 */
export const mockRefreshToken = async (refreshToken) => {
  await simulateNetworkDelay(200, 500);

  // Vérifier si le refresh token est valide
  const user = Object.values(mockUsers).find(u => u.refreshToken === refreshToken);
  
  if (!user) {
    throw new Error('Refresh token invalide');
  }

  return {
    access: user.token,
    refresh: user.refreshToken
  };
};

/**
 * Mock Forgot Password
 * @param {string} email 
 * @returns {Promise<Object>}
 */
export const mockForgotPassword = async (email) => {
  await simulateNetworkDelay();

  const userData = mockUsers[email];

  if (!userData) {
    throw new Error('Aucun compte trouvé avec cet email');
  }

  return {
    message: 'Un email de réinitialisation a été envoyé à votre adresse',
    success: true
  };
};

/**
 * Mock Reset Password
 * @param {string} token 
 * @param {string} newPassword 
 * @returns {Promise<Object>}
 */
export const mockResetPassword = async (token, newPassword) => {
  await simulateNetworkDelay();

  // Simuler la validation du token
  if (!token || token.length < 10) {
    throw new Error('Token invalide ou expiré');
  }

  // Simuler la mise à jour du mot de passe
  return {
    message: 'Votre mot de passe a été réinitialisé avec succès',
    success: true
  };
};

/**
 * Mock Get Current User
 * @param {string} token 
 * @returns {Promise<Object>}
 */
export const mockGetCurrentUser = async (token) => {
  await simulateNetworkDelay(200, 500);

  // Trouver l'utilisateur correspondant au token
  const user = Object.values(mockUsers).find(u => u.token === token);

  if (!user) {
    throw new Error('Token invalide');
  }

  return user.user;
};

/**
 * Mock Logout
 * @returns {Promise<Object>}
 */
export const mockLogout = async () => {
  await simulateNetworkDelay(200, 400);
  
  return {
    message: 'Déconnexion réussie',
    success: true
  };
};

// Export des utilisateurs mock pour référence
export const getMockUsers = () => {
  return Object.entries(mockUsers).map(([email, data]) => ({
    email,
    password: data.password,
    role: data.user.role,
    name: `${data.user.firstName} ${data.user.lastName}`
  }));
};

export default {
  mockLogin,
  mockRegister,
  mockRefreshToken,
  mockForgotPassword,
  mockResetPassword,
  mockGetCurrentUser,
  mockLogout,
  getMockUsers
};
