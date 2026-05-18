import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ usuario, onLogout }) => {
  return (
    <div className="header-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px', backgroundColor: 'var(--bg-panel)', borderRadius: '8px' }}>
      <div>
        <h2 style={{ margin: 0, color: '#646cff' }}>Mi Espacio de Documentos</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {usuario.fullName} ({usuario.role === 'admin' ? 'Administrador' : 'Estudiante'})
        </p>
      </div>
      <button onClick={onLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px' }}>
        <LogOut size={18} /> Salir
      </button>
    </div>
  );
};

export default Header;