const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    return res.render("panel/profile", {
        user_info: req.user,
        account: req.user,
        site: {
            title: "Tài Khoản",
            active: "dashboard",
            type: "profile"
        },
        user: {}
    })
});


module.exports = router;
