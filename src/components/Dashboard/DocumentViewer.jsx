import React from 'react';
import { FileText, X } from 'lucide-react';

const DocumentViewer = ({ docPrevia, onClose }) => {
  if (!docPrevia) return null;

  return (
    <div className="modal-visor-mobile" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-panel)', width: '90%', maxWidth: '1000px',
        height: '85vh', borderRadius: '12px', padding: '20px',
        position: 'relative', display: 'flex', flexDirection: 'column',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
            <FileText color="#646cff" /> Visor de Documento
          </h3>
          <button
            onClick={onClose}
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{ flex: 1, backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <iframe
            src={docPrevia.startsWith('http') ? docPrevia : `${import.meta.env.VITE_API_URL}/${docPrevia}`}
            width="100%" height="100%" style={{ border: 'none' }} title="Visor Completo"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;