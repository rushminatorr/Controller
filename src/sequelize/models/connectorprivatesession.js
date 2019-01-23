'use strict';
module.exports = (sequelize, DataTypes) => {
  const ConnectorPrivateSession = sequelize.define('ConnectorPrivateSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id'
    },
    publisherId: {
      type: DataTypes.TEXT,
      field: 'publisher_id'
    },
    passKey: {
      type: DataTypes.TEXT,
      field: 'pass_key'
    }
  }, {
    timestamps: true,
    underscored: true
  });
  ConnectorPrivateSession.associate = function (models) {

    ConnectorPrivateSession.belongsTo(models.Connector, {
      foreignKey: {
        name: 'connectorId',
        field: 'connector_id'
      },
      as: 'connector',
      onDelete: 'cascade'
    });
  };
  return ConnectorPrivateSession;
};