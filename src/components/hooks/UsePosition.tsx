/*import { useState, useEffect } from 'react';

interface Position {
  latitude: number;
  longitude: number;
}

const usePosition = (): Position | null => {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const success = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ latitude, longitude });
    };

    const error = (err: GeolocationPositionError) => {
      console.error('Ошибка получения геолокации:', err);
      setPosition(null);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error('Геолокация не поддерживается этим браузером.');
      setPosition(null);
    }

    // Очистка при размонтировании компонента
    return () => {
      setPosition(null);
    };
  }, []);

  return position;
};

export default usePosition;*/