import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; // <-- NUEVO: Importamos el reCAPTCHA
import '../App.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mostrarPass, setMostrarPass] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null); // <-- NUEVO: Estado para el token
  
  const navigate = useNavigate();
  const [error, setError] = useState('');

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

    if (!captchaToken) {
      setError("❌ Por favor, verifica que no eres un robot.");
      return;
    }

    try {
      const respuesta = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
        captchaToken: captchaToken
      },
    {withCredentials: true}); // <-- Asegura que las cookies se envíen

      console.log("Login exitoso:", respuesta.data);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.user));
      localStorage.setItem('token', respuesta.data.token);
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      
      // 👇 MAGIA AQUÍ: Reseteamos el reCAPTCHA visualmente y borramos el token viejo
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);
      // 👆 -------------------------------------------------------------------

      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('Error al conectar con el servidor.');
      }
    }
  };

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
        <h2 className="auth-title">Iniciar Sesión</h2>
        
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', backgroundColor: 'var(--error-bg)', padding: '10px', borderRadius: '6px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Contraseña:</label>
            <input 
              type={mostrarPass ? "text" : "password"} 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              style={{ paddingRight: '40px' }} 
            />
            <button 
              type="button" 
              onClick={() => setMostrarPass(!mostrarPass)}
              style={{ position: 'absolute', right: '10px', top: '32px', backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* NUEVO: Contenedor seguro para el reCAPTCHA */}
          <div className="recaptcha-container">
            <ReCAPTCHA
              ref={recaptchaRef} // <-- Asignamos la referencia para controlarlo
              sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY} 
              onChange={handleCaptchaChange}
              theme={temaActual}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Entrar al Sistema
          </button>
        </form>

        <div style={{ margin: '20px 0', borderBottom: '1px solid var(--border-line)' }}></div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        // Enviamos el token de Google a nuestro Node.js
                        const respuesta = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-login`, {
                            credential: credentialResponse.credential
                        },{
                          withCredentials: true // <-- Asegura que las cookies se envíen
                        });

                        // Si el backend nos da luz verde, guardamos nuestro JWT
                        localStorage.setItem('usuario', JSON.stringify(respuesta.data.user));
                        localStorage.setItem('token', respuesta.data.token); // 👈 Agregar esta línea
                        navigate('/dashboard');
                    } catch (error) {
                        setError('Error al ingresar con Google.');
                    }
                }}
                onError={() => {
                    setError('Ocurrió un error con el widget de Google.');
                }}
                theme={temaActual === 'dark' ? 'filled_black' : 'outline'}
                text="signin_with"
                shape="rectangular"
            />
        </div>

        <p className="auth-footer">
          ¿No tienes cuenta? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/registro'); }}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;