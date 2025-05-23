const {body} = require('express-validator');

const validate = (fields) => {
    if (!(fields && fields.length && Array.isArray(fields))) return [];
    return fields.map(field => body(field).notEmpty());
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function sleep(ms) {
    return await new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

/**
 * Replace toàn bộ chuỗi
 * @param {String} str Chuỗi cần replace
 * @param {String} find Seach
 * @param {String} replace Replace
 */
function replaceAll(str, find, replace) {
    try {
        return str.replace(new RegExp(find.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"), 'g'), replace);
    } catch (ex) {
        return "";
    }
}

/**
 * Đổi thời gian thành ngày tháng
 * @param date Thời gian cần chuyển đổi
 * @returns {string}
 */
function getDate(date) {
    if (!date) date = new Date();
    else date = new Date(date);
    return date.toJSON().slice(0, 10);
}

function typeUser(ugroup) {
    const values = ['Thành Viên', 'Cộng tác viên', 'Đại lý', 'Nhà phân phối'];
    return values[Number(ugroup)] || "Ăn Mày";
}

function number_format(input, round = true) {
    if (!input) return input;
    try {
        let number = parseFloat(input.toString().replace(/[^[0-9.]/g, ''));
        if (isNaN(number)) return number;
        if (round) number = Math.floor(number);
        return number.toLocaleString();
    } catch (e) {
        return input;
    }
}

const wait = (secondMin, secondMax = false, ms = false) => {
    if (secondMax !== false) secondMin = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;

    return new Promise(resolve => {
        setTimeout(function () {
            return resolve();
        }, secondMin * (ms ? 1 : 1000));
    });
};

module.exports = {
    replaceAll,
    getDate,
    sleep,
    typeUser,
    number_format,
    random,
    validate,
    wait,
    shuffle: (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
};
