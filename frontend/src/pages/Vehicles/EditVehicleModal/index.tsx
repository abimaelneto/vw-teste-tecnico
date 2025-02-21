import React, { useState, useCallback, useEffect } from 'react';
import { Vehicle } from '../../../types';
import { api } from '../../../services/api';
import { useFetchVehicleData } from '../../../hooks/useFetchVehicleData';
import './styles.css';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleUpdated: () => void;
  vehicle: Vehicle;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  onVehicleUpdated,
  vehicle
}) => {
  const [formData, setFormData] = useState({
    model: vehicle.model.uuid,
    color: vehicle.color.uuid,
    year: String(vehicle.year),
    image: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { models, colors, isLoading, error: fetchError } = useFetchVehicleData(isOpen);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        model: vehicle.model.uuid,
        color: vehicle.color.uuid,
        year: String(vehicle.year),
        image: null
      });
    }
  }, [isOpen, vehicle]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.model || !formData.color || !formData.year) {
      setSubmitError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.name) {
        throw new Error('Usuário não autenticado');
      }

      const updatedData = new FormData();
      updatedData.append('model', formData.model);
      updatedData.append('color', formData.color);
      updatedData.append('year', formData.year);
      updatedData.append('updatedUserName', user.name);
      
      if (formData.image) {
        updatedData.append('image', formData.image);
      }

      await api.updateVehicle(vehicle.uuid, updatedData);
      onVehicleUpdated();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao atualizar veículo');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Editar Veículo</h2>
        
        {(fetchError || submitError) && (
          <div className="error-message">
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
                value={formData.model}
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
                value={formData.color}
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
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Nova Imagem (opcional):</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={submitting}
              />
            </div>

            <div className="current-image">
              <label>Imagem Atual:</label>
              <img 
                src={`http://localhost:1880${vehicle.imagePath}`} 
                alt="Imagem atual do veículo"
                className="preview-image"
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar'}
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

export default EditVehicleModal;