import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import SignInGoogle from "./signInGoogleApp";
import { useNavigate, Link } from "react-router-dom";

/**
 * Componente de inicio de sesión
 * Permite a los usuarios acceder con email/contraseña o Google
 */
function Login() {
  const navigate = useNavigate();
  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Procesa el envío del formulario de inicio de sesión
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast.success("Inicio de sesión exitoso", {
        position: "top-center",
        autoClose: 2000,
      });
      
      // Redirigir al dashboard principal
      navigate("/");
    } catch (error) {
      // Mostrar mensajes de error personalizados según el código
      let errorMessage;
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "El formato del correo electrónico no es válido";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo electrónico";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        case "auth/too-many-requests":
          errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
          break;
        default:
          errorMessage = "Error al iniciar sesión. Inténtalo de nuevo";
      }
      
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-8">
      {/* Título del formulario */}
      <h2 className="text-3xl font-bold text-white text-center mb-6">Iniciar Sesión</h2>
      
      {/* Formulario de email y contraseña */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo de email */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu contraseña"
            required
          />
        </div>

        {/* Botón de inicio de sesión */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-800 text-white font-semibold py-3 rounded-lg transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>

        {/* Enlace para registro */}
        <p className="text-center text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-sky-700 hover:underline hover:text-sky-400">
            Regístrate aquí
          </Link>
        </p>
      </form>

      {/* Separador y opción de inicio con Google */}
      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-gray-700 w-full"></div>
          <span className="bg-slate-900 text-gray-400 text-sm px-2 absolute">O continúa con</span>
        </div>
        <SignInGoogle />
      </div>
    </div>
  );
}

export default Login;
