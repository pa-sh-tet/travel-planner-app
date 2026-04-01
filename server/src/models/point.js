import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export class Point extends Model {}

Point.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    dateFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateTo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    destination: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { name: '', description: '' },
    },
  },
  {
    sequelize,
    modelName: 'Point',
    tableName: 'points',
  }
);
