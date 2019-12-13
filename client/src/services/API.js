import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API || 'http://localhost:8081',
});

const API = {
    search: (search, sort, sortOrder) => axios.get(`/search/${search}`, {
        params: {
            sort, sortOrder,
        },
    }),
    download: (torrentUrls) => axios.post('/dl', {
        torrents: torrentUrls,
    }),
};

export default API;
