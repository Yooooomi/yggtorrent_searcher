const config = {
    // Use either the variable or the function to define downloadLocation
    // If ran in Docker, make sure the path is either available or mounted

    // downloadLocation: '/app/downloads',

    // Function to predict where to store the .torrent file
    // url, category, subcategory will never have accents
    downloadLocation: (category, subcategory, fullpath) => {
        if (category === 'filmvideo') {
            if (subcategory === 'serie-tv') return '/data/torrents/series';
            if (subcategory === 'film') return '/data/torrents/film';
        }
        return '/data/torrents/misc';
    },

    // The application will default the CORS to this variable,
    // However, it will prefer CORS in environment if available
    // CORS has to be of the form http://localhost:5000,http://localhost:3000
    // Environment variable is named CORS_WHITELIST
    // Setting 'all' will just allow all cors
    cors: 'all',

    // YGGTorrent credentials
    username: 'Obsinex',
    password: '66Darkreblochon',

    // Change this if YGG changes domain name
    ygg: {
        host: 'https://www.yggtorrent.ws/',
        searchHost: 'https://www2.yggtorrent.ws/',
    }
};

module.exports = config;
