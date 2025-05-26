import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext(null);

// Evento personalizado para notificar el cierre de sesión
export const LOGOUT_EVENT = "firebase_auth_logout";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthContextProvider");
  }
  return context;
};

export function AuthContextProvider({ children }) {
  // Estado para almacenar usuario actual
  const [user, setUser] = useState(null);
  // Estado para controlar la carga inicial de autenticación
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    // Disparar evento personalizado antes de cerrar sesión
    // para que otros sistemas (como Spotify) puedan reaccionar
    window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));

    // Esperar un breve momento para permitir que se completen otros cierres de sesión
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Cerrar sesión en Firebase Auth
    return signOut(auth);
  };

  // Observador de cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Valores proporcionados al contexto
  const authValues = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user, // Añadido para facilitar comprobaciones de autenticación
  };

  return (
    <AuthContext.Provider value={authValues}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}
