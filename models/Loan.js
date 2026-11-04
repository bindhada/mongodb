
import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Loan = sequelize.define(
  'Loan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loan_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    returned_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'return_date'
    }
  },
  {
    tableName: 'loans',
    timestamps: false
  }
);

export default Loan;
