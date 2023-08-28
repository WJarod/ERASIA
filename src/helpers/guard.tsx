// AuthGuard.tsx

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

interface AuthGuardProps {
  element: React.ReactNode;
  redirectTo: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ element, redirectTo }) => {
  const isAuthenticatedUser = isAuthenticated();

  return isAuthenticatedUser ? <>{element}</> : <Navigate to={redirectTo} />;
};

export default AuthGuard;
