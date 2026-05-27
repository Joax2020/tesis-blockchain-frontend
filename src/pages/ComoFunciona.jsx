import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, ChevronUp, Upload, Search, CheckCircle, MessageCircle, HelpCircle, FileCheck, UserCheck } from 'lucide-react';
import '../App.css';

const faqs = [
  {
    pregunta: '¿Qué es DocuChain y para qué sirve?',
    respuesta: 'DocuChain es una plataforma que te permite registrar tus documentos importantes (diplomas, contratos, certificados, etc.) para que nadie pueda falsificarlos. Una vez registrado, cualquier persona puede comprobar en segundos si un documento es el original o fue alterado.',
  },
  {
    pregunta: '¿Mis documentos quedan guardados en el sistema?',
    respuesta: 'No. Tu archivo nunca se sube ni se almacena en nuestros servidores. El sistema solo guarda una "firma" matemática invisible que identifica a ese documento de forma única. Es como tomar la huella dactilar de un papel sin quedarse con el papel.',
  },
  {
    pregunta: '¿Cómo sé si un documento que recibí es auténtico?',
    respuesta: 'Ve al verificador, sube el documento que quieres comprobar y el sistema te dirá inmediatamente si es el original o si fue modificado. No necesitas tener cuenta ni conocimientos técnicos para hacerlo.',
  },
  {
    pregunta: '¿Qué pasa si alguien intenta modificar un documento ya registrado?',
    respuesta: 'Si alguien cambia aunque sea una sola letra del documento, la verificación fallará automáticamente y el sistema indicará que el documento no es el original. Es imposible pasar un documento alterado como auténtico.',
  },
  {
    pregunta: '¿Se puede borrar o modificar un registro?',
    respuesta: 'No. Una vez que un documento es registrado, ese registro es permanente. Ni el administrador del sistema puede eliminarlo. Esto es lo que hace que la plataforma sea una prueba confiable ante cualquier institución.',
  },
  {
    pregunta: '¿Necesito cuenta para verificar un documento?',
    respuesta: 'No. Verificar documentos es completamente público y gratuito. Solo necesitas una cuenta si quieres registrar y administrar tus propios documentos.',
  },
  {
    pregunta: '¿Para qué tipo de documentos puedo usar DocuChain?',
    respuesta: 'Para cualquier documento importante: títulos universitarios, certificados de cursos, contratos, actas, cartas de recomendación, y mucho más. Si es un archivo digital, puedes protegerlo con DocuChain.',
  },
];

const pasos = [
  {
    icono: <Upload size={32} color="var(--accent)" />,
    titulo: '1. Selecciona tu documento',
    desc: 'Elige el archivo desde tu computadora o celular. Puede ser un PDF, una imagen o cualquier tipo de documento.',
  },
  {
    icono: <FileCheck size={32} color="#2ecc71" />,
    titulo: '2. El sistema lo registra',
    desc: 'DocuChain genera una identificación única para ese documento y la guarda de forma permanente. Nadie puede alterarla después.',
  },
  {
    icono: <Search size={32} color="#f1c40f" />,
    titulo: '3. Verifica cuando quieras',
    desc: 'Tú o cualquier otra persona puede comprobar en cualquier momento si un documento es el original que registraste.',
  },
];

const ComoFunciona = () => {
  const navigate = useNavigate();
  const [abierta, setAbierta] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border-line)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <Shield size={28} color="var(--accent)" strokeWidth={2} />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>DocuChain</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '50px' }}>Iniciar Sesión</button>
          <button onClick={() => navigate('/registro')} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '50px' }}>Crear Cuenta</button>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ padding: '70px 5% 50px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'var(--input-bg)', borderRadius: '50px', border: '1px solid var(--border-line)', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <HelpCircle size={14} /> Manual de uso
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', margin: '0 0 15px 0', lineHeight: 1.2 }}>
          ¿Cómo funciona <span style={{ color: 'var(--accent)' }}>DocuChain</span>?
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Todo lo que necesitas saber para proteger y verificar tus documentos, explicado de forma sencilla.
        </p>
      </header>

      {/* PASOS */}
      <section style={{ padding: '10px 5% 70px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '40px' }}>En solo 3 pasos</h2>
        <div className="grid-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {pasos.map((p, i) => (
            <div key={i} className="card" style={{ border: '1px solid var(--border-line)', boxShadow: 'none', textAlign: 'center' }}>
              <div style={{ marginBottom: '15px' }}>{p.icono}</div>
              <h3 style={{ margin: '0 0 10px 0' }}>{p.titulo}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN CHATBOT */}
      <section style={{ padding: '60px 5%', backgroundColor: 'var(--bg-panel)', borderTop: '1px solid var(--border-line)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', gap: '50px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Ícono y título */}
          <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: '160px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--input-bg)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <MessageCircle size={48} color="var(--accent)" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Asistente IA</span>
          </div>

          {/* Descripción */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 15px 0' }}>
              Tu asistente personal <span style={{ color: 'var(--accent)' }}>siempre disponible</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
              DocuChain incluye un asistente de inteligencia artificial al que puedes escribirle en cualquier momento, como si fuera un chat normal. Está ahí para ayudarte cuando tengas dudas o no sepas qué hacer.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icono: <UserCheck size={18} color="var(--accent)" />, texto: 'Explica cómo usar cada función de la plataforma con ejemplos claros.' },
                { icono: <FileCheck size={18} color="#2ecc71" />, texto: 'Te guía paso a paso si tienes problemas para registrar o verificar un documento.' },
                { icono: <Search size={18} color="#f1c40f" />, texto: 'Responde tus preguntas sobre el estado de tus documentos registrados.' },
                { icono: <MessageCircle size={18} color="var(--accent)" />, texto: 'Disponible las 24 horas, los 7 días de la semana. No necesitas esperar a nadie.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>{item.icono}</div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ejemplo de conversación */}
        <div style={{ maxWidth: '600px', margin: '50px auto 0', backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border-line)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-line)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2ecc71', boxShadow: '0 0 6px #2ecc71' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Asistente DocuChain</span>
          </div>
          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Mensaje del usuario */}
            <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--accent)', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%', fontSize: '0.9rem', lineHeight: 1.5 }}>
              ¿Cómo sé si mi diploma ya fue registrado?
            </div>
            {/* Respuesta del bot */}
            <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-line)', padding: '10px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '85%', fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              ¡Hola! Puedes verificarlo fácilmente: ve a la sección <strong style={{ color: 'var(--text)' }}>"Mis documentos"</strong> en tu panel principal. Ahí verás todos los archivos que has registrado con su fecha y estado. ¿Necesitas que te explique algo más? 😊
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 5% 80px' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '10px' }}>Preguntas frecuentes</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>Las dudas más comunes, respondidas sin rodeos.</p>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setAbierta(abierta === i ? null : i)}
              style={{ borderBottom: '1px solid var(--border-line)', padding: '20px 0', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>{faq.pregunta}</span>
                {abierta === i ? <ChevronUp size={20} color="var(--accent)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </div>
              {abierta === i && (
                <p style={{ color: 'var(--text-muted)', margin: '12px 0 0 0', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {faq.respuesta}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 5%', textAlign: 'center', backgroundColor: 'var(--bg-panel)', borderTop: '1px solid var(--border-line)' }}>
        <h2 style={{ margin: '0 0 15px 0' }}>¿Listo para proteger tus documentos?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Crear una cuenta es gratis y toma menos de un minuto.</p>
        <button onClick={() => navigate('/registro')} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> Crear cuenta gratis
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '30px 5%', backgroundColor: 'var(--bg-base)', borderTop: '1px solid var(--border-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>DocuChain</span>
        </div>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>© 2026 Tesis de Grado - Desarrollo de Software.</p>
      </footer>
    </div>
  );
};

export default ComoFunciona;