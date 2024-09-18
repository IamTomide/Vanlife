const express = require('express');
const router = express.Router();
const vansController = require('../controllers/vansController');


router.route('/')
    .get(vansController.getAllVans)
    .post(vansController.createVan)

router.route('/:_id')
    .get(vansController.getVan)
    .patch(vansController.updateVan)
    .delete(vansController.deleteVan)

module.exports = router;