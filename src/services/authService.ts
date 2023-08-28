// authService.ts

export const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return !!user; // Renvoie true si l'utilisateur existe dans le stockage local, sinon false
  };
  