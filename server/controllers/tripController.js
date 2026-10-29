const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Crear solicitud de viaje
exports.createTrip = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      serviceType,
      estimatedDistance,
      estimatedDuration,
      estimatedPrice,
      notes
    } = req.body;

    const trip = new Trip({
      passengerId: req.userId,
      pickupLocation,
      dropoffLocation,
      serviceType,
      estimatedDistance,
      estimatedDuration,
      estimatedPrice,
      notes,
      status: 'requested'
    });

    await trip.save();
    await trip.populate('passengerId', 'name phone rating');

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener viajes activos
exports.getActiveTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { passengerId: req.userId },
        { driverId: req.userId }
      ],
      status: { $in: ['requested', 'accepted', 'started'] }
    })
      .populate('passengerId', 'name phone rating profilePicture')
      .populate('driverId', 'name phone rating profilePicture')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aceptar viaje (para conductores)
exports.acceptTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    if (trip.status !== 'requested') {
      return res.status(400).json({ message: 'Viaje no disponible' });
    }

    trip.driverId = req.userId;
    trip.status = 'accepted';
    trip.acceptedAt = new Date();
    await trip.save();

    await trip.populate('passengerId', 'name phone location');
    await trip.populate('driverId', 'name phone location profilePicture');

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Iniciar viaje
exports.startTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      {
        status: 'started',
        startedAt: new Date()
      },
      { new: true }
    )
      .populate('passengerId')
      .populate('driverId');

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Completar viaje
exports.completeTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { actualPrice, passengerRating, driverRating } = req.body;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      {
        status: 'completed',
        completedAt: new Date(),
        actualPrice,
        'rating.passenger': passengerRating,
        'rating.driver': driverRating
      },
      { new: true }
    )
      .populate('passengerId')
      .populate('driverId');

    // Actualizar calificaciones de usuarios
    if (passengerRating) {
      const driver = await User.findById(trip.driverId);
      driver.rating = ((driver.rating * driver.reviews) + passengerRating) / (driver.reviews + 1);
      driver.reviews += 1;
      await driver.save();
    }

    if (driverRating) {
      const passenger = await User.findById(trip.passengerId);
      passenger.rating = ((passenger.rating * passenger.reviews) + driverRating) / (passenger.reviews + 1);
      passenger.reviews += 1;
      await passenger.save();
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancelar viaje
exports.cancelTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      { status: 'cancelled' },
      { new: true }
    );

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener historial de viajes
exports.getTripHistory = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { passengerId: req.userId },
        { driverId: req.userId }
      ]
    })
      .populate('passengerId', 'name phone rating profilePicture')
      .populate('driverId', 'name phone rating profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
