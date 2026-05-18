import React from 'react';

const ModalTrazabilidad = ({ abierto, onClose, cargando, historial }) => {
  if (!abierto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header">
          <h3 style={{ margin: 0, color: '#646cff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⛓️ Historial del Documento
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted, #888)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 5px' }}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {cargando ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando historial...</p>
          ) : historial.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay historial para este documento.</p>
          ) : (
            <ul className="timeline-list">
              {historial.map((registro, index) => {
                let fechaMostrar = "Fecha desconocida";
                if (registro.Timestamp) {
                   fechaMostrar = registro.Timestamp.substring(0, 19);
                }

                return (
                  <li key={index} className="timeline-item" style={{ marginBottom: index === historial.length - 1 ? '0' : '30px' }}>
                    <span className="timeline-dot"></span>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-main, #fff)', fontSize: '1.1rem' }}>
                      {registro.IsDelete ? '🗑️ Documento Eliminado' : (index === 0 ? '📝 Registro Original' : '🔄 Actualización de Estado')}
                    </h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#f1c40f' }}>📅 {fechaMostrar}</p>
                    
                    <div className="timeline-box">
                      <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>
                        <strong>Código de registro:</strong> <br/>
                        <span style={{ color: '#2ecc71', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.75rem' }}>{registro.TxId}</span>
                      </p>
                      {!registro.IsDelete && registro.Value && (
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                          <strong>Estado del documento:</strong> {registro.Value.Status === 'ACTIVE' ? '✅ Documento vigente' : '❌ Documento revocado'}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTrazabilidad;