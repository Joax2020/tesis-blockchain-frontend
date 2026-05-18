import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const finDelChatRef = useRef(null); 

  useEffect(() => {
    if (finDelChatRef.current) {
      finDelChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, cargando]);

  const enviarPregunta = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nuevoMensajeUsuario = { emisor: 'usuario', texto: input };
    
    // 🧠 Preparamos el historial para la IA (Solo los últimos 4 mensajes para ahorrar memoria)
    const historialParaIA = mensajes.slice(-20).map(msg => ({
        role: msg.emisor === 'ia' ? 'assistant' : 'user',
        content: msg.texto
    }));

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    setInput('');
    setCargando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // 👈 La llave maestra
          },
          credentials: 'include', // 👈 El respaldo seguro para las cookies
          body: JSON.stringify({ 
              pregunta: nuevoMensajeUsuario.texto,
              historial: historialParaIA 
          }),
      });

      const data = await response.json();

      const nuevoMensajeIA = { 
        emisor: 'ia', 
        texto: data.respuesta,
        fuentes: data.fuentes 
      };
      setMensajes((prev) => [...prev, nuevoMensajeIA]);

    } catch (error) {
      console.error("Error al conectar:", error);
      setMensajes((prev) => [...prev, { emisor: 'ia', texto: "❌ Error de conexión con el servidor." }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {!abierto && (
        <button className="chatbot-boton-mobile" onClick={() => setAbierto(true)} style={styles.botonFlotante} title="Preguntar sobre mis documentos">
          <span style={{ fontSize: '24px' }}>💬</span>
        </button>
      )}

      {abierto && (
        <div className="chatbot-panel-mobile" style={styles.panelModal}>
          <div style={styles.cabeceraModal}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🧠 Asistente de Documentos
            </h3>
            <button onClick={() => setAbierto(false)} style={styles.botonCerrar}>❌</button>
          </div>

          <div style={styles.cajaChat}>
            {mensajes.length === 0 && (
              <div style={styles.mensajeVacio}>
                <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🤖</p>
                <p>¡Hola! Puedo responder preguntas sobre los documentos que subiste.</p>
                <p style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Hazme cualquier pregunta sobre los PDFs subidos.</p>
              </div>
            )}
            
            {mensajes.map((msg, index) => (
              <div key={index} style={msg.emisor === 'usuario' ? styles.burbujaUsuario : styles.burbujaIA}>
                <strong style={{ color: msg.emisor === 'usuario' ? 'var(--accent)' : '#2ecc71', display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>
                  {msg.emisor === 'usuario' ? '🧑‍💻 Tú' : '🤖 Asistente'}
                </strong>
                
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '0.95em', lineHeight: '1.5' }}>
                  {msg.texto}
                </p>
                
                {/* 🛡️ RENDERIZADO ELEGANTE DE FUENTES RAG */}
                {msg.fuentes && msg.fuentes.length > 0 && (
                  <div style={styles.cajaFuentes}>
                    <details style={styles.detailsTag}>
                      <summary style={styles.summaryFuentes}>
                        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          📚 Ver {msg.fuentes.length} extractos del documento usados
                        </span>
                      </summary>
                      <div style={styles.contenedorTarjetas}>
                        {msg.fuentes.map((fuente, i) => (
                          <div key={i} style={styles.tarjetaFuente}>
                            <div style={styles.badgeFuente}>Fragmento {i + 1}</div>
                            {/* Limitamos el largo para no saturar y forzamos el quiebre de palabras largas */}
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                              "...{fuente.trim().substring(0, 300)}{fuente.length > 300 ? '...' : ''}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
            
            {cargando && (
              <div style={styles.burbujaIA}>
                <p style={styles.cargando}>Buscando en tus documentos...</p>
              </div>
            )}
            <div ref={finDelChatRef} />
          </div>

          <form onSubmit={enviarPregunta} style={styles.formulario}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej: ¿De qué trata el contrato?" 
              style={styles.input}
              disabled={cargando}
            />
            <button type="submit" style={styles.botonEnviar} disabled={cargando || !input.trim()}>➤</button>
          </form>
        </div>
      )}
    </>
  );
};

const styles = {
  botonFlotante: { position: 'fixed', bottom: '30px', left: '30px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, transition: 'transform 0.2s' },
  panelModal: { position: 'fixed', bottom: '20px', left: '20px', width: '380px', height: '600px', maxHeight: '85vh', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-line)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 10000, overflow: 'hidden' },
  cabeceraModal: { padding: '15px', backgroundColor: 'var(--accent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' },
  botonCerrar: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', opacity: '0.8' },
  cajaChat: { flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-color)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
  mensajeVacio: { textAlign: 'center', color: 'var(--text-main)', margin: 'auto', padding: '20px' },
  burbujaUsuario: { backgroundColor: 'var(--input-bg)', padding: '12px', borderRadius: '12px 12px 0 12px', marginLeft: 'auto', maxWidth: '85%', border: '1px solid var(--border-line)' },
  burbujaIA: { backgroundColor: 'var(--bg-panel)', padding: '12px', borderRadius: '12px 12px 12px 0', marginRight: 'auto', maxWidth: '90%', border: '1px solid var(--border-line)' },
  
  /* 🛡️ NUEVOS ESTILOS PARA LAS FUENTES RAG */
  cajaFuentes: { marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-line)' },
  detailsTag: { outline: 'none' },
  summaryFuentes: { cursor: 'pointer', color: '#f1c40f', fontSize: '0.85em', fontWeight: 'bold', userSelect: 'none', outline: 'none' },
  contenedorTarjetas: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' },
  tarjetaFuente: { backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-line)', borderRadius: '6px', padding: '10px', position: 'relative' },
  badgeFuente: { position: 'absolute', top: '-8px', left: '10px', backgroundColor: '#646cff', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
  
  cargando: { color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85em', margin: 0 },
  formulario: { display: 'flex', padding: '10px', backgroundColor: 'var(--bg-panel)', borderTop: '1px solid var(--border-line)' },
  input: { flex: 1, padding: '12px', borderRadius: '20px', border: '1px solid var(--border-line)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '0.95em', outline: 'none' },
  botonEnviar: { marginLeft: '8px', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2em', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default Chatbot;
