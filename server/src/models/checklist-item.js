import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export class ChecklistItem extends Model {}

ChecklistItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isChecked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ChecklistItem',
    tableName: 'checklist_items',
  }
);
