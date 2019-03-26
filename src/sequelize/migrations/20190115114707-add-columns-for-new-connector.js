'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Connectors', 'keystore_password', Sequelize.TEXT)
        .then(() => {
          return queryInterface.addColumn('Connectors', 'port', Sequelize.INTEGER)
        }).then(() => {
          return queryInterface.addColumn('Connectors', 'user', Sequelize.TEXT)
        }).then(() => {
          return queryInterface.addColumn('Connectors', 'user_password', Sequelize.TEXT)
        }).then(() => {
          return queryInterface.renameColumn('Connectors', 'self_signed_certs', 'self_signed_cert')
        }).then(() => {
          return queryInterface.renameColumn('Connectors', 'cert', 'ca_cert')
        }).then(() => {
          return queryInterface.addColumn('Connectors', 'server_cert', Sequelize.TEXT)
        }).then(() => {
          return queryInterface.addColumn('Connectors', 'token', Sequelize.TEXT)
        })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Connectors', 'keystore_password')
        .then(() => {
          return queryInterface.removeColumn('Connectors', 'port')
        }).then(() => {
          return queryInterface.removeColumn('Connectors', 'user')
        }).then(() => {
          return queryInterface.removeColumn('Connectors', 'user_password')
        }).then(() => {
          return queryInterface.renameColumn('Connectors', 'self_signed_cert', 'self_signed_certs')
        }).then(() => {
          return queryInterface.renameColumn('Connectors', 'ca_cert', 'cart')
        }).then(() => {
          return queryInterface.removeColumn('Connectors', 'server_cert')
        }).then(() => {
          return queryInterface.removeColumn('Connectors', 'token')
        })
  },
}
