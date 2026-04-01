import { Router } from 'express';
import { createTrip, deleteTrip, listTrips, updateTrip } from '../controllers/trips-controller.js';
import { createPoint, deletePoint, updatePoint } from '../controllers/points-controller.js';
import { createChecklistItem, deleteChecklistItem, updateChecklistItem } from '../controllers/checklist-controller.js';

const tripsRouter = Router();

tripsRouter.get('/', listTrips);
tripsRouter.post('/', createTrip);
tripsRouter.patch('/:tripId', updateTrip);
tripsRouter.delete('/:tripId', deleteTrip);

tripsRouter.post('/:tripId/points', createPoint);
tripsRouter.patch('/points/:pointId', updatePoint);
tripsRouter.delete('/points/:pointId', deletePoint);

tripsRouter.post('/:tripId/checklist', createChecklistItem);
tripsRouter.patch('/checklist/:itemId', updateChecklistItem);
tripsRouter.delete('/checklist/:itemId', deleteChecklistItem);

export default tripsRouter;
