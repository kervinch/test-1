const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    return res.json(200);
});

app.get('/healthcheck', function (req, res) {
    return res.json({
        "status": "available",
        "system_info": {
            "environment": "production",
            "version": "1.0.0",
        }
    });
});

require('./routes/auth/index')(app);
require('./routes/deposit/index')(app);
require('./routes/withdraw/index')(app);


app.listen(port, () => console.log(`App listening at http://localhost:${port}!`))
