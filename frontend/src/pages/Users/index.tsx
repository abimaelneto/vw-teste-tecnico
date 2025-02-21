import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import './styles.css';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUsers();
      setUsers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Usuários</h1>
        <button 
          onClick={handleAddUser}
          className="add-button"
        >
          Adicionar Usuário
        </button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>Tipo</th>
            <th>Data de Criação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uuid}>
              <td>{user.name}</td>
              <td>
                <span className={`status ${user.isActived ? 'active' : 'inactive'}`}>
                  {user.isActived ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>{user.isRoot ? 'Root' : 'Usuário'}</td>
              <td>{new Date(user.creationDate).toLocaleDateString()}</td>
              <td>
                <button 
                  className="edit-button"
                  onClick={() => handleEditUser(user)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={fetchUsers}
      />

      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onUserUpdated={fetchUsers}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default Users;