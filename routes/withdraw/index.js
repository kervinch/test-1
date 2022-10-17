const withdrawHandler = require('../../api/withdraw/index');
const { setHeader } = require('../../service/SetHeader');

module.exports = (app) => {
    app.post(
        '/api/withdraw',
        setHeader,
        withdrawHandler.withdraw,
    );
};
