import Axios from 'axios';

let axios;

const testAPI = async api => {
    const ax = Axios.create({
        baseURL: api,
    });
    await ax.get('/health');
    return api;
}

const invert = pr => new Promise((s, f) => pr.then(f, s));
const firstOf = ps => invert(Promise.all(ps.map(invert)));

const API = {
    init: async () => {
        let finalUrl = 'http://localhost:3000';
        const hosts = process.env.REACT_APP_APIS;

        if (hosts) {
            const hostsArray = hosts.split(',');
            if (hostsArray.length > 0) {
                let promises = hostsArray.map(e => testAPI(e));
                const result = await firstOf(promises.map(invert));
                if (result instanceof String) {
                    finalUrl = result;
                }
            }
        }
        axios = Axios.create({
            baseURL: finalUrl,
        })
        return finalUrl;
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
