// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Search, ShieldCheck, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import '../App.css';

import SkeletonCard       from '../components/Dashboard/SkeletonCard';
import ModalTrazabilidad  from '../components/ModalTrazabilidad';
import FormularioSubida   from '../components/FormularioSubida';
import Chatbot            from '../components/Chatbot';
import Header             from '../components/Dashboard/Header';
import SearchBar          from '../components/Dashboard/SearchBar';
import DocumentViewer     from '../components/Dashboard/DocumentViewer';
import DocumentTable      from '../components/Dashboard/DocumentTable';   // 👈 NUEVO

import { isTokenValid } from '../utils/authUtils';

// ─── Helpers de API ──────────────────────────────────────────────────────────
const api = (url, opts = {}) =>{
  const token = localStorage.getItem('token');
  return axios({ url: `${import.meta.env.VITE_API_URL}${url}`, withCredentials: true, ...opts, headers: {
    'Authorization': `Bearer ${token}`,
    ...opts
  }});
};
// ─── Componente ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  // Usuario
  const [usuario, setUsuario] = useState(null);

  // Documentos y paginación
  const [misDocumentos,  setMisDocumentos]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [paginaActual,   setPaginaActual]   = useState(1);
  const [totalPaginas,   setTotalPaginas]   = useState(1);

  // Filtros y vista
  const [filtroTexto,    setFiltroTexto]    = useState('');
  const [filtroCategoria,setFiltroCategoria]= useState('');
  const [ordenFecha,     setOrdenFecha]     = useState('desc');
  const [vista,          setVista]          = useState('lista');

  // Modales y previsualización
  const [docPrevia,              setDocPrevia]              = useState(null);
  const [modalHistorialAbierto,  setModalHistorialAbierto]  = useState(false);
  const [historialDoc,           setHistorialDoc]           = useState([]);
  const [cargandoHistorial,      setCargandoHistorial]      = useState(false);

  // Auditoría
  const [searchId,           setSearchId]           = useState('');
  const [documentoBlockchain,setDocumentoBlockchain] = useState(null);
  const [errorBusqueda,      setErrorBusqueda]       = useState('');

  // ── Carga inicial del usuario ─────────────────────────────────────────────
  useEffect(() => {
    const guardado = localStorage.getItem('usuario');
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  // ── Validación periódica del token ────────────────────────────────────────
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

  // ── Filtros con debounce ──────────────────────────────────────────────────
  useEffect(() => {
    if (!usuario) return;
    const t = setTimeout(() => cargarDocumentos(1, filtroTexto, filtroCategoria, ordenFecha), 500);
    return () => clearTimeout(t);
  }, [filtroTexto, filtroCategoria, ordenFecha, usuario]);

  // ── Funciones de datos ────────────────────────────────────────────────────
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
    localStorage.removeItem('token'); // 👈 también limpia el token
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

  // ── Guardias de render ────────────────────────────────────────────────────
  if (!usuario) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-main)' }}>Cargando perfil...</div>;
  }

  const esPDF = (url) => url?.toLowerCase().endsWith('.pdf');

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="container" style={{ maxWidth: '1100px', marginTop: '20px' }}>

      <Header usuario={usuario} onLogout={handleLogout} />

      {/* Tarjetas superiores */}
      <div className="grid-container">
        <FormularioSubida usuario={usuario} onUploadSuccess={() => cargarDocumentos(1)} />

        {/* Auditoría */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Search color="#2ecc71" />
            <h3 style={{ margin: 0 }}>Auditoría Inteligente</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Sube un documento para comprobar si es el original y no ha sido alterado.
          </p>
          <div style={{ padding: '15px', border: '2px dashed #2ecc71', textAlign: 'center', borderRadius: '8px', marginBottom: '15px', backgroundColor: 'var(--success-bg)' }}>
            <input type="file" onChange={verificarPorArchivo} style={{ width: '100%' }} />
          </div>

          {searchId && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#666', fontFamily: 'monospace', marginBottom: '8px' }}>
              ID: {searchId.substring(0, 15)}...
            </p>
          )}
          {errorBusqueda && (
            <div style={{ padding: '10px', backgroundColor: 'var(--error-bg)', borderRadius: '8px', borderLeft: '4px solid #e74c3c' }}>
              <p style={{ margin: 0, color: '#e74c3c', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{errorBusqueda}</p>
            </div>
          )}
          {documentoBlockchain && (
            <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', borderLeft: '4px solid #2ecc71' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={20} /> ¡Documento Verídico!
              </h4>
              <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>Certificado a:</strong> {documentoBlockchain.OwnerID}</p>
              <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>Sello:</strong> {documentoBlockchain.UploadDate}</p>
            </div>
          )}
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <SearchBar
        filtroTexto={filtroTexto}       setFiltroTexto={setFiltroTexto}
        filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
        ordenFecha={ordenFecha}         setOrdenFecha={setOrdenFecha}
        vista={vista}                   setVista={(v) => { setVista(v); setDocPrevia(null); }}
      />

      {/* Resultados */}
      <div style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {[1,2,3,4,5,6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <>
            {/* ── Vista lista ── */}
            {vista === 'lista' && (
              <DocumentTable
                documentos={misDocumentos}
                onVerDoc={setDocPrevia}
                onAbrirHistorial={abrirHistorial}
                onReintentar={handleReintentar}
                onGuardar={handleGuardar}
              />
            )}

            {/* ── Vista cuadrícula ── */}
            {vista === 'cuadricula' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {misDocumentos.map(doc => (
                  <div key={doc._id}
                    onClick={() => doc.fileUrl && setDocPrevia(doc.fileUrl)}
                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-line)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: '140px', backgroundColor: '#fff', borderRadius: '6px', marginBottom: '15px', overflow: 'hidden', border: '1px solid var(--border-line)', position: 'relative' }}>
                      {esPDF(doc.fileUrl) ? (
                        <div style={{ position: 'absolute', top: 0, left: '50%', width: '800px', height: '1000px', transform: 'translateX(-50%) scale(0.3)', transformOrigin: 'top center', pointerEvents: 'none' }}>
                          <iframe src={`${doc.fileUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`} style={{ width: '100%', height: '100%', border: 'none', marginTop: '-56px' }} title="Miniatura" scrolling="no" />
                        </div>
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-panel)' }}>
                          <FileText size={40} color="#646cff" />
                        </div>
                      )}
                    </div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.title}>{doc.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '5px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                      <button
                        onClick={e => { e.stopPropagation(); abrirHistorial(doc.hash); }}
                        style={{ backgroundColor: '#646cff', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        ⏱️ Trazabilidad
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {misDocumentos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px', alignItems: 'center' }}>
                <button
                  className="btn-secondary"
                  disabled={paginaActual <= 1}
                  onClick={() => cargarDocumentos(paginaActual - 1)}
                  style={{ padding: '8px 16px', opacity: paginaActual <= 1 ? 0.5 : 1 }}
                >
                  Anterior
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Página {paginaActual} de {totalPaginas}
                </span>
                <button
                  className="btn-secondary"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => cargarDocumentos(paginaActual + 1)}
                  style={{ padding: '8px 16px', opacity: paginaActual >= totalPaginas ? 0.5 : 1 }}
                >
                  Siguiente
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