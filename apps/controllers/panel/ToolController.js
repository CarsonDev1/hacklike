const express = require("express");
let router = express.Router();

router.get("/:slug", (req, res) => {
    let {slug} = req.params;

    if (!['two_fa', 'text', 'check_token', 'check_uid', 'get_link', 'check_domain_expiry'].includes(slug)) return res.redirect('/');

    return res.render(`panel/tools/${slug}`, {
        account: req.user,
        site: {
            title: "Tiện Ích Miễn Phí",
            active: "tools",
            type: slug
        },
        user: {}
    })
});

module.exports = router;
