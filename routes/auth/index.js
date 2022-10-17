const authHandler = require('../../api/auth/index');
const { setHeader } = require('../../service/SetHeader');

module.exports = (app) => {
    app.get(
        '/api/auth/helloWorld',
        setHeader,
        authHandler.helloWorld,
    );

    app.post(
        '/api/auth/login',
        setHeader,
        authHandler.login,
    );

    app.post(
        '/api/auth/register',
        setHeader,
        authHandler.register,
    );
};
