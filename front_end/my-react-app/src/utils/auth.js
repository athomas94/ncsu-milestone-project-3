import { jwtDecode } from 'jwt-decode';

//Retrieve token from local storage
export const getToken = () => {
    return localStorage.getItem('jwt_token');
}

// Check if token exists
export const tokenExists = () => {
    return getToken() !== null;
}

// Check if token is expired
export const isTokenExpired = (token) => {
    console.log('Token:', token); // Log token for debugging

    if (!token) {
        console.error('Token is missing');
        return true;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        console.error('Invalid token format');
        return true;
    }

    try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    } catch (e) {
        console.error('Failed to decode token', e);
        return true;
    }
    // const token = getToken();
    // // Token doesn't exist, consider it expired
    // if (!token) return true; 

    // // Decode the token to get expiration time
    // const decodedToken = jwtDecode(token);
    // const currentTime = Math.floor(Date.now() / 1000); 
    // return decodedToken.exp < currentTime;
}


// Check if user has a valid token (exists and not expired)
export const hasValidToken = () => {
    const token = getToken();
    return !isTokenExpired(token);
    // return tokenExists() && !isTokenExpired();
}