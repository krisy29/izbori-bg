const express = require('express');
const User = require('../models/user');
const Party = require('../models/party');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();

        if (user.memberOf !== 'Не') {
            const party = await Party.findOne({
                name: user.memberOf
            });
            party.members = party.members.concat([{ name: user.name }]);
            await party.save();
        }

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'permanentAddress', 'currentAddress'];
    const isValidOperataion = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperataion) {
        return res.status(400).send({ error: 'Невалидна операция!' });
    }
    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }
    catch (e) {
        res.status(400).send({ error: 'Невалидни данни!' });
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        // sendGoodbyeEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;