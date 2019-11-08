'use strict';

const express = require('express');
const router = express.Router();

router.use('/healthcheck', require('./healthcheck'));
router.use('/attendees', require('./attendees'));
router.use('/users', require('./users'));
router.use('/authenticate', require('./authentication'));
router.use('/roles', require('./roles'));
router.use('/headquarters', require('./headquarters'));
router.use('/events', require('./events'));
router.use('/image', require('./image'));
router.use('/accounts', require('./accounts'));
router.use('/transactions', require('./transactions'));
router.use('/token', require('./token'));
router.use('/profile', require('./profile'));

module.exports = router;
