const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    return res.render("panel/lucky_wheel", {
        account: req.user,
        site: {
            title: "Vòng quay may mắn",
            active: "lucky_wheel",
            type: "lucky_wheel"
        },
        user: {},
        no_doc_html: true
    })
});

router.post("/prizes", async (req, res) => {
    return res.jsonSuccess(200, {data: [], spin_count: 0});
});

router.post("/user_info", async (req, res) => {
    return res.jsonSuccess(200, {
        data: {
            balance: 0,
            spin_count: 0
        }
    });
});

module.exports = router;
