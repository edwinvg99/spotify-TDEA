import React, { useState, useEffect } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../authFirebase/services/firebase";
// Importaciones correctas por servicio
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../authFirebase/context/AuthContext";

function MyProfile() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtiene el usuario actual del contexto de autenticación
  const [isEditing, setIsEditing] = useState(false); // Controla el modo de edición
  const [isLoading, setIsLoading] = useState(true); // Controla el estado de carga
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    photo: "",
    createdAt: "",
  });
  const [newPhotoFile, setNewPhotoFile] = useState(null); // Almacena el archivo de imagen seleccionado
  const [photoPreview, setPhotoPreview] = useState(""); // URL para la vista previa de la foto

  // Carga datos del usuario desde Firestore cuando el componente se monta o cambia el usuario
  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      try {
        setIsLoading(true);
        const userDoc = await getDoc(doc(db, "Users", user.uid));

        if (userDoc.exists()) {
          // Si existe el documento, carga los datos
          const data = userDoc.data();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || user.email,
            photo: data.photo || user.photoURL || "",
            createdAt: data.createdAt || "",
          });
          if (data.photo) setPhotoPreview(data.photo);
        } else {
          // Si no existe, crea un nuevo documento con info básica
          const displayNameParts = user.displayName
            ? user.displayName.split(" ")
            : ["", ""];
          const newUserData = {
            firstName: displayNameParts[0] || "",
            lastName: displayNameParts.slice(1).join(" ") || "",
            email: user.email,
            photo: user.photoURL || "",
            createdAt: new Date().toISOString(),
          };

          try {
            await setDoc(doc(db, "Users", user.uid), newUserData);
            setUserData(newUserData);
          } catch (error) {
            console.error("Error al crear el documento del usuario:", error);
            toast.error("Error al crear perfil en la base de datos");
          }
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        toast.error("Error al cargar datos del perfil");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  /**
   * Maneja el cambio de archivo para la foto de perfil
   * Valida tipo y tamaño, genera vista previa
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones de archivo
    if (!file.type.includes("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setNewPhotoFile(file);

    // Genera vista previa de la imagen
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Maneja el cierre de sesión
   * Redirecciona al usuario a la página de login
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  /**
   * Actualiza la información del perfil en Firestore y Firebase Auth
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsLoading(true);

      let photoURL = userData.photo;

      if (newPhotoFile) {
        const storageRef = ref(storage, `profile-photos/${user.uid}`);
        await uploadBytes(storageRef, newPhotoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const dataToUpdate = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        photo: photoURL,
      };

      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, dataToUpdate);
      } else {
        await setDoc(userDocRef, {
          ...dataToUpdate,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      // Actualizar en Firebase Auth
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`.trim(),
        photoURL: photoURL,
      });

      // Actualizar estado local
      setUserData({
        ...userData,
        photo: photoURL,
      });

      setNewPhotoFile(null);
      toast.success("Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="text-white text-xl">Cargando datos del perfil...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Encabezado del perfil */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Mi Perfil</h2>
        <p className="text-gray-400">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      {/* Tarjeta principal del perfil */}
      <div className="bg-gray-800 bg-opacity-50 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-purple-900/30">
        <div className="md:flex">
          {/* Sección izquierda: foto y datos básicos */}
          <div className="md:w-1/3 bg-gradient-to-br from-purple-900 to-gray-900 p-6 flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-purple-500 shadow-lg">
              <img
                src={
                  photoPreview ||
                  userData.photo ||
                  "https://i.pravatar.cc/300?u=" + user?.uid
                }
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {`${userData.firstName} ${userData.lastName}`.trim() ||
                "Usuario DJ Nova"}
            </h3>
            <p className="text-purple-300 text-sm">{userData.email}</p>

            {userData.createdAt && (
              <p className="text-gray-400 text-xs mt-2">
                Miembro desde:{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Sección derecha: información detallada y formulario */}
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                Información Personal
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-3 text-sm text-purple-400 hover:text-purple-300"
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </button>
              </h3>

              {isEditing ? (
                // Formulario de edición
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={userData.firstName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={userData.lastName}
                        onChange={(e) =>
                          setUserData({ ...userData, lastName: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Foto de perfil
                    </label>
                    <div className="flex items-center">
                      {photoPreview && (
                        <div className="mr-3 w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={photoPreview}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <label className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition">
                        <span>Seleccionar imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </form>
              ) : (
                // Vista de solo lectura
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-gray-400 text-sm">Nombre</h4>
                      <p className="text-white">
                        {userData.firstName || "No especificado"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-gray-400 text-sm">Apellido</h4>
                      <p className="text-white">
                        {userData.lastName || "No especificado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm">Email</h4>
                    <p className="text-white">{userData.email}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm">ID de usuario</h4>
                    <p className="text-white text-sm font-mono bg-gray-700 px-2 py-1 rounded">
                      {user?.uid}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de cerrar sesión */}
            <div className="pt-4 border-t border-gray-700">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition flex items-center"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
