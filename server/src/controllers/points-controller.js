import { Point, Trip } from '../models/index.js';

const requireUserTrip = async (tripId, userId) => Trip.findOne({ where: { id: tripId, userId } });

export const createPoint = async (req, res, next) => {
  try {
    const trip = await requireUserTrip(req.params.tripId, req.user.userId);
    if (!trip) {
      return next({ status: 404, message: 'Trip not found' });
    }

    const point = await Point.create({ ...req.body, tripId: trip.id });
    res.status(201).json(point);
  } catch (error) {
    next(error);
  }
};

export const updatePoint = async (req, res, next) => {
  try {
    const point = await Point.findByPk(req.params.pointId, { include: Trip });
    if (!point || point.Trip.userId !== req.user.userId) {
      return next({ status: 404, message: 'Point not found' });
    }

    await point.update(req.body);
    res.json(point);
  } catch (error) {
    next(error);
  }
};

export const deletePoint = async (req, res, next) => {
  try {
    const point = await Point.findByPk(req.params.pointId, { include: Trip });
    if (!point || point.Trip.userId !== req.user.userId) {
      return next({ status: 404, message: 'Point not found' });
    }

    await point.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
