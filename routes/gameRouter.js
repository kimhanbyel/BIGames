const gameHandler = require('../handlers/game.js');
const express = require('express');
const router = express.Router();

router.get('/acidRain', gameHandler.acidRain);
router.get('/tetris', gameHandler.tetris);

module.exports = router;