module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("roles", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
  Role.associate = function (models) {
    Role.hasMany(models.User, {
      foreignKey: "role",
    });
  };

  return Role;
};
