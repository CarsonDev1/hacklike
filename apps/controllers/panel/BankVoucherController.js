const express = require('express');
const router = express.Router();

const {priceStatusMap} = require('../../../lib/constants');

router.get('/', async (req, res) => {
    return res.render('panel/bank_vouchers', {
        account: req.user,
        note: null,
        site: {
            title: 'Voucher STK',
            active: 'bank_voucher',
            type: 'bank_voucher'
        },
        user: {}
    })
});

router.post('/list', async (req, res) => {
    try {
        return res.jsonSuccess(200, {
            banks: [],
            statusMap: priceStatusMap
        });
    } catch (e) {
        console.error('bank_voucher list', e);
        return res.jsonError('Lỗi hệ thống!');
    }
});

module.exports = router;
