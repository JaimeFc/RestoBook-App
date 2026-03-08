import React, { useEffect, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonSpinner, IonRefresher,
  IonRefresherContent, IonText
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useProfile, useRefreshData } from "../hooks/useRealtimeData";
import axios from "axios";

const Home: React.FC = () => {
  const { data: user, isLoading } = useProfile();
  const { refreshProfile } = useRefreshData();
  const [weather, setWeather] = useState<any>(null);

  const fetchWeather = async () => {
    try {
      // 10.0.2.2 es vital para el emulador de Android
      const response = await axios.get("http://10.0.2.2:3000/api/weather?city=Quito");
      console.log("Datos del clima recibidos:", response.data);
      setWeather(response.data);
    } catch (error) {
      console.error("Error al obtener clima:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await Promise.all([refreshProfile(), fetchWeather()]);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>RestoBook - Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingText="Desliza para actualizar" refreshingSpinner="crescent" />
        </IonRefresher>

        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          
          {/* SALUDO */}
          {user && !isLoading && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontWeight: 'bold' }}>Hola, {user.name || user.username} 👋</h2>
              <p style={{ color: "var(--ion-color-medium)" }}>Bienvenido a tu espacio personal</p>
            </div>
          )}

          {/* CARD DE CLIMA - MEJORADA */}
          {weather ? (
            <IonCard style={{ 
              background: 'linear-gradient(135deg, #8b4513 0%, #5d2e0a 100%)', 
              borderRadius: '16px',
              margin: '0 0 20px 0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <IonCardContent style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                <IonText color="light">
                  <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>Clima en {weather.ciudad}</p>
                </IonText>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                  <img 
                    src={weather.icono?.startsWith('http') ? weather.icono : `https://openweathermap.org/img/wn/${weather.icono}@2x.png`} 
                    alt="clima" 
                    style={{ width: '80px', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))' }} 
                  />
                  <span style={{ fontSize: '3.5rem', fontWeight: 'bold', marginLeft: '10px' }}>
                    {Math.round(weather.temperatura)}°C
                  </span>
                </div>
                
                <p style={{ textTransform: 'capitalize', fontSize: '1.3rem', margin: 0, fontWeight: '500' }}>
                  {weather.descripcion}
                </p>
              </IonCardContent>
            </IonCard>
          ) : (
             <div style={{ textAlign: 'center', padding: '10px' }}>
               <p style={{ color: '#8b4513' }}>Cargando datos del tiempo...</p>
             </div>
          )}

          {/* INFORMACIÓN PERSONAL */}
          {user && !isLoading && (
            <IonCard style={{ margin: "0", borderRadius: '16px' }}>
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: '1.2rem' }}>Información Personal</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem><IonLabel><h3>Usuario</h3><p>{user.username}</p></IonLabel></IonItem>
                  <IonItem><IonLabel><h3>Email</h3><p>{user.email}</p></IonLabel></IonItem>
                  <IonItem><IonLabel><h3>Rol</h3><p style={{ textTransform: "capitalize" }}>{user.role}</p></IonLabel></IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <IonSpinner name="crescent" />
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;