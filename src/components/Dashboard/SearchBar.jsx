import React from 'react';
import { Search, Filter, List, LayoutGrid, Clock } from 'lucide-react';

const SearchBar = ({ 
  filtroTexto, setFiltroTexto, 
  filtroCategoria, setFiltroCategoria, 
  ordenFecha, setOrdenFecha, 
  vista, setVista 
}) => {
  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock color="#f1c40f" />
          <h3 style={{ margin: 0 }}>Mi Almacenamiento Criptográfico</h3>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--input-bg)', borderRadius: '6px', padding: '4px' }}>
          <button
            onClick={() => setVista('lista')}
            style={{ background: vista === 'lista' ? 'var(--bg-panel)' : 'transparent', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', color: vista === 'lista' ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.2s' }}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setVista('cuadricula')}
            style={{ background: vista === 'cuadricula' ? 'var(--bg-panel)' : 'transparent', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', color: vista === 'cuadricula' ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.2s' }}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      <div className="filtros-mobile" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', backgroundColor: 'var(--bg-panel)', padding: '10px', borderRadius: '8px' }}>
        <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--input-bg)', borderRadius: '4px', padding: '0 10px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" placeholder="Buscar por nombre..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)}
            style={{ width: '100%', border: 'none', backgroundColor: 'transparent', padding: '8px', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
        
        <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--input-bg)', borderRadius: '4px', padding: '0 10px' }}>
          <Filter size={16} color="var(--text-muted)" style={{ marginRight: '5px' }} />
          <select 
            value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{ width: '100%', border: 'none', backgroundColor: 'transparent', padding: '8px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Todas las categorías</option>
            <option value="Certificado">Certificado</option>
            <option value="Carnet">Carnet</option>
            <option value="Contrato">Contrato</option>
            <option value="Factura">Factura</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <select 
            value={ordenFecha} onChange={(e) => setOrdenFecha(e.target.value)}
            style={{ width: '100%', border: 'none', backgroundColor: 'var(--input-bg)', padding: '10px', borderRadius: '4px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="desc">Más Recientes ↑</option>
            <option value="asc">Más Antiguos ↓</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;