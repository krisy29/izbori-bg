const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.get("", (req, res) => {
    res.render("index");
});

router.get("/profile", (req, res) => {
    res.render("profile");
});

router.get("/voting-2025", async (req, res) => {
    try {
        const v = await User.countDocuments({ voted: true });
        const c = await User.estimatedDocumentCount();
        const r = ((v / c) * 100).toFixed(2);
        res.render("voting-2025", {
            percent: r.toString()
        });
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/vote", (req, res) => {
    res.render("vote");
});

router.get("/parties-2025", (req, res) => {
    res.render("parties-2025");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/faq", (req, res) => {
    res.render("faq");
});

router.get("/contacts", (req, res) => {
    res.render("contacts");
});


module.exports = router;