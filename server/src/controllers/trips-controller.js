import { Trip, Point, ChecklistItem } from '../models/index.js';

const withIncludes = [
  { model: Point, as: 'Points' },
  { model: ChecklistItem, as: 'ChecklistItems' },
];

const normalizeTrip = (trip) => ({
  id: trip.id,
  title: trip.title,
  photos: trip.photos,
  totalPrice: trip.totalPrice,
  points: trip.Points || [],
  checklist: trip.ChecklistItems || [],
});

export const listTrips = async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      where: { userId: req.user.userId },
      include: withIncludes,
      order: [
        ['createdAt', 'DESC'],
        [Point, 'dateFrom', 'ASC'],
      ],
    });

    res.json(trips.map(normalizeTrip));
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const { title, photos = [] } = req.body;
    if (!title) {
      return next({ status: 400, message: 'Trip title is required' });
    }

    const trip = await Trip.create({
      title,
      photos,
      userId: req.user.userId,
    });

    res.status(201).json({ ...trip.toJSON(), points: [], checklist: [] });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.tripId, userId: req.user.userId } });
    if (!trip) {
      return next({ status: 404, message: 'Trip not found' });
    }

    const { title, photos } = req.body;
    if (title !== undefined) trip.title = title;
    if (photos !== undefined) trip.photos = photos;

    await trip.save();
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const deleted = await Trip.destroy({ where: { id: req.params.tripId, userId: req.user.userId } });
    if (!deleted) {
      return next({ status: 404, message: 'Trip not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
