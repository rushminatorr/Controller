'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ConnectorPrivateSessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'id'
      },
      publisherId: {
        type: Sequelize.TEXT,
        field: 'publisher_id'
      },
      passKey: {
        type: Sequelize.TEXT,
        field: 'pass_key'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      },
      connectorId: {
        type: Sequelize.INTEGER,
        field: 'connector_id',
        references: { model: 'Connectors', key: 'id' },
        onDelete: 'cascade'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ConnectorPrivateSessions');
  }
};
