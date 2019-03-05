/*
 *  *******************************************************************************
 *  * Copyright (c) 2018 Edgeworx, Inc.
 *  *
 *  * This program and the accompanying materials are made available under the
 *  * terms of the Eclipse Public License v. 2.0 which is available at
 *  * http://www.eclipse.org/legal/epl-2.0
 *  *
 *  * SPDX-License-Identifier: EPL-2.0
 *  *******************************************************************************
 *
 */

const ConnectorManager = require('../sequelize/managers/connector-manager')
const constants = require('../helpers/constants')
const AppHelper = require('../helpers/app-helper')
const connectorMode = require('../enums/connector-access-mode')
const logger = require('../logger')
const fs = require('fs')

async function openSessionOnRandomConnector(isPublicAccess, publisherId, transaction) {
  let isConnectorSessionOpen = false
  let session = null
  let connector = null
  const maxAttempts = 5
  for (let i = 0; i < maxAttempts; i++) {
    try {
      connector = await _getRandomConnector(transaction)
      session = await _openSessionOnConnector(connector, isPublicAccess, publisherId)
      if (session) {
        isConnectorSessionOpen = true
        break
      }
    } catch (e) {
      logger.warn(`Failed to open ports on Connector. Attempts ${i + 1}/${maxAttempts}`)
    }
  }
  if (!isConnectorSessionOpen) {
    throw new Error('Not able to open port on remote Connector. Gave up after 5 attempts.')
  }
  session.connectorId = connector.id
  return {session: session, connector: connector}
}

async function _openSessionOnConnector(connector, isPublicAccess, publisherId) {
  const json = isPublicAccess
    ? {
      publisherId: publisherId,
      routeType: connectorMode.PUBLIC,
    }
    : {
      publisherId: publisherId,
      routeType: connectorMode.PRIVATE,
    }

  const data = JSON.stringify(json)

  const port = connector.devMode ? constants.CONNECTOR_HTTP_PORT : constants.CONNECTOR_HTTPS_PORT

  const options = {
    host: connector.domain,
    port: port,
    path: '/route',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  }
  if (!connector.devMode && connector.caCert && connector.isSelfSignedCert === true) {
    const ca = fs.readFileSync(connector.caCert)
    options.ca = Buffer.from(ca)
  }

  const session = await AppHelper.makeRequest(!connector.devMode, options, data)
  return session
}

async function _getRandomConnector(transaction) {
  const connectors = await ConnectorManager.findAll({}, transaction)

  if (connectors && connectors.length > 0) {
    const randomNumber = Math.round((Math.random() * (connectors.length - 1)))
    return connectors[randomNumber]
  } else {
    throw new Error('no connectors defined')
  }
}

async function closeSessionOnConnector(connector, isPublicAccess, publisherId) {
  const port = connector.devMode ? constants.CONNECTOR_HTTP_PORT : constants.CONNECTOR_HTTPS_PORT
  const mode = isPublicAccess ? connectorMode.PUBLIC : connectorMode.PRIVATE
  const path = '/route/' + mode + '/' + publisherId

  const options = {
    host: connector.domain,
    port: port,
    path: path,
    method: 'DELETE',
  }
  if (!connector.devMode && connector.caCert && connector.isSelfSignedCert === true) {
    const ca = fs.readFileSync(connector.caCert)
    options.ca = Buffer.from(ca)
  }


  await AppHelper.makeRequest(!connector.devMode, options, '')
}

module.exports = {
  openSessionOnRandomConnector: openSessionOnRandomConnector,
  closeSessionOnConnector: closeSessionOnConnector,
}
