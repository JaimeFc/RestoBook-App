import React, { useEffect, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonSpinner, IonRefresher,
  IonRefresherContent, IonText, IonIcon, IonAvatar, IonButtons,
  IonList, IonItem, IonLabel, IonBadge
} from "@ionic/react";
import { calendarOutline, mapOutline, personOutline, peopleOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { useProfile, useRefreshData } from "../hooks/useRealtimeData";
import axios from "axios";

const Home: React.FC = () => {
  const { data: user, isLoading } = useProfile();
  const { refreshProfile } = useRefreshData();
  const [weather, setWeather] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingRes, setLoadingRes] = useState(true);

  const fetchWeather = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/api/weather?city=Quito", {
        headers: { 'x-resto-token': 'RestoBook2026' }
      });
      setWeather(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchReservations = async () => {
    setLoadingRes(true);
    try {
      const response = await axios.get("http://10.0.2.2:3000/api/reservations/today", {
        headers: { 'x-resto-token': 'RestoBook2026' }
      });
      setReservations(response.data);
    } catch (error) { console.error(error); }
    finally { setLoadingRes(false); }
  };

  useEffect(() => {
    fetchWeather();
    fetchReservations();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await Promise.all([refreshProfile(), fetchWeather(), fetchReservations()]);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle style={{ fontWeight: 'bold', color: '#8b4513' }}>RestoBook Gourmet</IonTitle>
          <IonButtons slot="end">
             <div style={{ display: 'flex', alignItems: 'center', paddingRight: '15px' }}>
                <IonAvatar style={{ width: '32px', height: '32px', marginRight: '8px' }}>
                  <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="admin" />
                </IonAvatar>
                <IonText color="dark"><small>admin</small></IonText>
             </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingText="Actualizar" refreshingSpinner="crescent" />
        </IonRefresher>

        <div style={{ padding: "16px" }}>
          {/* CLIMA */}
          {weather && (
            <IonCard style={{ background: '#ffffff', borderRadius: '20px', margin: '0 0 20px 0', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
              <IonCardContent style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={weather.icono?.startsWith('http') ? weather.icono : `https://openweathermap.org/img/wn/${weather.icono}@2x.png`} alt="clima" style={{ width: '45px', marginRight: '10px' }} />
                <IonText color="dark">
                  <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '600' }}>{Math.round(weather.temperatura)}°C, {weather.descripcion}</h2>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          {user && !isLoading && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '700', fontSize: '2rem', color: '#5d2e0a', margin: '0' }}>Hola, {user.username} 👋</h1>
            </div>
          )}

          {/* GRID DE BOTONES - ACTUALIZADO CON RUTAS TABS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <IonCard routerLink="/tabs/reservar" style={{ background: 'linear-gradient(135deg, #a0522d 0%, #8b4513 100%)', margin: 0, borderRadius: '18px', textAlign: 'center', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <IonIcon icon={calendarOutline} style={{ fontSize: '32px', color: 'white' }} />
              <IonText style={{ color: 'white', fontWeight: '500' }}>Reservar Mesa</IonText>
            </IonCard>

            <IonCard routerLink="/tabs/mapa" style={{ background: 'linear-gradient(135deg, #8b7355 0%, #705a3e 100%)', margin: 0, borderRadius: '18px', textAlign: 'center', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <IonIcon icon={mapOutline} style={{ fontSize: '32px', color: 'white' }} />
              <IonText style={{ color: 'white', fontWeight: '500' }}>Mapa de Mesas</IonText>
            </IonCard>

            <IonCard routerLink="/tabs/perfil" style={{ background: 'linear-gradient(135deg, #8b7355 0%, #705a3e 100%)', margin: 0, borderRadius: '18px', textAlign: 'center', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <IonIcon icon={personOutline} style={{ fontSize: '32px', color: 'white' }} />
              <IonText style={{ color: 'white', fontWeight: '500' }}>Mi Cuenta</IonText>
            </IonCard>

            <IonCard routerLink="/tabs/usuarios" style={{ background: 'linear-gradient(135deg, #a0522d 0%, #8b4513 100%)', margin: 0, borderRadius: '18px', textAlign: 'center', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <IonIcon icon={peopleOutline} style={{ fontSize: '32px', color: 'white' }} />
              <IonText style={{ color: 'white', fontWeight: '500' }}>Usuarios</IonText>
            </IonCard>
          </div>

          {/* LISTA DE RESERVAS ABAJO */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: '0 0 15px 0', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>Reservas para Hoy</h3>
            {loadingRes ? <div style={{ textAlign: 'center' }}><IonSpinner name="crescent" /></div> : 
              reservations.length > 0 ? (
                <IonList lines="none">
                  {reservations.map((res: any, i: number) => (
                    <IonItem key={i}><IonLabel><h2>{res.customerName}</h2><p>Mesa {res.tableNumber}</p></IonLabel></IonItem>
                  ))}
                </IonList>
              ) : <p style={{ textAlign: 'center', color: '#888' }}>No hay reservas para hoy.</p>
            }
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Home;