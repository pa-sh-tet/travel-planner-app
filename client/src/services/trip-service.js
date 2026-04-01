import { api } from './api.js';

const serializePoint = (point) => ({
  customTitle: point.customTitle,
  basePrice: Number(point.basePrice),
  dateFrom: point.dateFrom,
  dateTo: point.dateTo,
  destination: point.destination,
});

export const tripService = {
  listTrips: () => api.get('/trips'),
  createTrip: (title) => api.post('/trips', { title, photos: [] }),
  renameTrip: (tripId, title) => api.patch(`/trips/${tripId}`, { title }),
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),

  createPoint: (tripId, point) => api.post(`/trips/${tripId}/points`, serializePoint(point)),
  updatePoint: (point) => api.patch(`/trips/points/${point.id}`, serializePoint(point)),
  deletePoint: (pointId) => api.delete(`/trips/points/${pointId}`),

  addChecklistItem: (tripId, title) => api.post(`/trips/${tripId}/checklist`, { title }),
  updateChecklistItem: (itemId, payload) => api.patch(`/trips/checklist/${itemId}`, payload),
  deleteChecklistItem: (itemId) => api.delete(`/trips/checklist/${itemId}`),
};
