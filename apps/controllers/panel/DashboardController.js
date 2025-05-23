const express = require("express");
const router = express.Router();

const {priceStatusMap, reportFields} = require("../../../lib/constants");

router.get("/", (req, res) => {
    return res.render(`panel/home`, {
        newestNotify: null
    });
});

router.get("/report", function (req, res) {
    return res.render("panel/report", {
        account: req.user,
        site: {
            title: "Báo Cáo",
            active: "dashboard",
            type: "report"
        },
        user: {},
        reportFields
    })
});

router.get("/prices", async (req, res) => {
    return res.render("panel/prices", {
        account: req.user,
        prices: [],
        services: [],
        pMap: priceStatusMap,
        banks: [],
        config: {},
        site: {
            title: "Bảng giá",
            active: "dashboard",
            type: "prices"
        },
        user: {}
    })
});

router.get("/warranties", function (req, res) {
    return res.render("panel/warranties", {
        account: req.user,
        site: {
            title: "Nhật Ký Bảo Hành",
            active: "dashboard",
            type: "warranties"
        },
        user: {}
    })
});

router.get("/referral", async (req, res) => {
    return res.render("panel/referral", {
        account: req.user,
        count: 0,
        site: {
            title: "Kiếm tiền",
            active: "dashboard",
            type: "referral"
        },
        user: {}
    })
});

module.exports = router;
