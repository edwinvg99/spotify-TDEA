import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth, db, storage } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

/**
 * Componente de registro de usuarios
 * Permite crear nuevas cuentas con email, contraseña y foto de perfil
 * Almacena datos en Firebase Authentication y Firestore
 */
function Register() {
  const navigate = useNavigate();
  // Estados para campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  /**
   * Maneja la selección de imágenes para el perfil
   * Valida tipo y tamaño, y genera vista previa
   * @param {Event} e - Evento del input file
   */
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.includes('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }
    
    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }
    
    setPhotoFile(file);
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Procesa el registro del usuario
   * 1. Crea usuario en Firebase Auth
   * 2. Sube foto de perfil (si existe)
   * 3. Almacena datos en Firestore
   * @param {Event} e - Evento del formulario
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validación de campos requeridos
    if (!email || !password || !fname) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    // Validación básica de contraseña
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Subir la foto si existe
      let photoURL = "";
      if (photoFile) {
        const storageRef = ref(storage, `userPhotos/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        
        // Actualizar el perfil con la foto
        await updateProfile(user, {
          displayName: `${fname} ${lname}`.trim(),
          photoURL: photoURL
        });
      } else {
        // Actualizar solo el nombre si no hay foto
        await updateProfile(user, {
          displayName: `${fname} ${lname}`.trim()
        });
      }
      
      // 3. Guardar datos en Firestore con reintentos
      await saveUserDataWithRetry(user.uid, {
        email,
        firstName: fname,
        lastName: lname || "",
        photo: photoURL,
        createdAt: new Date().toISOString(),
      });

      toast.success("¡Registro exitoso!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirigir al login
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (error) {
      handleRegistrationError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guarda datos de usuario en Firestore con reintentos
   * Utiliza backoff exponencial para los reintentos
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos a guardar
   */
  const saveUserDataWithRetry = async (userId, userData) => {
    let retries = 3;
    let backoffTime = 1000; // 1 segundo inicial
    
    while (retries > 0) {
      try {
        await setDoc(doc(db, "Users", userId), userData);
        return; // Éxito, salir de la función
      } catch (error) {
        retries--;
        if (retries === 0) throw error; // Sin más reintentos, propagar error
        
        // Esperar con backoff exponencial
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        backoffTime *= 2; // Duplicar tiempo para próximo reintento
      }
    }
  };

  /**
   * Maneja los errores durante el registro
   * Muestra mensajes personalizados según el tipo de error
   * @param {Error} error - Error capturado
   */
  const handleRegistrationError = (error) => {
    let errorMessage = "Error durante el registro";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "Este correo ya está registrado";
        break;
      case 'auth/invalid-email':
        errorMessage = "Correo electrónico inválido";
        break;
      case 'auth/weak-password':
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
        break;
      default:
        errorMessage = error.message;
    }

    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-8 ">
      <h2 className="text-4xl font-bold text-white mb-8">Registro</h2>
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Campo de nombre */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        {/* Campo de apellido */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Apellido</label>
          <input
            type="text"
            placeholder="Tu apellido"
            className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>

        {/* Selector de foto de perfil */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Foto de perfil</label>
          <div className="flex items-center space-x-4">
            {photoPreview ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                <img 
                  src={photoPreview} 
                  alt="Vista previa" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <label className="cursor-pointer px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Subir foto</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoSelect}
              />
            </label>
          </div>
        </div>

        {/* Campo de email */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Email</label>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña segura"
            className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón de registro */}
        <button
          type="submit"
          className="w-full bg-purple-800 text-white font-semibold py-3 rounded-lg transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {/* Enlace a login */}
        <p className="text-gray-200 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-sky-700 hover:underline hover:text-sky-400">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
