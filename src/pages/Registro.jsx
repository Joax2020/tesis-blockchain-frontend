import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
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
  
  // Estados para mostrar/ocultar contraseñas
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);
  
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  
  const navigate = useNavigate();

  const recaptchaRef = useRef(null); // <-- Controla el widget visual

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación 1: Coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("❌ Las contraseñas no coinciden.");
      return;
    }

    // Validación 2: reCAPTCHA
    if (!captchaToken) {
      setError("❌ Por favor, verifica que no eres un robot.");
      return;
    }

    try {
      // Enviamos al backend (Asegúrate de que la ruta coincida con tu index.js)
      const respuesta = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        captchaToken: captchaToken
      });

      console.log("Registro exitoso:", respuesta.data);
      // Redirigir al login tras un registro exitoso
      navigate('/login');

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
    }
  };

  // Detectamos el tema actual para que el reCAPTCHA combine
  const temaActual = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Botón para volver al inicio */}
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
          
          {/* Contraseña Principal */}
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
              style={{
                position: 'absolute', right: '10px', top: '32px',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirmar Contraseña */}
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
              style={{
                position: 'absolute', right: '10px', top: '32px',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              {mostrarConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Contenedor seguro para el reCAPTCHA */}
          <div className="recaptcha-container">
            <ReCAPTCHA
              ref={recaptchaRef} // <-- Asignamos la referencia para controlarlo
              sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
              onChange={handleCaptchaChange}
              theme={temaActual}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Registrarse
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