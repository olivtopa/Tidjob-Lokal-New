const express = require('express');
const router = express.Router();
const { getProviders } = require('../controllers/providersController');

router.route('/').get(getProviders);

module.exports = router;
