import { ChecklistItem, Trip } from '../models/index.js';

const requireUserTrip = async (tripId, userId) => Trip.findOne({ where: { id: tripId, userId } });

export const createChecklistItem = async (req, res, next) => {
  try {
    const trip = await requireUserTrip(req.params.tripId, req.user.userId);
    if (!trip) {
      return next({ status: 404, message: 'Trip not found' });
    }

    const { title, isChecked = false } = req.body;
    if (!title) {
      return next({ status: 400, message: 'Checklist title is required' });
    }

    const item = await ChecklistItem.create({ title, isChecked, tripId: trip.id });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateChecklistItem = async (req, res, next) => {
  try {
    const item = await ChecklistItem.findByPk(req.params.itemId, { include: Trip });
    if (!item || item.Trip.userId !== req.user.userId) {
      return next({ status: 404, message: 'Checklist item not found' });
    }

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteChecklistItem = async (req, res, next) => {
  try {
    const item = await ChecklistItem.findByPk(req.params.itemId, { include: Trip });
    if (!item || item.Trip.userId !== req.user.userId) {
      return next({ status: 404, message: 'Checklist item not found' });
    }

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
