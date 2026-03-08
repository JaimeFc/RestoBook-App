import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonText, 
  IonIcon, 
  IonToggle,
  IonItem,
  IonLabel
} from '@ionic/react';
import { 
  chevronForwardOutline, 
  calendarOutline, 
  restaurantOutline, 
  peopleOutline, 
  checkmarkCircleOutline,
  pinOutline,
  notificationsOutline
} from 'ionicons/icons';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const history = useHistory();

  const finishOnboarding = async () => {
    await Preferences.set({ key: 'onboarding_completed', value: 'true' });
    history.replace('/register');
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else finishOnboarding();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ 
            position: 'relative',
            height: '100%', 
            width: '100%',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url("assets/onboarding1.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: '60px', width: '100%' }}>
              <IonText style={{ color: 'white' }}>
                <h1 style={{ fontWeight: 'bold', fontSize: '22px' }}>Reservas_Go</h1>
              </IonText>
            </div>

            <div style={{ marginTop: 'auto', marginBottom: '140px', padding: '0 10px' }}>
              <h1 style={{ color: 'white', fontSize: '34px', fontWeight: 'bold', lineHeight: '1.1' }}>
                ¡Bienvenido a tu mesa ideal!
              </h1>
              <p style={{ color: 'white', fontSize: '18px', marginTop: '15px', opacity: '0.9' }}>
                Descubre, reserva y disfruta de los mejores restaurantes al instante.
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ padding: '60px 20px', textAlign: 'center', height: '100%', backgroundColor: 'white' }}>
            <IonText><h2 style={{ fontWeight: 'bold', color: '#333' }}>Reservas_Go</h2></IonText>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '40px' }}>Beneficios Exclusivos</h1>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '40px 0' }}>
              <div style={{ border: '2px solid #16a34a', borderRadius: '50%', padding: '15px', color: '#16a34a' }}><IonIcon icon={calendarOutline} size="large" /></div>
              <div style={{ border: '2px solid #16a34a', borderRadius: '50%', padding: '15px', color: '#16a34a' }}><IonIcon icon={restaurantOutline} size="large" /></div>
              <div style={{ border: '2px solid #16a34a', borderRadius: '50%', padding: '15px', color: '#16a34a' }}><IonIcon icon={peopleOutline} size="large" /></div>
            </div>

            <div style={{ textAlign: 'left', display: 'inline-block', width: '80%' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}><IonIcon icon={checkmarkCircleOutline} color="success" /> Reserva Fácil y Rápida</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}><IonIcon icon={checkmarkCircleOutline} color="success" /> Confirmación Instantánea</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}><IonIcon icon={checkmarkCircleOutline} color="success" /> Ofertas Personalizadas</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ padding: '60px 20px', textAlign: 'center', height: '100%', backgroundColor: '#f0f9f1' }}>
            <IonText><h2 style={{ fontWeight: 'bold' }}>Reservas_Go</h2></IonText>
            <div style={{ margin: '30px 0' }}>
               <IonIcon icon={pinOutline} color="success" style={{ fontSize: '60px' }} />
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>¡Casi listo!</h1>
            <p style={{ color: '#666' }}>Para empezar, crea tu cuenta</p>

            <div style={{ marginTop: '40px' }}>
              <IonItem lines="none" style={{ '--background': 'white', borderRadius: '15px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <IonIcon icon={pinOutline} slot="start" color="success" />
                <IonLabel style={{ textAlign: 'left' }}>Ubicación <p>Restaurantes cercanos</p></IonLabel>
                <IonToggle slot="end" color="success" defaultChecked />
              </IonItem>
              <IonItem lines="none" style={{ '--background': 'white', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <IonIcon icon={notificationsOutline} slot="start" color="success" />
                <IonLabel style={{ textAlign: 'left' }}>Notificaciones <p>Confirmaciones y ofertas</p></IonLabel>
                <IonToggle slot="end" color="success" defaultChecked />
              </IonItem>
            </div>
          </div>
        );
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        {renderStep()}

        {/* Controles de navegación inferiores (Flotantes) */}
        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          width: '100%', 
          padding: '0 25px',
          zIndex: 10
        }}>
          {/* Indicadores de página (Puntos) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ 
                width: i === currentStep ? '22px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: i === currentStep ? '#16a34a' : (currentStep === 0 ? 'rgba(255,255,255,0.5)' : '#ccc'),
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
            {currentStep < 2 ? (
              <>
                <IonButton 
                  fill="clear" 
                  onClick={finishOnboarding}
                  style={{ '--color': currentStep === 0 ? 'white' : '#16a34a', fontWeight: '600' }}
                >
                  SALTAR
                </IonButton>
                <IonButton 
                  onClick={handleNext}
                  style={{ 
                    '--background': '#16a34a', 
                    '--border-radius': '25px',
                    '--padding-start': '25px',
                    '--padding-end': '25px',
                    minWidth: '140px'
                  }}
                >
                  SIGUIENTE <IonIcon icon={chevronForwardOutline} slot="end" />
                </IonButton>
              </>
            ) : (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <IonButton 
                  expand="block" 
                  onClick={finishOnboarding}
                  style={{ '--background': '#16a34a', '--border-radius': '25px', height: '50px' }}
                >
                  REGISTRARME AHORA
                </IonButton>
                <p style={{ fontSize: '13px', marginTop: '15px', color: '#666' }}>
                  ¿Ya tienes cuenta? <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Inicia Sesión</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;