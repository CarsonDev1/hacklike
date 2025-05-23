const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        return res.render('panel/qua_tet', {
            userData: {},
            account: req.user,
            tet_gift_amount: 100_000,
            site: {
                title: 'Tổng kết năm 2024',
                active: 'event',
                type: 'event'
            },
            user: {}
        });
    } catch (e) {
        console.error('tet', e);
        return res.redirect('/');
    }
});

module.exports = router;
