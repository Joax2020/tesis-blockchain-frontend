import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { FileText, Sparkles, XCircle } from 'lucide-react'; 
import toast from 'react-hot-toast'; // 👈 1. Importamos el Toaster

const FormularioSubida = ({ usuario, onUploadSuccess }) => {
  const [archivoFisico, setArchivoFisico] = useState(null);
  const [formData, setFormData] = useState({
    id: '', owner: usuario?.email || '', docType: 'Desconocido', date: new Date().toISOString().split('T')[0]
  });
  
  const [mensajeRegistro, setMensajeRegistro] = useState('');
  const [calculandoHash, setCalculandoHash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progresoMsj, setProgresoMsj] = useState('');
  const [porcentaje, setPorcentaje] = useState(0); 
  
  const intervaloRef = useRef(null); 

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivoFisico(file);
    setCalculandoHash(true);
    setMensajeRegistro('');
    setPorcentaje(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binary = event.target.result;
      const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(binary)).toString();
      setFormData(prev => ({ ...prev, id: hash, docType: file.type || 'Documento' }));
      setCalculandoHash(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const limpiarFormulario = () => {
    setFormData(prev => ({ ...prev, id: '' }));
    setArchivoFisico(null);
    setPorcentaje(0);
    if(document.getElementById('fileInput')) document.getElementById('fileInput').value = ''; 
  };

  useEffect(() => {
    return () => {
        if (intervaloRef.current) {
            clearInterval(intervaloRef.current);
        }
    };
}, []);

  const registrarDocumento = async (e) => {
    e.preventDefault();
    if (!formData.id || !archivoFisico) return;

    setIsProcessing(true);
    setPorcentaje(5);
    setProgresoMsj('⏳ Enviando documento al servidor...');

    const datosAEnviar = new FormData();
    datosAEnviar.append('file', archivoFisico);
    datosAEnviar.append('id', formData.id);
    datosAEnviar.append('owner', formData.owner);
    datosAEnviar.append('docType', formData.docType);
    datosAEnviar.append('date', formData.date);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/documento`, datosAEnviar, {
          withCredentials: true, // Asegura que las cookies se envíen
      }); 
      
      if (response.status === 202) {
          iniciarPolling(formData.id);
      } else {
          setIsProcessing(false);
          setProgresoMsj('');
          setPorcentaje(100);
          setMensajeRegistro(`✅ Documento procesado.`);
          toast.success('Documento guardado exitosamente'); // 👈 Toast de éxito
          setTimeout(() => limpiarFormulario(), 2000);
          if (onUploadSuccess) onUploadSuccess(usuario.email);
      }
    } catch (error) {
      setIsProcessing(false);
      setMensajeRegistro('');
      toast.error('Error al subir. Verifica tu sesión.'); // 👈 Toast de error
    }
  };

  const iniciarPolling = (docId) => {
      intervaloRef.current = setInterval(async () => {
          try {
              const token = localStorage.getItem('token');
              const res = await axios.get(`${import.meta.env.VITE_API_URL}/status/${docId}`, {
                  withCredentials: true, // Asegura que las cookies se envíen
              }); 
              
              if (res.data.status === 'processing') {
                  setPorcentaje(res.data.progress || 10);
                  setProgresoMsj(res.data.message || 'Procesando...');
              } 
              else if (res.data.status === 'completed') {
                  clearInterval(intervaloRef.current);
                  setIsProcessing(false);
                  setPorcentaje(100);
                  setProgresoMsj('');
                  setMensajeRegistro(''); // Limpiamos texto para usar toast
                  toast.success('¡Clasificado y sellado con éxito!'); // 👈 Toast de éxito
                  setTimeout(() => limpiarFormulario(), 2000);
                  if (onUploadSuccess) onUploadSuccess(usuario.email);
              }
              // 🚨 2. LA SOLUCIÓN AL CONGELAMIENTO: Atrapamos el error de la Blockchain aquí
              else if (res.data.status === 'error' || res.data.progress === -1) {
                  clearInterval(intervaloRef.current);
                  setIsProcessing(false);
                  setPorcentaje(0);
                  setProgresoMsj('');
                  setMensajeRegistro('');
                  toast.error(`Error del servidor: ${res.data.message}`); // 👈 Toast de error
              }
              else if (res.data.status === 'unknown') {
                  clearInterval(intervaloRef.current);
                  setIsProcessing(false);
                  setProgresoMsj('');
                  setMensajeRegistro('');
                  toast.error('⚠️ Proceso cancelado o no encontrado.'); // 👈 Toast de advertencia
                  setPorcentaje(0);
              }
          } catch (error) {
              // Si falla la consulta por micro-desconexión, ignoramos para que reintente en 2s
          }
      }, 2000); 
  };

  const cancelarSubida = async () => {
      if (!formData.id) return;
      try {
          const token = localStorage.getItem('token');
          await axios.post(`${import.meta.env.VITE_API_URL}/cancel/${formData.id}`, {}, {
            withCredentials: true, // Asegura que las cookies se envíen
          });
          clearInterval(intervaloRef.current);
          setIsProcessing(false);
          setProgresoMsj('');
          setPorcentaje(0);
          setMensajeRegistro('');
          toast('Subida cancelada', { icon: '🛑' }); // 👈 Toast personalizado
      } catch (error) {
          console.error("Error al cancelar", error);
      }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <FileText color="#646cff" />
        <h3 style={{ margin: 0 }}>Nuevo Documento Automático</h3>
      </div>

      <div style={{ padding: '10px', backgroundColor: 'rgba(100, 108, 255, 0.1)', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
         <Sparkles size={18} color="#646cff"/>
         <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>El título y la categoría serán deducidos por la IA.</p>
      </div>

      <form onSubmit={registrarDocumento}>
        <div className="form-group upload-box" style={{ padding: '15px', border: '2px dashed var(--border-line)', textAlign: 'center', borderRadius: '8px', marginBottom: '15px' }}>
          <input type="file" id="fileInput" onChange={handleFileUpload} disabled={isProcessing} style={{ width: '100%' }} />
        </div>

        {calculandoHash && <p style={{ color: '#f1c40f', fontSize: '0.9rem' }}>Generando Hash (SHA-256)...</p>}

        {isProcessing && (
          <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span style={{ color: '#646cff', fontWeight: 'bold' }}>{progresoMsj}</span>
                  <span>{porcentaje}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-line)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${porcentaje}%`, height: '100%', backgroundColor: '#646cff', transition: 'width 0.5s ease-in-out' }}></div>
              </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" disabled={!formData.id || calculandoHash || isProcessing} style={{ flex: 1 }}>
            {isProcessing ? 'Procesando...' : 'Subir y Auto-Clasificar'}
            </button>
            
            {isProcessing && (
                <button type="button" onClick={cancelarSubida} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Cancelar Proceso">
                    <XCircle size={20} />
                </button>
            )}
        </div>
      </form>
      
      {mensajeRegistro && <p className="status-msg" style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>{mensajeRegistro}</p>}
    </div>
  );
};

export default FormularioSubida;