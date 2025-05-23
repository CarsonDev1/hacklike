const express = require("express");
let router = express.Router();
const {body} = require('express-validator');

const {validator} = require("../../../lib/helpers");
const {priceStatusMap} = require("../../../lib/constants");

router.get("/:slug", async (req, res) => {
    let {slug} = req.params;

    try {
        if (!slug.match(/^[\d\w\-_]+$/)) return res.redirect("/");
        const type = 'service';

        return res.render('panel/services/service', {
            account: req.user,
            site: {
                title: 'title',
                active: type,
                type
            },
            service_category: {},
            user: {},
        });
    } catch (e) {
        return res.redirect("/");
    }
});

router.post("/info_by_id", [
        body('category_id').notEmpty().isInt(),
    ], validator,
    async (req, res) => {
        return res.json({
            services: [],
            statusMap: priceStatusMap
        });
    });

router.post("/list",
    async (req, res) => {
        try {
            return res.jsonSuccess(200, {service_categories: []});
        } catch (e) {
            console.error('list error', e);
            return res.jsonError(500);
        }
    });


module.exports = router;
