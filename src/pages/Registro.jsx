import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft, MailCheck } from 'lucide-react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import '../App.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);

  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [cargando, setCargando] = useState(false);       // 👈 NUEVO
  const [registroExitoso, setRegistroExitoso] = useState(false); // 👈 NUEVO

  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Las contraseñas no coinciden.");
      return;
    }

    if (!captchaToken) {
      setError("❌ Por favor, verifica que no eres un robot.");
      return;
    }

    setCargando(true); // 👈 Deshabilita el botón
    try {
      const respuesta = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        captchaToken: captchaToken
      });

      console.log("Registro exitoso:", respuesta.data);
      setRegistroExitoso(true); // 👈 Muestra la pantalla de éxito en lugar de redirigir

    } catch (error) {
      console.error(error);

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);

      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('❌ Error al conectar con el servidor.');
      }
    } finally {
      setCargando(false); // 👈 Siempre se reactiva
    }
  };

  const temaActual = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';

  // ── Pantalla de éxito: verificar correo ──────────────────────────────────
  if (registroExitoso) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <MailCheck size={64} color="#2ecc71" style={{ margin: '0 auto 16px' }} />
            <h2 className="auth-title" style={{ color: '#2ecc71' }}>¡Cuenta creada!</h2>
          </div>

          <div style={{
            backgroundColor: 'var(--success-bg, #0f2419)',
            border: '1px solid #2ecc71',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 'bold' }}>
              Revisa tu bandeja de entrada
            </p>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Te enviamos un correo a <strong>{formData.email}</strong>.
              Haz clic en el enlace de verificación para activar tu cuenta.
            </p>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px' }}>
            ¿No lo ves? Revisa tu carpeta de <strong>spam</strong> o correo no deseado.
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ width: '100%' }}
          >
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // ── Formulario normal ────────────────────────────────────────────────────
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}
          >
            <ArrowLeft size={18} /> Inicio
          </button>
          <Shield size={32} color="var(--accent)" />
        </div>
        <h2 className="auth-title">Crear Cuenta</h2>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          La contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo.
        </p>

        {error && (
          <p style={{ color: '#e74c3c', textAlign: 'center', backgroundColor: 'var(--error-bg)', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="correo@umsa.bo"
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Contraseña:</label>
            <input
              type={mostrarPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setMostrarPass(!mostrarPass)}
              style={{ position: 'absolute', right: '10px', top: '32px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Confirmar Contraseña:</label>
            <input
              type={mostrarConfirmPass ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmPass(!mostrarConfirmPass)}
              style={{ position: 'absolute', right: '10px', top: '32px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {mostrarConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="recaptcha-container">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
              onChange={handleCaptchaChange}
              theme={temaActual}
            />
          </div>

          {/* 👇 Botón deshabilitado mientras carga */}
          <button
            type="submit"
            className="btn-primary"
            disabled={cargando}
            style={{
              width: '100%',
              opacity: cargando ? 0.7 : 1,
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            {cargando ? '⏳ Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Registro;