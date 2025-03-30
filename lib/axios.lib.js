const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: process.env.MICROSERVICE_BASE_URL,
    headers: {
        'content-type': 'application/json',
        CLIENT_KEY: process.env.CLIENT_KEY,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        'Authorization': `Bearer ${process.env.CLIENT_KEY}`,
/* ---- GitHub Copilot ----
    In the context of the Authorization header, Bearer is a type of authentication scheme. It indicates that the client is using a bearer token to authenticate with the server.
    A bearer token is a security token that grants the "bearer" (whoever possesses it) access to a protected resource. In this case, the Unsplash API expects the Authorization header to include the word Bearer followed by the API key (or access token). This is a standard format for token-based authentication.
*/
    }
});

module.exports = axiosInstance;