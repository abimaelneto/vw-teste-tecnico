import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './NavBar.css';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        
        <span>VW Admin</span>
      </div>

      <div className="navbar-links">
        <button onClick={() => navigate("/vehicles")}>Veículos</button>
        {user.isRoot && (
          <button onClick={() => navigate("/users")}>Usuários</button>
        )}
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
    </nav>
  );
};

export default NavBar;