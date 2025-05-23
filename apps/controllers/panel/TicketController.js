const express = require("express");
const router = express.Router();
const {body} = require('express-validator');

const {validator} = require("../../../lib/helpers");

router.get("/", async (req, res) => {
    const note = null;

    return res.render(`panel/tickets/list`, {
        account: req.user,
        note,
        site: {
            title: "Hỗ trợ",
            active: "tickets",
            type: 'list'
        },
        user: {}
    })
});

router.get("/new", async (req, res) => {
    const note = null;

    return res.render(`panel/tickets/new`, {
        account: req.user,
        note,
        site: {
            title: "Hỗ trợ",
            active: "tickets",
            type: 'new'
        },
        user: {},
    })
});

router.get("/view", async (req, res) => {
    let {id} = req.query;
    if (!id || !id.toString().match(/^\d+$/)) return res.redirect('/tickets?error=404');

    return res.render('panel/tickets/view', {
        account: req.user,
        ticket: {},
        site: {
            title: "Xem Ticket Hỗ trợ",
            active: "tickets",
            type: 'view'
        },
        user: {}
    })
});

router.post("/messages/list", [
        body('ticket_id').notEmpty().isInt({min: 1}),
    ], validator,
    async (req, res) => {
        try {
            return res.jsonSuccess(200, {messages: []});
        } catch (e) {
            console.error('ticket error: ', e);
            return res.jsonError(400);
        }
    });

router.post("/get_more", async (req, res) => {
    return res.jsonSuccess(200, {
        tickets: []
    });
})

router.post("/overview", async (req, res) => {
    return res.jsonSuccess(200, {summary: []});
})

module.exports = router;
