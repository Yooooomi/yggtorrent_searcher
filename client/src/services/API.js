import Axios from 'axios';

let axios;

const API = {
    init: async () => {
        axios = Axios.create({
            baseURL: process.env.REACT_APP_API,
        });
        try {
            await axios.get('/health');
            return process.env.REACT_APP_API;
        } catch (e) {
            axios = Axios.create({
                baseURL: process.env.REACT_APP_API_LOCAL,
            });
            try {
                await axios.get('/health');
                return process.env.REACT_APP_API_LOCAL;
            } catch (e) {
                return null;
            }
        }
    },
    search: (search, sort, sortOrder) => axios.get(`/search/${search}`, {
        params: {
            sort, sortOrder,
        },
    }),
    download: (torrentUrls) => axios.post('/dl', {
        torrents: torrentUrls,
    }),
    downloadContent: (url) => axios.get('/getpage/' + encodeURIComponent(url)),
};

export default API;
