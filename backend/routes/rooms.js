const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');


router.get('/', roomsController.listRooms);
router.get('/:id', roomsController.getRoom);


module.exports = router;