import React, { useState, useCallback, useEffect } from "react";
import { api } from "../../../services/api";
import { User } from "../../../types";
import "./styles.css";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const initialUserState = {
  name: "",
  password: "",
  isActived: true,
  isRoot: false,
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onUserAdded,
}) => {
  const [user, setUser] = useState(initialUserState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setUser(initialUserState);
      setSubmitError(null);
    }
  }, [isOpen]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      setUser((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user.name || !user.password) {
      setSubmitError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createUser(user);
      onUserAdded();
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao adicionar usuário"
      );
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
        <h2 id="modal-title">Adicionar Usuário</h2>

        {submitError && (
          <div className="error-message" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="isActived">Ativo:</label>
            <input
              id="isActived"
              type="checkbox"
              name="isActived"
              checked={user.isActived}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="isRoot">Root:</label>
            <input
              id="isRoot"
              type="checkbox"
              name="isRoot"
              checked={user.isRoot}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Adicionando..." : "Adicionar Usuário"}
            </button>
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
