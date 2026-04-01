import { User } from './user.js';
import { Trip } from './trip.js';
import { Point } from './point.js';
import { ChecklistItem } from './checklist-item.js';

User.hasMany(Trip, { foreignKey: 'userId', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'userId' });

Trip.hasMany(Point, { foreignKey: 'tripId', onDelete: 'CASCADE' });
Point.belongsTo(Trip, { foreignKey: 'tripId' });

Trip.hasMany(ChecklistItem, { foreignKey: 'tripId', onDelete: 'CASCADE' });
ChecklistItem.belongsTo(Trip, { foreignKey: 'tripId' });

export { User, Trip, Point, ChecklistItem };
