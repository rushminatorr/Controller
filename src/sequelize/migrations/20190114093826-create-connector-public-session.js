'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ConnectorPublicSessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'id',
      },
      publisherId: {
        type: Sequelize.TEXT,
        field: 'publisher_id',
      },
      passKey: {
        type: Sequelize.TEXT,
        field: 'pass_key',
      },
      privatePort: {
        type: Sequelize.INTEGER,
        field: 'private_port',
      },
      publicPort: {
        type: Sequelize.INTEGER,
        field: 'public_port',
      },
      maxConnections: {
        type: Sequelize.INTEGER,
        field: 'max_connections',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
      connectorId: {
        type: Sequelize.INTEGER,
        field: 'connector_id',
        references: {model: 'Connectors', key: 'id'},
        onDelete: 'cascade',
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ConnectorPublicSessions')
  },
}
