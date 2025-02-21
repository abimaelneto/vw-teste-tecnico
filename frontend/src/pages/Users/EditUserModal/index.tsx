import React, { useState, useCallback, useEffect } from 'react';
import { api } from '../../../services/api';
import { User } from '../../../types';
import './styles.css';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
  user
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    password: '',
    isActived: user.isActived,
    isRoot: user.isRoot
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name,
        password: '',
        isActived: user.isActived,
        isRoot: user.isRoot
      });
      setSubmitError(null);
    }
  }, [isOpen, user]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name) {
      setSubmitError('Nome é obrigatório');
      return;
    }

    setSubmitting(true);
    try {
      await api.updateUser(user.uuid, formData);
      onUserUpdated();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
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
        <h2 id="modal-title">Editar Usuário</h2>

        {submitError && (
          <div className="error-message" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Nova Senha (opcional):</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Deixe em branco para manter a senha atual"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isActived"
                checked={formData.isActived}
                onChange={handleChange}
                disabled={submitting}
              />
              Usuário Ativo
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isRoot"
                checked={formData.isRoot}
                onChange={handleChange}
                disabled={submitting}
              />
              Usuário Root
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
