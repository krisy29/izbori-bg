const axios = require('axios');

export default class User {
    constructor() {
    }

    async createUser(data) {
        try {
            const res = await axios.post('/users', data);
            this.name = res.data.user.name;
            this.email = res.data.user.email;
            this.permanentAddress = res.data.user.permanentAddress;
            this.currentAddress = res.data.user.currentAddress;
            this.memberOf = res.data.user.memberOf;
            this.voted = res.data.user.voted;
            this.token = res.data.token;
            this.persistData();
        } catch (e) {
            alert('Няма такъв потребител!');
        }
    }

    async loginUser(data) {
        try {
            const res = await axios.post('/users/login', data);
            this.name = res.data.user.name;
            this.email = res.data.user.email;
            this.permanentAddress = res.data.user.permanentAddress;
            this.currentAddress = res.data.user.currentAddress;
            this.memberOf = res.data.user.memberOf;
            this.voted = res.data.user.voted;
            this.token = res.data.token;
            this.persistData();
        } catch (e) {
            alert('Няма такъв потребител!');
        }
    }

    async readProfile() {
        try {
            const res = await axios.get('/users/me');
            this.name = res.data.name;
            this.email = res.data.email;
            this.permanentAddress = res.data.permanentAddress;
            this.currentAddress = res.data.currentAddress;
            this.memberOf = res.data.memberOf;
            this.voted = res.data.voted;
        } catch (e) {
            console.log('Няма такъв потребител!');
        }
    }

    async updateProfile(updates) {
        await axios.patch('/users/me', updates)
            .catch(function (error) {
                alert(error.response.data.error);
            });
    }

    async vote(name) {
        await axios.patch('/party/vote', name)
            .catch(function (error) {
                alert(error.response.data.error);
            });
    }

    async logOut() {
        try {
            await axios.post('/users/logout');
            localStorage.clear();
        } catch (e) {
            alert('Няма такъв потребител!');
        }
    }

    setAxiosToken() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }

    persistData() {
        localStorage.setItem('token', JSON.stringify(this.token));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem("token"));
        if (storage) this.token = storage;
    }
}