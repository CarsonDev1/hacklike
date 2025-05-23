const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    return res.render("panel/site", {
        account: req.account,
        site: {
            title: "Tích hợp site đại lý",
            active: "dashboard",
            type: "site"
        },
        user: req.account
    })
});

module.exports = router;
