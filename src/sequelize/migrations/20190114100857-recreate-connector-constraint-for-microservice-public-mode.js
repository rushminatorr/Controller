'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('MicroservicePublicModes', 'connector_port_id')
      .then(() => {
        return queryInterface.addColumn('MicroservicePublicModes', 'connector_public_session_id', Sequelize.INTEGER);
      })
      .then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['connector_public_session_id'], {
          type: 'FOREIGN KEY',
          name: 'connectorPublicSessionId',
          references: {
            name: 'connectorPublicSessionId',
            table: 'ConnectorPublicSessions',
            field: 'id'
          },
          onDelete: 'set null'
        })
      })
      .then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['microservice_uuid'], {
          type: 'FOREIGN KEY',
          name: 'microserviceUuid',
          references: {
            name: 'microserviceUuid',
            table: 'Microservices',
            field: 'uuid'
          },
          onDelete: 'cascade'
        })
      }).then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['network_microservice_uuid'], {
          type: 'FOREIGN KEY',
          name: 'networkMicroserviceUuid',
          references: {
            name: 'networkMicroserviceUuid',
            table: 'Microservices',
            field: 'uuid'
          },
          onDelete: 'set null'
        })
      }).then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['iofog_uuid'], {
          type: 'FOREIGN KEY',
          name: 'iofogUuid',
          references: {
            name: 'iofogUuid',
            table: 'Fogs',
            field: 'uuid'
          },
          onDelete: 'set null'
        })
      }).then(() => {
          return queryInterface.addConstraint('MicroservicePublicModes', ['microservice_port_id'], {
            type: 'FOREIGN KEY',
            name: 'microservicePortId',
            references: {
              name: 'microservicePortId',
              table: 'MicroservicePorts',
              field: 'id'
            },
            onDelete: 'set null'
          })
        }
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('MicroservicePublicModes', 'connector_public_session_id')
      .then(() => {
        return queryInterface.addColumn('MicroservicePublicModes', 'connector_port_id', Sequelize.INTEGER);
      })
      .then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['connector_port_id'], {
          type: 'FOREIGN KEY',
          name: 'connectorPortId',
          references: {
            name: 'connectorPortId',
            table: 'ConnectorPorts',
            field: 'id'
          },
          onDelete: 'set null'
        })
      })
      .then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['microservice_uuid'], {
          type: 'FOREIGN KEY',
          name: 'microserviceUuid',
          references: {
            name: 'microserviceUuid',
            table: 'Microservices',
            field: 'uuid'
          },
          onDelete: 'cascade'
        })
      }).then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['network_microservice_uuid'], {
          type: 'FOREIGN KEY',
          name: 'networkMicroserviceUuid',
          references: {
            name: 'networkMicroserviceUuid',
            table: 'Microservices',
            field: 'uuid'
          },
          onDelete: 'set null'
        })
      }).then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['iofog_uuid'], {
          type: 'FOREIGN KEY',
          name: 'iofogUuid',
          references: {
            name: 'iofogUuid',
            table: 'Fogs',
            field: 'uuid'
          },
          onDelete: 'set null'
        })
      }).then(() => {
        return queryInterface.addConstraint('MicroservicePublicModes', ['microservice_port_id'], {
          type: 'FOREIGN KEY',
          name: 'microservicePortId',
          references: {
            name: 'microservicePortId',
            table: 'MicroservicePorts',
            field: 'id'
          },
          onDelete: 'set null'
        })
      });
  }
}
;
