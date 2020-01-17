const express = require('express');
const Party = require('../models/party');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendMembersEmail } = require('../emails/account');

const router = new express.Router();

router.post('/party', auth, async (req, res) => {
    const party = new Party({
        ...req.body,
        owner: req.user._id
    });
    try {
        await party.save();
        req.user.memberOf = party.name;
        await req.user.save();
        res.status(201).send(party);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Does not return 404 error if a party is not found
router.get('/party', auth, async (req, res) => {
    try {
        const party = await Party.findOne({
            owner: req.user._id
        }).catch(() => { });

        res.send(party);

    } finally {
        res.send(party);
    }
});

// Removes warning coming from the above action
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.test);
});

router.get('/party/email', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'party'
        }).execPopulate();

        sendMembersEmail(req.user.name, req.user.email, req.user.party[0].name, req.user.party[0].members);

    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/party', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'owner', 'members', 'votes'];
    const isValidOperataion = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperataion) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const party = await Party.findOne({
            owner: req.user._id
        });
        updates.forEach(update => party[update] = req.body[update]);
        await party.save();
        res.send(party);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/party/vote', auth, async (req, res) => {
    try {
        if (req.user.voted == false) {
            const party = await Party.findOne({
                name: req.body.name
            });
            if (!party) {
                return res.status(404).send({ error: "Няма такава партия!" });
            }
            party.votes++;
            req.user.voted = true;
            await party.save();
            await req.user.save();
            res.send();
        } else {
            return res.status(400).send({ error: "Вече сте гласували!" });
        }
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;