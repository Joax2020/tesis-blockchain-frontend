// src/utils/authUtils.js

export const getTokenPayload = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // El payload es la segunda parte del JWT, separada por "."
        const base64Payload = token.split('.')[1];
        
        // Base64 URL tiene diferencias con Base64 estándar, esto las corrige
        const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
        
        // Lo decodificamos y parseamos
        const payload = JSON.parse(atob(base64));
        return payload;
    } catch (error) {
        // Si falla al parsear, el token está malformado
        return null;
    }
};

export const isTokenValid = () => {
    const payload = getTokenPayload();
    if (!payload) return false;

    // payload.exp viene en segundos, Date.now() está en milisegundos
    const ahora = Date.now() / 1000;
    
    return payload.exp > ahora;
};