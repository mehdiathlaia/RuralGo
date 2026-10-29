const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

router.post('/', tripController.createTrip);
router.get('/active', tripController.getActiveTrips);
router.get('/history', tripController.getTripHistory);
router.put('/:tripId/accept', tripController.acceptTrip);
router.put('/:tripId/start', tripController.startTrip);
router.put('/:tripId/complete', tripController.completeTrip);
router.put('/:tripId/cancel', tripController.cancelTrip);

module.exports = router;
