const depositHandler = require('../../api/deposit/index');
const { setHeader } = require('../../service/SetHeader');

module.exports = (app) => {
    app.post(
        '/api/deposit',
        setHeader,
        depositHandler.deposit,
    );
};
