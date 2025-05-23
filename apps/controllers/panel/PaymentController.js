const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    return res.render("panel/payment", {
        config: {},
        account: req.user,
        note: null,
        vcbVisible: true,
        USD_RATE: 25000,
        site: {
            title: "Thanh Toán",
            active: "dashboard",
            type: "payment"
        },
        user: {}
    })
});

module.exports = router;
