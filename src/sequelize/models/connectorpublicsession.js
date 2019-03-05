'use strict'
module.exports = (sequelize, DataTypes) => {
  const ConnectorPublicSession = sequelize.define('ConnectorPublicSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    publisherId: {
      type: DataTypes.TEXT,
      field: 'publisher_id',
    },
    passKey: {
      type: DataTypes.TEXT,
      field: 'pass_key',
    },
    privatePort: {
      type: DataTypes.INTEGER,
      field: 'private_port',
    },
    publicPort: {
      type: DataTypes.INTEGER,
      field: 'public_port',
    },
    maxConnections: {
      type: DataTypes.INTEGER,
      field: 'max_connections',
    },
  }, {
    timestamps: true,
    underscored: true,
  })
  ConnectorPublicSession.associate = function(models) {
    ConnectorPublicSession.belongsTo(models.Connector, {
      foreignKey: {
        name: 'connectorId',
        field: 'connector_id',
      },
      as: 'connector',
      onDelete: 'cascade',
    })
  }
  return ConnectorPublicSession
}
