const express = require('express')
const vansController = require('../controllers/vansController');

const router = express.Router();



router.route('/')
    .get(vansController.getAllVans)
    .post(vansController.createVan)

router.route("/:id")
    .get(vansController.getVan)
    .patch(vansController.updateVan)
    .delete(vansController.deleteVan)

module.exports = router;