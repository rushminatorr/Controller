'use strict'
module.exports = (sequelize, DataTypes) => {
  const Connector = sequelize.define('Connector', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    name: {
      type: DataTypes.TEXT,
      field: 'name',
    },
    domain: {
      type: DataTypes.TEXT,
      field: 'domain',
    },
    publicIp: {
      type: DataTypes.TEXT,
      field: 'public_ip',
    },
    caCert: {
      type: DataTypes.TEXT,
      field: 'ca_cert',
    },
    serverCert: {
      type: DataTypes.TEXT,
      field: 'server_cert',
    },
    isSelfSignedCert: {
      type: DataTypes.BOOLEAN,
      field: 'self_signed_cert',
      defaultValue: false,
    },
    devMode: {
      type: DataTypes.BOOLEAN,
      field: 'dev_mode',
      defaultValue: false,
    },
    port: {
      type: DataTypes.INTEGER,
      field: 'port',
      defaultValue: 61616,
    },
    user: {
      type: DataTypes.TEXT,
      field: 'user',
    },
    userPassword: {
      type: DataTypes.TEXT,
      field: 'user_password',
    },
    keystorePassword: {
      type: DataTypes.TEXT,
      field: 'keystore_password',
    },
  }, {
    timestamps: true,
    underscored: true,
  })
  Connector.associate = function(models) {

  }
  return Connector
}
