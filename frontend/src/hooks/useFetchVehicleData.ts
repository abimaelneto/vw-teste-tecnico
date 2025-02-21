import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Model, Color } from '../types';

export const useFetchVehicleData = (isOpen: boolean) => {
  const [models, setModels] = useState<Model[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [modelsData, colorsData] = await Promise.all([
          api.getModels(),
          api.getColors()
        ]);
        setModels(modelsData);
        setColors(colorsData);
      } catch (error) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  return { models, colors, isLoading, error };
};