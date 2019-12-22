import Axios from 'axios';

let axios;

const API = {
    init: () => new Promise((s, f) => {
        let resolved = false;
        let failed = 0;

        const remote = Axios.create({
            baseURL: process.env.REACT_APP_API,
        });
        const local = Axios.create({
            baseURL: process.env.REACT_APP_API_LOCAL,
        });

        remote.get('/health').catch(() => {
            failed += 1;
            if (failed === 2) return f();
        }).then(() => {
            if (resolved) return;
            resolved = true;
            axios = remote;
            s(process.env.REACT_APP_API);
        });
        local.get('/health').catch(() => {
            failed += 1;
            if (failed === 2) return f();
        }).then(() => {
            if (resolved) return;
            resolved = true;
            axios = local;
            s(process.env.REACT_APP_API_LOCAL);
        });

    }),
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
