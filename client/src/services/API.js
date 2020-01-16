import Axios from 'axios';

let axios;

const testAPI = async api => {
    const ax = Axios.create({
        baseURL: api,
    });
    try {
        await ax.get('/health');
        return true;
    } catch (e) {
        return false;
    }
}

const API = {
    init: async () => {
        let finalUrl = 'http://localhost:3000';
        const hosts = process.env.REACT_APP_APIS;

        if (hosts) {
            const hostsArray = hosts.split(',');
            if (hostsArray.length > 0) {
                let promises = hostsArray.map(e => testAPI(e));
                promises = await Promise.all(promises);
                const index = promises.indexOf(e => e === true);
                finalUrl = hostsArray[index];
            }
        }
        axios = Axios.create({
            baseURL: finalUrl,
        })
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
