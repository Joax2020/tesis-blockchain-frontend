// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Search, ShieldCheck, FileText, Upload, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, LayoutGrid, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import '../App.css';

import SkeletonCard       from '../components/Dashboard/SkeletonCard';
import ModalTrazabilidad  from '../components/ModalTrazabilidad';
import FormularioSubida   from '../components/FormularioSubida';
import Chatbot            from '../components/Chatbot';
import Header             from '../components/Dashboard/Header';
import SearchBar          from '../components/Dashboard/SearchBar';
import DocumentViewer     from '../components/Dashboard/DocumentViewer';
import DocumentTable      from '../components/Dashboard/DocumentTable';

import { isTokenValid } from '../utils/authUtils';

// ─── Helpers de API ──────────────────────────────────────────────────────────
const api = (url, opts = {}) => {
  const token = localStorage.getItem('token');
  const { headers: extraHeaders, ...restOpts } = opts;
  return axios({
    url: `${import.meta.env.VITE_API_URL}${url}`,
    withCredentials: true,
    ...restOpts,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...extraHeaders,
    },
  });
};

// ─── Subcomponente: TipsBanner ────────────────────────────────────────────────
const TipsBanner = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [visible, setVisible] = useState(true);

  const tips = [
    { icon: '📄', text: 'Prioriza PDFs digitales originales para un OCR preciso.' },
    { icon: '⏱️', text: 'Documentos extensos pueden demorar más en procesarse.' },
    { icon: '🔒', text: 'Cambiar un solo carácter altera por completo la firma Blockchain.' },
    { icon: '🤖', text: 'Formatos ideales para el asistente RAG: PDFs limpios e imágenes HD.' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentTip(p => (p + 1) % tips.length);
        setVisible(true);
      }, 300);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 18px',
      borderRadius: '8px',
      backgroundColor: 'var(--input-bg)',
      border: '1px solid var(--border-line)',
      marginBottom: '24px',
      transition: 'opacity 0.3s ease',
      opacity: visible ? 1 : 0,
    }}>
      <span style={{ fontSize: '1.1rem' }}>{tips[currentTip].icon}</span>
      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-main)', marginRight: '4px' }}>Tip:</strong>
        {tips[currentTip].text}
      </p>
    </div>
  );
};

// ─── Subcomponente: AuditoriaCard ─────────────────────────────────────────────
const AuditoriaCard = ({ onVerificar, searchId, documentoBlockchain, errorBusqueda }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onVerificar({ target: { files: [file] } });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          backgroundColor: 'rgba(46,204,113,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldCheck size={18} color="#2ecc71" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Verificar Autenticidad</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comprueba integridad Blockchain</p>
        </div>
      </div>

      {/* Info callout */}
      <div style={{
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: 'rgba(46,100,213,0.08)',
        borderLeft: '3px solid #3b6fd4',
      }}>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Si el archivo <strong style={{ color: 'var(--text-main)' }}>ya existe</strong> en la red y no lo has subido tú, podría indicar <strong style={{ color: '#e27b3b' }}>falsificación documental</strong>. Reporta al administrador.
        </p>
      </div>

      {/* Drop zone */}
      <label
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '24px 16px',
          border: `2px dashed ${isDragging ? '#2ecc71' : 'var(--border-line)'}`,
          borderRadius: '10px',
          backgroundColor: isDragging ? 'rgba(46,204,113,0.05)' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}>
        <Upload size={22} color={isDragging ? '#2ecc71' : 'var(--text-muted)'} />
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Arrastra un archivo aquí o <span style={{ color: '#2ecc71', fontWeight: '600' }}>selecciona</span>
        </p>
        <input type="file" onChange={onVerificar} style={{ display: 'none' }} />
      </label>

      {/* Hash preview */}
      {searchId && searchId !== 'Calculando...' && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '6px',
          backgroundColor: 'var(--input-bg)',
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          wordBreak: 'break-all',
          border: '1px solid var(--border-line)',
        }}>
          <span style={{ color: 'var(--text-main)', marginRight: '6px' }}>SHA-256:</span>
          {searchId}
        </div>
      )}

      {searchId === 'Calculando...' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Calculando hash...
        </div>
      )}

      {/* Error */}
      {errorBusqueda && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px', borderRadius: '8px',
          backgroundColor: 'rgba(231,76,60,0.08)',
          border: '1px solid rgba(231,76,60,0.3)',
        }}>
          <AlertCircle size={16} color="#e74c3c" />
          <p style={{ margin: 0, color: '#e74c3c', fontSize: '0.85rem', fontWeight: '500' }}>{errorBusqueda}</p>
        </div>
      )}

      {/* Éxito */}
      {documentoBlockchain && (
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(46,204,113,0.08)',
          border: '1px solid rgba(46,204,113,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <CheckCircle2 size={16} color="#2ecc71" />
            <strong style={{ color: '#2ecc71', fontSize: '0.88rem' }}>Documento auténtico y sin alteraciones</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              ['Registrado por', documentoBlockchain.OwnerID],
              ['Fecha de registro', documentoBlockchain.UploadDate],
            ].map(([label, value]) => (
              <div key={label} style={{
                padding: '8px 10px', borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', fontWeight: '500' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [misDocumentos, setMisDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('desc');
  const [vista, setVista] = useState('lista');

  const [docPrevia, setDocPrevia] = useState(null);
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
  const [historialDoc, setHistorialDoc] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const [searchId, setSearchId] = useState('');
  const [documentoBlockchain, setDocumentoBlockchain] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  // ── Carga inicial del usuario ───────────────────────────────────────────
  useEffect(() => {
    const guardado = localStorage.getItem('usuario');
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  // ── Validación periódica del token ──────────────────────────────────────
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (!isTokenValid()) {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }, 60_000);
    return () => clearInterval(intervalo);
  }, [navigate]);

  // ── Filtros con debounce ────────────────────────────────────────────────
  useEffect(() => {
    if (!usuario) return;
    const t = setTimeout(() => cargarDocumentos(1, filtroTexto, filtroCategoria, ordenFecha), 500);
    return () => clearTimeout(t);
  }, [filtroTexto, filtroCategoria, ordenFecha, usuario]);

  // ── Funciones de datos ──────────────────────────────────────────────────
  const cargarDocumentos = async (page = 1, text = filtroTexto, cat = filtroCategoria, sort = ordenFecha) => {
    setLoading(true);
    try {
      const { data } = await api('/mis-documentos', {
        params: { page, limit: 6, search: text, category: cat, sort },
      });
      setMisDocumentos(data.docs || data || []);
      setTotalPaginas(data.totalPages || 1);
      setPaginaActual(data.currentPage || 1);
    } catch {
      toast.error('Error al cargar documentos.');
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const abrirHistorial = async (hash) => {
    setModalHistorialAbierto(true);
    setCargandoHistorial(true);
    setHistorialDoc([]);
    try {
      const { data } = await api(`/documento/historial/${hash}`);
      setHistorialDoc(data);
    } catch {
      toast.error('Error al obtener la trazabilidad de la Blockchain.');
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleGuardar = async (hash, nuevoTitulo, nuevaCategoria) => {
    try {
      await api(`/documento/editar/${hash}`, {
        method: 'PUT',
        data: { nuevoTitulo, nuevaCategoria },
      });
      toast.success('¡Información actualizada!');
      cargarDocumentos(paginaActual);
    } catch {
      toast.error('Error al guardar cambios.');
    }
  };

  const handleReintentar = async (hash) => {
    try {
      await api(`/reintentar-ocr/${hash}`, { method: 'POST' });
      toast.success('Reintentando procesamiento IA...');
      setTimeout(() => cargarDocumentos(paginaActual), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo iniciar el reintento.');
    }
  };

  const handleLogout = async () => {
    await api('/auth/logout', { method: 'POST' });
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const verificarPorArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorBusqueda('');
    setDocumentoBlockchain(null);
    setSearchId('Calculando...');

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(target.result)).toString();
      setSearchId(hash);
      try {
        const { data } = await api(`/documento/${hash}`);
        setDocumentoBlockchain(data);
      } catch {
        setErrorBusqueda('❌ Archivo desconocido o alterado.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ── Guardia de render ───────────────────────────────────────────────────
  if (!usuario) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '80vh', gap: '10px', color: 'var(--text-muted)',
      }}>
        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
        Cargando perfil...
      </div>
    );
  }

  const esPDF = (url) => url?.toLowerCase().endsWith('.pdf');

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <div className="container" style={{ maxWidth: '1100px', marginTop: '24px', paddingBottom: '60px' }}>

      <Header usuario={usuario} onLogout={handleLogout} />

      <TipsBanner />

      {/* Tarjetas superiores */}
      <div className="grid-container" style={{ marginBottom: '28px' }}>
        <FormularioSubida usuario={usuario} onUploadSuccess={() => cargarDocumentos(1)} />
        <AuditoriaCard
          onVerificar={verificarPorArchivo}
          searchId={searchId}
          documentoBlockchain={documentoBlockchain}
          errorBusqueda={errorBusqueda}
        />
      </div>

      {/* Sección documentos */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '14px',
      }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
          Mis documentos
          {!loading && (
            <span style={{
              marginLeft: '8px', fontSize: '0.75rem', fontWeight: '400',
              color: 'var(--text-muted)', verticalAlign: 'middle',
            }}>
              · {misDocumentos.length} en esta página
            </span>
          )}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => cargarDocumentos(paginaActual)}
            title="Refrescar"
            style={{
              background: 'none', border: '1px solid var(--border-line)',
              borderRadius: '6px', padding: '5px 8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', color: 'var(--text-muted)',
            }}>
            <RefreshCw size={14} />
          </button>

          {/* Toggles de vista */}
          <div style={{
            display: 'flex', gap: '2px',
            border: '1px solid var(--border-line)', borderRadius: '6px', overflow: 'hidden',
          }}>
            {[
              { id: 'lista', icon: <List size={14} />, title: 'Vista lista' },
              { id: 'cuadricula', icon: <LayoutGrid size={14} />, title: 'Vista cuadrícula' },
            ].map(({ id, icon, title }) => (
              <button
                key={id}
                title={title}
                onClick={() => { setVista(id); setDocPrevia(null); }}
                style={{
                  background: vista === id ? 'var(--border-line)' : 'none',
                  border: 'none', padding: '6px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: vista === id ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'background 0.15s',
                }}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <SearchBar
        filtroTexto={filtroTexto}         setFiltroTexto={setFiltroTexto}
        filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
        ordenFecha={ordenFecha}           setOrdenFecha={setOrdenFecha}
        vista={vista}                     setVista={(v) => { setVista(v); setDocPrevia(null); }}
      />

      {/* Resultados */}
      <div style={{ marginTop: '16px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {[1,2,3,4,5,6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : misDocumentos.length === 0 ? (
          /* Empty state */
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            border: '1px dashed var(--border-line)', borderRadius: '12px',
            color: 'var(--text-muted)',
          }}>
            <FileText size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)' }}>Sin documentos</p>
            <p style={{ margin: '6px 0 0', fontSize: '0.82rem' }}>
              {filtroTexto || filtroCategoria
                ? 'No hay resultados para los filtros aplicados.'
                : 'Sube tu primer documento usando el formulario de arriba.'}
            </p>
          </div>
        ) : (
          <>
            {vista === 'lista' && (
              <DocumentTable
                documentos={misDocumentos}
                onVerDoc={setDocPrevia}
                onAbrirHistorial={abrirHistorial}
                onReintentar={handleReintentar}
                onGuardar={handleGuardar}
              />
            )}

            {vista === 'cuadricula' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {misDocumentos.map(doc => (
                  <div
                    key={doc._id}
                    onClick={() => doc.fileUrl && setDocPrevia(doc.fileUrl)}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--border-line)',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex', flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Miniatura */}
                    <div style={{
                      height: '130px', backgroundColor: '#fff', borderRadius: '6px',
                      marginBottom: '12px', overflow: 'hidden',
                      border: '1px solid var(--border-line)', position: 'relative',
                    }}>
                      {esPDF(doc.fileUrl) ? (
                        <div style={{
                          position: 'absolute', top: 0, left: '50%', width: '800px', height: '1000px',
                          transform: 'translateX(-50%) scale(0.3)', transformOrigin: 'top center',
                          pointerEvents: 'none',
                        }}>
                          <iframe
                            src={`${doc.fileUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
                            style={{ width: '100%', height: '100%', border: 'none', marginTop: '-56px' }}
                            title="Miniatura"
                            scrolling="no"
                          />
                        </div>
                      ) : (
                        <div style={{
                          height: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', backgroundColor: 'var(--bg-panel)',
                        }}>
                          <FileText size={36} color="#646cff" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h4 style={{
                      margin: '0 0 8px', fontSize: '0.88rem', fontWeight: '600',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }} title={doc.title}>
                      {doc.title}
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); abrirHistorial(doc.hash); }}
                        style={{
                          backgroundColor: 'rgba(100,108,255,0.12)',
                          color: '#646cff',
                          border: '1px solid rgba(100,108,255,0.25)',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'background 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(100,108,255,0.22)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(100,108,255,0.12)'}
                      >
                        ⏱ Trazabilidad
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {misDocumentos.length > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '8px', marginTop: '32px',
              }}>
                <button
                  className="btn-secondary"
                  disabled={paginaActual <= 1}
                  onClick={() => cargarDocumentos(paginaActual - 1)}
                  style={{
                    padding: '7px 14px', opacity: paginaActual <= 1 ? 0.4 : 1,
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem',
                  }}
                >
                  <ChevronLeft size={14} /> Anterior
                </button>

                <span style={{
                  padding: '7px 16px',
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--border-line)',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: '500',
                }}>
                  {paginaActual} / {totalPaginas}
                </span>

                <button
                  className="btn-secondary"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => cargarDocumentos(paginaActual + 1)}
                  style={{
                    padding: '7px 14px', opacity: paginaActual >= totalPaginas ? 0.4 : 1,
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem',
                  }}
                >
                  Siguiente <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales y extras */}
      <DocumentViewer docPrevia={docPrevia} onClose={() => setDocPrevia(null)} />
      <ModalTrazabilidad
        abierto={modalHistorialAbierto}
        onClose={() => setModalHistorialAbierto(false)}
        cargando={cargandoHistorial}
        historial={historialDoc}
      />
      <Chatbot />
    </div>
  );
};

export default Dashboard;