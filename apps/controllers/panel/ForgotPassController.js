const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.render('panel/forgot_pass');
});

module.exports = router;
