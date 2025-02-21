import React, { useState, useCallback, useEffect } from 'react';
import { api } from '../../../services/api';
import { useFetchVehicleData } from '../../../hooks/useFetchVehicleData';
import './styles.css';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleAdded: () => void;
}

const initialVehicleState = {
  model: '',
  color: '',
  year: '',
  image: null as File | null,
};

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onVehicleAdded,
}) => {
  const [vehicle, setVehicle] = useState(initialVehicleState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { models, colors, isLoading, error: fetchError } = useFetchVehicleData(isOpen);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVehicle(initialVehicleState);
      setSubmitError(null);
    }
  }, [isOpen]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setVehicle(prev => ({ ...prev, image: e.target.files![0] }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setVehicle(initialVehicleState);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!vehicle.model || !vehicle.color || !vehicle.year || !vehicle.image) {
      setSubmitError('Por favor, preencha todos os campos.');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.name) {
        throw new Error('Usuário não autenticado');
      }

      const formData = new FormData();
      formData.append('model', vehicle.model);
      formData.append('color', vehicle.color);
      formData.append('year', vehicle.year);
      formData.append('image', vehicle.image);
      formData.append('creationUserName', user.name);
      formData.append('updatedUserName', user.name);

      await api.createVehicle(formData);
      onVehicleAdded();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao adicionar veículo');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h2 id="modal-title">Adicionar Veículo</h2>
        
        {(fetchError || submitError) && (
          <div className="error-message" role="alert">
            {fetchError || submitError}
          </div>
        )}

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="model">Modelo:</label>
              <select
                id="model"
                name="model"
                value={vehicle.model}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="">Selecione...</option>
                {models.map((model) => (
                  <option key={model.uuid} value={model.uuid}>
                    {model.modelName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Cor:</label>
              <select
                id="color"
                name="color"
                value={vehicle.color}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="">Selecione...</option>
                {colors.map((color) => (
                  <option key={color.uuid} value={color.uuid}>
                    {color.colorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Ano:</label>
              <input
                id="year"
                type="number"
                name="year"
                value={vehicle.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Imagem:</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" disabled={submitting}>
                {submitting ? 'Adicionando...' : 'Adicionar'}
              </button>
              <button type="button" onClick={onClose} disabled={submitting}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddVehicleModal;
