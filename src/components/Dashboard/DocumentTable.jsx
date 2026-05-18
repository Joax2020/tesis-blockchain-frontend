// components/Dashboard/DocumentTable.jsx
import React, { useState } from 'react';
import { ExternalLink, Clock, Eye, Pencil, Check, X, RefreshCw, Bot, BotOff } from 'lucide-react';

// ─── Botón de acción reutilizable ───────────────────────────────────────────
const ActionButton = ({ onClick, color = '#646cff', icon, label, width = '110px', variant = 'filled' }) => {
  const base = {
    padding: '6px 10px',
    fontSize: '0.78rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    cursor: 'pointer',
    borderRadius: '6px',
    width,
    fontWeight: '500',
    transition: 'all 0.15s ease',
    border: 'none',
  };

  const styles = {
    filled: { ...base, backgroundColor: color, color: 'white' },
    outlined: { ...base, backgroundColor: 'transparent', color, border: `1px solid ${color}` },
    ghost: { ...base, backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border-line)' },
  };

  return (
    <button onClick={onClick} style={styles[variant]}>
      {icon} {label}
    </button>
  );
};

// ─── Badge de estado IA ──────────────────────────────────────────────────────
const EstadoIA = ({ vectorizado, hash, onReintentar }) => {
  if (vectorizado) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2ecc71', fontSize: '0.75rem', fontWeight: '600' }}>
        <Bot size={13} /> ✅ Consultable con IA
      </span>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f39c12', fontSize: '0.75rem', fontWeight: '600' }}>
        <BotOff size={13} /> ⚠️ No disponible para consultas
      </span>
      <button
        onClick={() => onReintentar(hash)}
        style={{ background: 'none', border: 'none', color: '#3498db', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '3px' }}
      >
        <RefreshCw size={11} /> Activar IA para este documento
      </button>
    </div>
  );
};

// ─── Fila editable ───────────────────────────────────────────────────────────
const FilaDocumento = ({ doc, onVerDoc, onAbrirHistorial, onReintentar, onGuardar }) => {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(doc.title);
  const [categoria, setCategoria] = useState(doc.category || 'Otro');

  const handleGuardar = async () => {
    await onGuardar(doc.hash, titulo, categoria);
    setEditando(false);
  };

  const handleCancelar = () => {
    setTitulo(doc.title);
    setCategoria(doc.category || 'Otro');
    setEditando(false);
  };

  const inputStyle = {
    padding: '5px 8px',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-main)',
    border: '1px solid var(--accent)',
    borderRadius: '5px',
    fontSize: '0.85rem',
    width: '100%',
  };

  const CATEGORIAS = ['Certificado', 'Carnet', 'Contrato', 'Factura', 'Otro'];

  return (
    <tr style={{ borderBottom: '1px solid var(--border-line)', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(100,108,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Título */}
      <td style={{ padding: '12px 10px', maxWidth: '200px' }}>
        {editando
          ? <input value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle} />
          : <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{doc.title}</span>
        }
      </td>

      {/* Categoría */}
      <td style={{ padding: '12px 10px' }}>
        {editando ? (
          <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        ) : (
          <span style={{
            backgroundColor: 'var(--input-bg)', color: 'var(--accent)',
            padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem',
            fontWeight: '600', border: '1px solid var(--border-line)',
            letterSpacing: '0.3px'
          }}>
            {doc.category || 'Otro'}
          </span>
        )}
      </td>

      {/* Hash */}
      <td style={{ padding: '12px 10px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#646cff', backgroundColor: 'rgba(100,108,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>
          {doc.hash.substring(0, 12)}…
        </span>
      </td>

      {/* Fecha */}
      <td style={{ padding: '12px 10px', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {new Date(doc.uploadDate).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      {/* Acciones */}
      <td style={{ padding: '12px 10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>

          {/* Editar / Guardar-Cancelar */}
          {editando ? (
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={handleGuardar} style={{ padding: '5px 10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                <Check size={13} /> Guardar
              </button>
              <button onClick={handleCancelar} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <X size={13} />
              </button>
            </div>
          ) : (
            <ActionButton
              onClick={() => setEditando(true)}
              icon={<Pencil size={13} />}
              label="Editar"
              variant="ghost"
            />
          )}

          {/* Ver */}
          {doc.fileUrl && (
            <ActionButton
              onClick={() => onVerDoc(doc.fileUrl)}
              color="#0984e3"
              icon={<Eye size={13} />}
              label="Ver"
              variant="outlined"
            />
          )}

          {/* Historial */}
          <ActionButton
            onClick={() => onAbrirHistorial(doc.hash)}
            color="#646cff"
            icon={<Clock size={13} />}
            label="Historial"
            variant="filled"
          />

          {/* Estado IA */}
          <EstadoIA vectorizado={doc.vectorizado} hash={doc.hash} onReintentar={onReintentar} />
        </div>
      </td>
    </tr>
  );
};

// ─── Tabla principal ─────────────────────────────────────────────────────────
const DocumentTable = ({ documentos, onVerDoc, onAbrirHistorial, onReintentar, onGuardar }) => {
  if (documentos.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
        No se encontraron documentos con esos filtros.
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-line)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--input-bg)' }}>
            {['Título', 'Categoría', 'ID de seguridad', 'Fecha', 'Acciones'].map((col, i) => (
              <th key={col} style={{
                padding: '12px 10px', fontSize: '0.78rem', fontWeight: '700',
                color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
                textAlign: i === 4 ? 'center' : 'left',
                borderBottom: '1px solid var(--border-line)'
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documentos.map(doc => (
            <FilaDocumento
              key={doc._id}
              doc={doc}
              onVerDoc={onVerDoc}
              onAbrirHistorial={onAbrirHistorial}
              onReintentar={onReintentar}
              onGuardar={onGuardar}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;