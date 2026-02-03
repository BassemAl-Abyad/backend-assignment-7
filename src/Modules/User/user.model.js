import { DataTypes } from "sequelize";

export const createUserModel = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: {
        type: DataTypes.STRING,
        validate: {
          // Requirement 3: custom validation hook for name length
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true }, // Requirement 1: email format
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          checkPasswordLength(value) {
            if (value.length <= 6) {
              throw new Error("Password must be greater than 6 characters");
            }
          },
        },
      },
      role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    },
    {
      hooks: {
        // Updated to use the specific name "checkNameLength"
        beforeCreate: function checkNameLength(user) {
          if (user.name && user.name.length <= 2) {
            throw new Error("Name must be greater than 2 characters");
          }
        },
      },
    },
  );
};
