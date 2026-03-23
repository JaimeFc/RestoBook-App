import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonList, IonItem, IonLabel,
  IonInput, IonTextarea, IonButton, IonIcon, IonCard,
  IonCardContent, IonSelect, IonSelectOption, IonLoading, IonToast
} from "@ionic/react";
import { 
  calendarOutline, 
  timeOutline, 
  restaurantOutline, 
  peopleOutline, 
  chatbubbleEllipsesOutline,
  checkmarkCircle
} from "ionicons/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Reservar: React.FC = () => {
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    mesa: "",
    personas: "",
    observaciones: ""
  });

  const handleConfirm = async () => {
    // 1. Validación básica de campos obligatorios
    if (!formData.fecha || !formData.hora || !formData.mesa || !formData.personas) {
      setToastMessage("Por favor, completa todos los campos obligatorios");
      setShowToast(true);
      return;
    }

    setShowLoading(true);

    try {
      // 2. Uso de la variable de entorno del .env con respaldo (fallback)
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://10.0.2.2:3000";
      const API_URL = `${API_BASE_URL}/api/reservations`;

      console.log("Intentando conectar a:", API_URL);

      const response = await axios.post(API_URL, {
        customerName: "admin", // Idealmente aquí usarías el nombre del usuario autenticado
        tableNumber: formData.mesa,
        date: formData.fecha,
        time: formData.hora,
        guests: formData.personas,
        notes: formData.observaciones,
        status: "Pending"
      }, {
        headers: { 
          'x-resto-token': 'RestoBook2026',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos de espera máxima
      });

      if (response.status === 201 || response.status === 200) {
        setToastMessage("¡Reserva confirmada con éxito!");
        setShowToast(true);
        
        // Regresar al Home después de 2 segundos para que vean el Toast
        setTimeout(() => {
          history.push("/tabs/inicio");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error detallado:", error);

      // 3. Manejo de errores específico para ayudar al diagnóstico
      if (error.response) {
        // El servidor respondió pero con un error (404, 500, etc.)
        setToastMessage(`Error del servidor (${error.response.status}): ${error.response.data.message || 'Intenta de nuevo'}`);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta (Problema de IP o CORS)
        setToastMessage("No se pudo contactar al servidor. Verifica tu conexión e IP.");
      } else {
        // Error al configurar la petición
        setToastMessage("Error al procesar la solicitud. Intenta de nuevo.");
      }
      
      setShowToast(true);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonLoading isOpen={showLoading} message={"Procesando reserva..."} />
      <IonToast 
        isOpen={showToast} 
        message={toastMessage} 
        duration={4000} 
        onDidDismiss={() => setShowToast(false)} 
        position="bottom"
        buttons={[{ text: 'Cerrar', role: 'cancel' }]}
      />

      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/inicio" color="dark" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold', color: '#8b4513' }}>Nueva Reserva</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Completa los datos para asegurar tu mesa en RestoBook Gourmet.
          </p>
        </div>

        <IonCard style={{ borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', margin: 0 }}>
          <IonCardContent>
            <IonList lines="none">
              
              {/* FECHA */}
              <div style={{ marginBottom: '15px' }}>
                <IonLabel style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: '8px', color: '#a0522d' }}>
                  <IonIcon icon={calendarOutline} style={{ marginRight: '8px' }} /> Fecha
                </IonLabel>
                <IonItem style={{ '--background': '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                  <IonInput 
                    type="date" 
                    value={formData.fecha}
                    onIonInput={(e) => setFormData({...formData, fecha: e.detail.value!})}
                  />
                </IonItem>
              </div>

              {/* HORA */}
              <div style={{ marginBottom: '15px' }}>
                <IonLabel style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: '8px', color: '#a0522d' }}>
                  <IonIcon icon={timeOutline} style={{ marginRight: '8px' }} /> Hora de llegada
                </IonLabel>
                <IonItem style={{ '--background': '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                  <IonInput 
                    type="time" 
                    value={formData.hora}
                    onIonInput={(e) => setFormData({...formData, hora: e.detail.value!})}
                  />
                </IonItem>
              </div>

              {/* MESA */}
              <div style={{ marginBottom: '15px' }}>
                <IonLabel style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: '8px', color: '#a0522d' }}>
                  <IonIcon icon={restaurantOutline} style={{ marginRight: '8px' }} /> Selecciona tu Mesa
                </IonLabel>
                <IonItem style={{ '--background': '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                  <IonSelect 
                    placeholder="Click para ver mesas" 
                    interface="action-sheet"
                    value={formData.mesa}
                    onIonChange={(e) => setFormData({...formData, mesa: e.detail.value})}
                  >
                    <IonSelectOption value="1">Mesa 1 - Ventana</IonSelectOption>
                    <IonSelectOption value="2">Mesa 2 - VIP</IonSelectOption>
                    <IonSelectOption value="5">Mesa 5 - Terraza</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </div>

              {/* PERSONAS */}
              <div style={{ marginBottom: '15px' }}>
                <IonLabel style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: '8px', color: '#a0522d' }}>
                  <IonIcon icon={peopleOutline} style={{ marginRight: '8px' }} /> Número de Personas
                </IonLabel>
                <IonItem style={{ '--background': '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                  <IonInput 
                    type="number" 
                    placeholder="Ej. 4" 
                    value={formData.personas}
                    onIonInput={(e) => setFormData({...formData, personas: e.detail.value!})}
                  />
                </IonItem>
              </div>

              {/* OBSERVACIONES */}
              <div style={{ marginBottom: '20px' }}>
                <IonLabel style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: '8px', color: '#a0522d' }}>
                  <IonIcon icon={chatbubbleEllipsesOutline} style={{ marginRight: '8px' }} /> Observaciones Especiales
                </IonLabel>
                <IonItem style={{ '--background': '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
                  <IonTextarea 
                    placeholder="Ej: Alergias, silla para bebé..." 
                    rows={3}
                    value={formData.observaciones}
                    onIonInput={(e) => setFormData({...formData, observaciones: e.detail.value!})}
                  />
                </IonItem>
              </div>

            </IonList>

            <IonButton 
              expand="block" 
              onClick={handleConfirm}
              style={{ '--background': '#d35400', '--border-radius': '12px', height: '50px', fontWeight: 'bold' }}
            >
              <IonIcon icon={checkmarkCircle} slot="start" />
              Confirmar Solicitud de Reserva
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Reservar;