'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Routings', 'connector_port_id')
        .then(() => {
          return queryInterface.addColumn('Routings', 'connector_private_session_id', Sequelize.INTEGER)
        })
        .then(() => {
          return queryInterface.removeColumn('Routings', 'source_network_microservice_uuid')
        }).then(() => {
          return queryInterface.removeColumn('Routings', 'dest_network_microservice_uuid')
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['connector_private_session_id'], {
            type: 'FOREIGN KEY',
            name: 'connectorPrivateSessionId',
            references: {
              name: 'connectorPrivateSessionId',
              table: 'ConnectorPrivateSessions',
              field: 'id',
            },
            onDelete: 'set null',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['source_microservice_uuid'], {
            type: 'FOREIGN KEY',
            name: 'sourceMicroserviceUuid',
            references: {
              name: 'sourceMicroserviceUuid',
              table: 'Microservices',
              field: 'uuid',
            },
            onDelete: 'cascade',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['dest_microservice_uuid'], {
            type: 'FOREIGN KEY',
            name: 'destMicroserviceUuid',
            references: {
              name: 'destMicroserviceUuid',
              table: 'Microservices',
              field: 'uuid',
            },
            onDelete: 'cascade',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['source_iofog_uuid'], {
            type: 'FOREIGN KEY',
            name: 'sourceIofogUuid',
            references: {
              name: 'sourceIofogUuid',
              table: 'Fogs',
              field: 'uuid',
            },
            onDelete: 'set null',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['dest_iofog_uuid'], {
            type: 'FOREIGN KEY',
            name: 'destIofogUuid',
            references: {
              name: 'destIofogUuid',
              table: 'Fogs',
              field: 'uuid',
            },
            onDelete: 'set null',
          })
        })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Routings', 'connector_private_session_id')
        .then(() => {
          return queryInterface.addColumn('Routings', 'connector_port_id', Sequelize.INTEGER)
        })
        .then(() => {
          return queryInterface.addColumn('Routings', 'source_network_microservice_uuid', Sequelize.TEXT)
        }).then(() => {
          return queryInterface.addColumn('Routings', 'dest_network_microservice_uuid', Sequelize.TEXT)
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['connector_port_id'], {
            type: 'FOREIGN KEY',
            name: 'connectorPortId',
            references: {
              name: 'connectorPortId',
              table: 'ConnectorPorts',
              field: 'id',
            },
            onDelete: 'set null',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['source_microservice_uuid'], {
            type: 'FOREIGN KEY',
            name: 'sourceMicroserviceUuid',
            references: {
              name: 'sourceMicroserviceUuid',
              table: 'Microservices',
              field: 'uuid',
            },
            onDelete: 'cascade',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['dest_microservice_uuid'], {
            type: 'FOREIGN KEY',
            name: 'destMicroserviceUuid',
            references: {
              name: 'destMicroserviceUuid',
              table: 'Microservices',
              field: 'uuid',
            },
            onDelete: 'cascade',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['source_network_microservice_uuid'], {
            type: 'FOREIGN KEY',
            name: 'sourceNetworkMicroserviceUuid',
            references: {
              name: 'sourceNetworkMicroserviceUuid',
              table: 'Microservices',
              field: 'uuid',
            },
            onDelete: 'set null',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['dest_network_microservice_uuid'], {
            type: 'FOREIGN KEY',
            name: 'destNetworkMicroserviceUuid',
            references: {
              name: 'destNetworkMicroserviceUuid',
              table: 'Microservices',
              field: 'uuid',
            },
            onDelete: 'set null',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['source_iofog_uuid'], {
            type: 'FOREIGN KEY',
            name: 'sourceIofogUuid',
            references: {
              name: 'sourceIofogUuid',
              table: 'Fogs',
              field: 'uuid',
            },
            onDelete: 'set null',
          })
        }).then(() => {
          return queryInterface.addConstraint('Routings', ['dest_iofog_uuid'], {
            type: 'FOREIGN KEY',
            name: 'destIofogUuid',
            references: {
              name: 'destIofogUuid',
              table: 'Fogs',
              field: 'uuid',
            },
            onDelete: 'set null',
          })
        })
  },
}
