const getErrorMsg = (msg, error) => {
    return 'Lỗi không xác định!';
}

module.exports = {
    success: (msg, extra = {}) => {
        if (!msg || msg == 200) msg = 'Thao tác thành công!';
        return {
            status: 1,
            msg,
            ...extra
        }
    },
    error: (msg, error, extra = {}) => {
        msg = getErrorMsg(msg);

        let result = {
            status: 0,
            msg,
            ...extra
        };

        if (typeof error !== "undefined") result.error = error;
        return result;
    },
};
