const Trip = require('../models/Trip');
const User = require('../models/User');

const isValidRating = value => value === undefined || value === null ||
  (Number.isFinite(Number(value)) && Number(value) >= 1 && Number(value) <= 5);

const sameId = (a, b) => String(a) === String(b);

// Crear una sol·licitud: només les persones passatgeres poden demanar viatges.
exports.createTrip = async (req, res) => {
  try {
    if (req.userRole !== 'passenger') return res.status(403).json({ message: 'Només els passatgers poden sol·licitar viatges.' });
    const { pickupLocation, dropoffLocation, serviceType, estimatedDistance, estimatedDuration, estimatedPrice, notes } = req.body || {};
    const validLocation = value => value && typeof value.address === 'string' && value.address.trim() &&
      Number.isFinite(Number(value.latitude)) && Number.isFinite(Number(value.longitude)) &&
      Math.abs(Number(value.latitude)) <= 90 && Math.abs(Number(value.longitude)) <= 180;
    if (!validLocation(pickupLocation) || !validLocation(dropoffLocation)) {
      return res.status(400).json({ message: 'Cal indicar un origen i una destinació vàlids.' });
    }
    for (const [value, min, max] of [[estimatedDistance, 0, 10000], [estimatedDuration, 0, 100000], [estimatedPrice, 0, 100000]]) {
      if (value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < min || Number(value) > max)) {
        return res.status(400).json({ message: 'Les dades estimades del viatge no són vàlides.' });
      }
    }
    const trip = await Trip.create({
      passengerId: req.userId, pickupLocation, dropoffLocation,
      serviceType, estimatedDistance, estimatedDuration, estimatedPrice,
      notes: typeof notes === 'string' ? notes.trim().slice(0, 1000) : '',
      status: 'requested'
    });
    await trip.populate('passengerId', 'name phone rating');
    return res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut crear la sol·licitud.' });
  }
};

// Cada usuari només veu els viatges en què participa; els conductors també poden veure sol·licituds obertes.
exports.getActiveTrips = async (req, res) => {
  try {
    const filter = req.userRole === 'driver'
      ? { $or: [{ driverId: req.userId }, { status: 'requested', driverId: null }] }
      : { passengerId: req.userId };
    const trips = await Trip.find({ ...filter, status: { $in: ['requested', 'accepted', 'started'] } })
      .populate('passengerId', 'name phone rating profilePicture')
      .populate('driverId', 'name phone rating profilePicture')
      .sort({ createdAt: -1 });
    return res.json(trips);
  } catch (error) {
    console.error('Get active trips error:', error.message);
    return res.status(500).json({ message: 'No s’han pogut carregar els viatges actius.' });
  }
};

// Assignació atòmica: evita que dos conductors acceptin el mateix viatge.
exports.acceptTrip = async (req, res) => {
  try {
    if (req.userRole !== 'driver') return res.status(403).json({ message: 'Només els conductors poden acceptar viatges.' });
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, status: 'requested', driverId: null },
      { $set: { driverId: req.userId, status: 'accepted', acceptedAt: new Date() } },
      { new: true, runValidators: true }
    ).populate('passengerId', 'name phone location').populate('driverId', 'name phone location profilePicture');
    if (!trip) return res.status(409).json({ message: 'El viatge ja no està disponible.' });
    return res.json(trip);
  } catch (error) {
    console.error('Accept trip error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut acceptar el viatge.' });
  }
};

exports.startTrip = async (req, res) => {
  try {
    if (req.userRole !== 'driver') return res.status(403).json({ message: 'Acció exclusiva del conductor assignat.' });
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, driverId: req.userId, status: 'accepted' },
      { $set: { status: 'started', startedAt: new Date() } },
      { new: true, runValidators: true }
    ).populate('passengerId', 'name phone').populate('driverId', 'name phone');
    if (!trip) return res.status(404).json({ message: 'No s’ha trobat un viatge assignat pendent d’iniciar.' });
    return res.json(trip);
  } catch (error) {
    console.error('Start trip error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut iniciar el viatge.' });
  }
};

exports.completeTrip = async (req, res) => {
  try {
    if (req.userRole !== 'driver') return res.status(403).json({ message: 'Només el conductor assignat pot completar el viatge.' });
    const { actualPrice, passengerRating, driverRating } = req.body || {};
    if (actualPrice !== undefined && (!Number.isFinite(Number(actualPrice)) || Number(actualPrice) < 0 || Number(actualPrice) > 100000)) {
      return res.status(400).json({ message: 'L’import final no és vàlid.' });
    }
    if (!isValidRating(passengerRating) || !isValidRating(driverRating)) {
      return res.status(400).json({ message: 'Les valoracions han d’estar entre 1 i 5.' });
    }
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, driverId: req.userId, status: 'started' },
      { $set: { status: 'completed', completedAt: new Date(), ...(actualPrice !== undefined ? { actualPrice: Number(actualPrice) } : {}), ...(passengerRating != null ? { 'rating.passenger': Number(passengerRating) } : {}), ...(driverRating != null ? { 'rating.driver': Number(driverRating) } : {}) } },
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ message: 'No s’ha trobat un viatge en curs assignat.' });

    // Actualitzar valoracions només després de completar correctament el viatge.
    const updates = [];
    if (passengerRating != null) updates.push(User.findById(trip.driverId).then(user => {
      if (!user) return;
      user.rating = ((user.rating * user.reviews) + Number(passengerRating)) / (user.reviews + 1);
      user.reviews += 1;
      return user.save();
    }));
    if (driverRating != null) updates.push(User.findById(trip.passengerId).then(user => {
      if (!user) return;
      user.rating = ((user.rating * user.reviews) + Number(driverRating)) / (user.reviews + 1);
      user.reviews += 1;
      return user.save();
    }));
    await Promise.all(updates);
    await trip.populate('passengerId', 'name phone rating').populate('driverId', 'name phone rating');
    return res.json(trip);
  } catch (error) {
    console.error('Complete trip error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut completar el viatge.' });
  }
};

exports.cancelTrip = async (req, res) => {
  try {
    const filter = {
      _id: req.params.tripId,
      status: { $in: ['requested', 'accepted'] },
      ...(req.userRole === 'passenger' ? { passengerId: req.userId } :
        req.userRole === 'driver' ? { driverId: req.userId } : { _id: null })
    };
    const trip = await Trip.findOneAndUpdate(filter, { $set: { status: 'cancelled' } }, { new: true, runValidators: true });
    if (!trip) return res.status(404).json({ message: 'No s’ha trobat un viatge cancel·lable del teu compte.' });
    return res.json(trip);
  } catch (error) {
    console.error('Cancel trip error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut cancel·lar el viatge.' });
  }
};

exports.getTripHistory = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ passengerId: req.userId }, { driverId: req.userId }]
    }).populate('passengerId', 'name phone rating profilePicture')
      .populate('driverId', 'name phone rating profilePicture')
      .sort({ createdAt: -1 }).limit(50);
    return res.json(trips);
  } catch (error) {
    console.error('Get trip history error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut carregar l’historial.' });
  }
};
