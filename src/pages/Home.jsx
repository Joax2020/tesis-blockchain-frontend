import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, Lock, Activity, CheckCircle, Database, Server, ArrowRight } from 'lucide-react';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 5%', 
        backgroundColor: 'var(--bg-panel)', 
        borderBottom: '1px solid var(--border-line)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <Shield size={28} color="var(--accent)" strokeWidth={2} />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>DocuChain</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/como-funciona')} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '50px' }}>
    ¿Cómo funciona?
  </button>
          <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '50px' }}>
            Iniciar Sesión
          </button>
          <button onClick={() => navigate('/registro')} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '50px' }}>
            Crear Cuenta
          </button>
        </div>
      </nav>

      {/* 2. SECCIÓN HÉROE (HERO) */}
      <header style={{ 
        padding: '80px 20px 40px', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'var(--input-bg)', borderRadius: '50px', border: '1px solid var(--border-line)', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#2ecc71', borderRadius: '50%', boxShadow: '0 0 8px #2ecc71' }}></span>
          Sistema Activo
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
          maxWidth: '900px', 
          margin: '0 0 20px 0', 
          lineHeight: '1.1',
          letterSpacing: '-1px'
        }}>
          La <span style={{ color: 'var(--accent)' }}>Notaría Digital</span> del Futuro, construida hoy.
        </h1>
        
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '40px', fontSize: '1.15rem', lineHeight: '1.6' }}>
          Plataforma inmutable que garantiza la autenticidad, integridad y trazabilidad de tus documentos importantes
        </p>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
          <button onClick={() => navigate('/registro')} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Comenzar ahora <ArrowRight size={20} />
          </button>
        </div>

        {/* MOCKUP VISUAL (Una ventana falsa que muestra cómo es por dentro) */}
        <div style={{ 
          width: '100%', 
          maxWidth: '900px', 
          height: '400px', 
          backgroundColor: 'var(--bg-panel)', 
          border: '1px solid var(--border-line)', 
          borderRadius: '12px 12px 0 0',
          borderBottom: 'none',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Barra de título del mockup */}
          <div style={{ height: '40px', borderBottom: '1px solid var(--border-line)', display: 'flex', alignItems: 'center', padding: '0 15px', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
          </div>
          {/* Contenido del mockup */}
          <div style={{ padding: '30px', display: 'flex', gap: '20px', opacity: 0.7 }}>
            <div style={{ flex: 1, backgroundColor: 'var(--input-bg)', borderRadius: '8px', height: '150px' }}></div>
            <div style={{ flex: 2, backgroundColor: 'var(--input-bg)', borderRadius: '8px', height: '150px' }}></div>
          </div>
        </div>
      </header>

      {/* 3. SECCIÓN DE CARACTERÍSTICAS (FEATURES) */}
      <section style={{ padding: '80px 5%', backgroundColor: 'var(--bg-panel)', borderTop: '1px solid var(--border-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 15px 0' }}>Arquitectura de Grado Empresarial</h2>
          <p style={{ color: 'var(--text-muted)' }}>Diseñado para entidades educativas, gubernamentales y corporativas.</p>
        </div>

        <div className="grid-container">
          <div className="card" style={{ border: '1px solid var(--border-line)', boxShadow: 'none' }}>
            <Lock size={32} color="#2ecc71" style={{ marginBottom: '15px' }} />
            <h3 style={{ marginTop: 0 }}>Protección</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Cada documento se procesa localmente. El sistema nunca almacena tu documento físico sin tu consentimiento, garantizando privacidad absoluta.</p>
          </div>

          <div className="card" style={{ border: '1px solid var(--border-line)', boxShadow: 'none' }}>
            <Database size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h3 style={{ marginTop: 0 }}>Registros que nadie puede alterar</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Los identificadores se sellan en una red privada certificada. Una vez registrado un bloque, ni siquiera el administrador del sistema puede alterarlo o borrarlo.</p>
          </div>

          <div className="card" style={{ border: '1px solid var(--border-line)', boxShadow: 'none' }}>
            <Activity size={32} color="#f1c40f" style={{ marginBottom: '15px' }} />
            <h3 style={{ marginTop: 0 }}>Verificación instantánea</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Cualquier empleador o institución puede arrastrar tu documento al validador público y verificar matemáticamente si es el original emitido en milisegundos.</p>
          </div>
        </div>
      </section>

      {/* 4. PIE DE PÁGINA (FOOTER) */}
      <footer style={{ 
        padding: '40px 5%', 
        backgroundColor: 'var(--bg-base)', 
        borderTop: '1px solid var(--border-line)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>DocuChain</span>
        </div>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
          © 2026 Tesis de Grado - Desarrollo de Software.
        </p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Términos legales</span>
          <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Privacidad</span>
        </div>
      </footer>

    </div>
  );
};

export default Home;