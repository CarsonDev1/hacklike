const express = require("express");
const router = express.Router();

const {emptyTable} = require("../../../lib/constants");

router.use(async (req, res, next) => {
    return res.json(emptyTable);
});

module.exports = router;
