import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from "./firebase";
import { 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut 
} from 'firebase/auth';

/**
 * Contexto de autenticación 
 * Gestiona el estado de autenticación global de la aplicación
 */
const AuthContext = createContext(null);

// Evento personalizado para notificar el cierre de sesión
export const LOGOUT_EVENT = 'firebase_auth_logout';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Objeto con usuario actual y funciones de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthContextProvider');
    }
    return context;
};

/**
 * Proveedor del contexto de autenticación
 * Encapsula toda la lógica de autenticación de la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function AuthContextProvider({ children }) {
    // Estado para almacenar usuario actual
    const [user, setUser] = useState(null);
    // Estado para controlar la carga inicial de autenticación
    const [loading, setLoading] = useState(true);

    /**
     * Registra un nuevo usuario con email y contraseña
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} Promesa de Firebase Auth
     */
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    /**
     * Inicia sesión con email y contraseña
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} Promesa de Firebase Auth
     */
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    /**
     * Cierra la sesión del usuario actual
     * Emite un evento antes de cerrar sesión para otras acciones
     * @returns {Promise} Promesa de Firebase Auth
     */
    const logout = async () => {
        // Disparar evento personalizado antes de cerrar sesión
        // para que otros sistemas (como Spotify) puedan reaccionar
        window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));
        
        // Esperar un breve momento para permitir que se completen otros cierres de sesión
        await new Promise(resolve => setTimeout(resolve, 100));
       
        
        
        // Cerrar sesión en Firebase Auth
        return signOut(auth);
    };
    
    

    // Observador de cambios en el estado de autenticación
    useEffect(() => {
        // Suscripción al evento de cambio de estado de autenticación
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
        isAuthenticated: !!user // Añadido para facilitar comprobaciones de autenticación
    };

    return (
        <AuthContext.Provider value={authValues}>
            {!loading ? children : null}
        </AuthContext.Provider>
    );
}