import { useEffect } from "react";
import { useSpotify } from "../../authSpotify/context/SpotifyContext";
import { useAuth } from "../../../features/authFirebase/context/AuthContext";
import { db } from "../../../features/authFirebase/services/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const PlaylistLogger = () => {
  const { token } = useSpotify();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllPlaylistsInfo = async () => {
      if (!token || !user) return;

      try {
        console.log(
          "=== INICIANDO OBTENCIÓN DE PLAYLISTS DESPUÉS DEL LOGIN ==="
        );

        // Obtener las playlists del usuario
        const playlistsResponse = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!playlistsResponse.ok) {
          throw new Error("Error al obtener playlists");
        }

        const playlistsData = await playlistsResponse.json();

        // Array para guardar solo la información útil de las playlists
        const usefulPlaylistsData = [];

        // Obtener detalles completos de cada playlist
        for (const playlist of playlistsData.items.slice(0, 3)) {
          try {
            const playlistDetailResponse = await fetch(
              `https://api.spotify.com/v1/playlists/${playlist.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (playlistDetailResponse.ok) {
              const playlistDetail = await playlistDetailResponse.json();

              // Extraer solo la información útil para el componente visual
              const usefulData = {
                id: playlistDetail.id,
                name: playlistDetail.name,
                description: playlistDetail.description,
                images: playlistDetail.images,
                tracks: {
                  total: playlistDetail.tracks.total,
                },
                owner: {
                  display_name: playlistDetail.owner.display_name,
                },
                public: playlistDetail.public,
                collaborative: playlistDetail.collaborative,
                external_urls: {
                  spotify: playlistDetail.external_urls.spotify,
                },
                followers: {
                  total: playlistDetail.followers.total,
                },
                // Agregar timestamp para saber cuándo se guardó
                savedAt: new Date().toISOString(),
              };

              usefulPlaylistsData.push(usefulData);
            }
          } catch (error) {
            console.error(
              `Error obteniendo detalles de playlist ${playlist.name}:`,
              error
            );
          }
        }

        // Mostrar información en consola
        console.log("=== INFORMACIÓN ÚTIL PARA COMPONENTE VISUAL ===");
        console.log(usefulPlaylistsData);

        console.log("=== EJEMPLOS DE URLs PÚBLICAS ===");
        usefulPlaylistsData.forEach((playlist) => {
          console.log(`${playlist.name}: ${playlist.external_urls.spotify}`);
        });

        // Guardar en Firestore
        if (usefulPlaylistsData.length > 0) {
          await savePlaylistsToFirestore(user.uid, usefulPlaylistsData);
        }
      } catch (error) {
        console.error("Error obteniendo información de playlists:", error);
      }
    };

    // Solo ejecutar cuando tengamos token y usuario autenticado
    if (token && user) {
      fetchAllPlaylistsInfo();
    }
  }, [token, user]);

  const savePlaylistsToFirestore = async (userId, playlists) => {
    try {
      console.log("=== GUARDANDO PLAYLISTS EN FIRESTORE ===");

      // Referencia al documento del usuario
      const userDocRef = doc(db, "Users", userId);

      // Actualizar el documento agregando el campo playlists
      await updateDoc(userDocRef, {
        playlists: playlists,
        playlistsUpdatedAt: new Date().toISOString(),
      });

      console.log("✅ Playlists guardadas exitosamente en Firestore");
      console.log("📊 Total de playlists guardadas:", playlists.length);
    } catch (error) {
      console.error("❌ Error guardando playlists en Firestore:", error);

      // Intentar crear el documento si no existe
      try {
        await setDoc(
          userDocRef,
          {
            playlists: playlists,
            playlistsUpdatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        console.log("✅ Playlists guardadas con merge exitosamente");
      } catch (mergeError) {
        console.error("❌ Error en operación merge:", mergeError);
      }
    }
  };

  return null;
};

export default PlaylistLogger;
