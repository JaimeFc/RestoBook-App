import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAvatar,
  IonList,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonText
} from "@ionic/react";
import { cameraOutline, alertCircleOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { authService } from "../services/auth.service";
import { useProfile, useRefreshData } from "../hooks/useRealtimeData";

const Profile: React.FC = () => {
  // Hook de datos
  const { data: user, isLoading, isError, error } = useProfile();
  const { refreshProfile } = useRefreshData();
  
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refreshProfile();
    event.detail.complete();
  };

  const handleLogout = async () => {
    await authService.signout();
    window.location.href = "/login";
  };

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Foto de Perfil',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar una foto'
      });

      if (image.webPath) {
        setUserPhoto(image.webPath);
      }
    } catch (e) {
      console.warn("Cámara cerrada por el usuario");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U"; // Cambiado a 'U' de Usuario por defecto
    return name
      .split(" ")
      .filter(n => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Desliza para actualizar"
            refreshingSpinner="crescent"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        {/* 1. ESTADO DE CARGA */}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        )}

        {/* 2. ESTADO DE ERROR (Si no carga la API) */}
        {isError && !isLoading && (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: "64px", color: "var(--ion-color-danger)" }} />
            <IonText color="danger">
              <p>No pudimos conectar con el servidor.</p>
            </IonText>
            <IonButton fill="outline" onClick={() => refreshProfile()}>Reintentar</IonButton>
          </div>
        )}

        {/* 3. RENDERIZADO DE DATOS (Con comprobación de seguridad) */}
        {user && !isLoading && (
          <div className="animate__animated animate__fadeIn">
            <div className="profile-header" style={{ marginTop: "32px", marginBottom: "24px", textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <IonAvatar
                  onClick={takePhoto}
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: "var(--ion-color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "white",
                    border: "4px solid var(--ion-color-primary-tint)",
                    margin: '0 auto',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  {userPhoto ? (
                    <img src={userPhoto} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(user.name || user.username || "Usuario")
                  )}
                </IonAvatar>
                
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  backgroundColor: 'var(--ion-color-primary)',
                  borderRadius: '50%',
                  padding: '8px',
                  display: 'flex',
                  border: '2px solid white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <IonIcon icon={cameraOutline} style={{ color: 'white', fontSize: '18px' }} />
                </div>
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '16px' }}>
                {user.name || user.username || "Cargando..."}
              </div>
              <div style={{ color: 'var(--ion-color-medium)' }}>
                {user.email || "Email no disponible"}
              </div>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px 20px" }}>
              <IonCard style={{ margin: "0 0 16px 0", borderRadius: '15px' }}>
                <IonCardHeader>
                  <IonCardTitle>Información de la Cuenta</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines="none">
                    <IonItem>
                      <IonLabel>
                        <h3 style={{ fontWeight: 600 }}>Usuario</h3>
                        <p>{user.username}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h3 style={{ fontWeight: 600 }}>Email</h3>
                        <p>{user.email}</p>
                      </IonLabel>
                    </IonItem>
                    {user.dni && (
                      <IonItem>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600 }}>DNI</h3>
                          <p>{user.dni}</p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonList>
                </IonCardContent>
              </IonCard>

              <IonButton
                expand="block"
                color="danger"
                onClick={handleLogout}
                style={{ marginTop: '20px', '--border-radius': '10px' }}
              >
                Cerrar Sesión
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;