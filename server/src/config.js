const config = {
    // CHANGE THIS ONLY IF NOT RAN IN DOCKER
    downloadLocation: 'D:/Downloads',

    // The application will default the CORS to this variable,
    // However, it will prefer CORS in environment if available
    // Environment CORS has to be of the form CORS_WHITELIST=http://localhost:5000,http://localhost:3000
    cors: 'all',

    username: 'username',
    password: 'password',
};

module.exports = config;
