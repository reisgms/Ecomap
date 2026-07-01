import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

export type StatusLocalizacao = 'carregando' | 'concedida' | 'negada' | 'erro';

export function useLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [status, setStatus] = useState<StatusLocalizacao>('carregando');

  const solicitarLocalizacao = useCallback(async () => {
    setStatus('carregando');
    try {
      const { status: permissao } = await Location.requestForegroundPermissionsAsync();
      if (permissao !== 'granted') {
        setStatus('negada');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setStatus('concedida');
    } catch (e) {
      console.warn('Erro ao obter localização:', e);
      setStatus('erro');
    }
  }, []);

  useEffect(() => {
    solicitarLocalizacao();
  }, [solicitarLocalizacao]);

  return { location, status, solicitarLocalizacao };
}
