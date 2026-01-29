/**
 * Compense le zoom avec paliers
 * - 100% à 150% : zoom normal
 * - 150% à 400% : bloqué à 150% visuel
 * - 400% et plus : zoom jusqu'à 200% visuel max
 */

const FIRST_MAX_ZOOM = 1.5;  // 150% visuel max jusqu'à 400%
const THRESHOLD_ZOOM = 4.0;   // 400% = seuil pour débloquer
const SECOND_MAX_ZOOM = 2.0;  // 200% visuel max après 400%

export const initZoomControl = () => {
  const rootElement = document.getElementById('root');
  const bodyElement = document.body;
  const htmlElement = document.documentElement;
  
  if (!rootElement) return;

  const adjustZoom = () => {
    const currentZoom = window.devicePixelRatio;
    
    if (currentZoom <= FIRST_MAX_ZOOM) {
      // Jusqu'à 150% : zoom normal, pas de compensation
      rootElement.style.transform = 'none';
      rootElement.style.width = '100%';
      rootElement.style.height = '100%';
      bodyElement.style.overflow = 'auto';
      bodyElement.style.height = 'auto';
      htmlElement.style.overflow = 'auto';
      htmlElement.style.height = 'auto';
      
    } else if (currentZoom < THRESHOLD_ZOOM) {
      // Entre 150% et 400% : bloqué à 150% visuel
      const compensationScale = FIRST_MAX_ZOOM / currentZoom;
      
      rootElement.style.transform = `scale(${compensationScale})`;
      rootElement.style.transformOrigin = 'top left';
      rootElement.style.width = `${100 / compensationScale}%`;
      rootElement.style.height = `${100 / compensationScale}vh`;
      bodyElement.style.overflow = 'hidden';
      bodyElement.style.height = '100vh';
      htmlElement.style.overflow = 'hidden';
      htmlElement.style.height = '100vh';
      
    } else {
      // À partir de 400% : autorisé jusqu'à 200% visuel
      const visualZoom = Math.min(SECOND_MAX_ZOOM, FIRST_MAX_ZOOM + (currentZoom - THRESHOLD_ZOOM) * 0.5);
      const compensationScale = visualZoom / currentZoom;
      
      rootElement.style.transform = `scale(${compensationScale})`;
      rootElement.style.transformOrigin = 'top left';
      rootElement.style.width = `${100 / compensationScale}%`;
      rootElement.style.height = `${100 / compensationScale}vh`;
      bodyElement.style.overflow = 'hidden';
      bodyElement.style.height = '100vh';
      htmlElement.style.overflow = 'hidden';
      htmlElement.style.height = '100vh';
    }
    
    requestAnimationFrame(adjustZoom);
  };
  
  adjustZoom();
};
