const express = require("express");
const router = express.Router();


router.use(async (req, res, next) => {
    res.locals.account = {
        "id": 1,
        "username": "username",
        "email": "username@gmail.com",
        "email_verified": "1",
        "password": "",
        "token": null,
        "fullname": "Anonymous",
        "avatar": "/assets/images/avatar.jpg",
        "facebook": "",
        "phone": "0123456412",
        "ugroup": "2",
        "is_admin": "1",
        "price": "10000",
        "all_money": "100000",
        "status": "1",
        "reason": "",
        "last_password_time": "",
        "reset_pass_token": "",
        "reset_pass_expiration": "",
        "referral_id": null,
        "referral_received": "0",
        "telegram_id": null,
        "receive_telegram_msg": "0",
        "telegram_option1": "0",
        "telegram_reward": "1",
        "telegram_connected_at": "",
        "telegram_otp": "0",
        "newbie_notified": "1",
        "spin_count": "1",
        "less_notify": "0",
        "data": {},
        "createdAt": "2022-04-22 09:03:49",
        "updatedAt": "2025-04-08 18:07:46"
    }
    res.locals.dark_mode = false;
    res.locals.site = {
        active: '',
        title: '',
        type: ''
    };

    req.user = res.locals.account;
    req.account = res.locals.account;

    next();
});


//include
router.use("/", require("./DashboardController"));
router.use("/payment", require("./PaymentController"));
router.use("/ajax", require("./AjaxController"));
router.use("/site", require("./DomainController"));
router.use("/tickets", require("./TicketController"));
router.use("/tools", require("./ToolController"));
router.use("/lucky_wheel", require("./LuckyWheelController"));
router.use("/profile", require("./ProfileController"));
router.use("/services", require("./ServiceController"));
router.use("/bank_vouchers", require("./BankVoucherController"));
router.use("/qua-tet", require("./TetGiftController"));

router.get("/:platform/:slug", (req, res) => {
    const {platform, slug} = req.params;
    const fs = require('fs');
    const path = require('path');

    const viewPath = path.join(process.cwd(), 'views', 'panel', platform, `${slug}.ejs`);

    fs.access(viewPath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).send('Page not found');
        }

        // File exists
        return res.render(`panel/${platform}/${slug}`);
    });
});

router.get("/logout", async (req, res) => {
    return res.redirect(`/`);
});

module.exports = router;
