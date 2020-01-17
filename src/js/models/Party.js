const axios = require('axios');

export default class Party {
    constructor() {
    }

    async getPartyAccess() {
        try {
            const res = await axios.get('/party');
            this.name = res.data.name;
            this.members = res.data.members;
        } catch (e) {
        }
    }

    async getPartyEmail() {
        try {
            await axios.get('/party/email');
        } catch (e) {
            console.log(e);
        }
    }
}