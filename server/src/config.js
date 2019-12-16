const config = {
    // Use either the variable or the function to define downloadLocation
    // If you run under Docker, please set only the String version to /app/downloads

    // CHANGE THIS ONLY IF NOT RAN IN DOCKER
    // downloadLocation: '/app/downloads',

    // Function to predict where to store the .torrent file
    // NOT AVAILABLE IF RAN IN DOCKER
    // url will never have accents
    downloadLocation: (category, subcategory, fullpath) => {
        if (category === 'filmvideo') {
            if (subcategory === 'serie-tv') return 'D:/Downloads/Video/series';
            if (subcategory === 'film') return 'D:/Downloads/Video/films';
            if (subcategory === 'spectacle') return 'D:/Downloads/Video/spectacles';
        } else if (category === 'jeu-video') {
            if (subcategory === 'windows') return 'D:/Downloads/Games/Windows';
            if (subcategory === 'nintendo') return 'D:/Downloads/Games/Nintendo';
        }
        if (fullpath === '/torrent/filmvidéo/film/524893-dora+and+the+lost+city+of+gold+dora+et+la+cité+perdue+2019+multi+complete+bd50+avc+truehd') return 'D:/Downloads/BestMovie';
        return 'D:/Downloads';
    },

    // The application will default the CORS to this variable,
    // However, it will prefer CORS in environment if available
    // Environment CORS has to be of the form CORS_WHITELIST=http://localhost:5000,http://localhost:3000
    // Setting 'all' will just allow all cors
    cors: 'all',

    username: 'username',
    password: 'password',
};

module.exports = config;
