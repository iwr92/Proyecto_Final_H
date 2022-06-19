const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const EmployeeModel = require("./employee");
const UserModel = require("./usuario");

const DateModel = sequelize.define(
  "date",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    idUser: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },

    idEmployee: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: EmployeeModel,
        key: "id",
      },
    },

    date: {
      type: DataTypes.DATE,
      get: function () {
        return this.getDataValue("date").toLocaleString("en-US"); //da el formato "mm/dd/yyyy, 12:50:00", de lo contrario trae 2022-01-17T04:33:12.000Z,
      },
      allowNull: false,
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    finished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  { timestamps: false }
);

module.exports = DateModel;
