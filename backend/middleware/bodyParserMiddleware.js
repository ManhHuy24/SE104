const bodyParser = require('body-parser');

// const bodyParserMiddleware = bodyParser.json();

const bodyParserMiddleware = (req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Invalid JSON format' });
        }
        bodyParser.urlencoded({ extended: true })(req, res, next);
    });
};

module.exports = bodyParserMiddleware;
