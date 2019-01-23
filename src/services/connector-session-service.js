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

const ConnectorManager = require('../sequelize/managers/connector-manager');
const https = require('https');
const http = require('http');
const constants = require('../helpers/constants');
const connectorMode = require('../enums/connector-access-mode');
const logger = require('../logger');
const fs = require('fs');

async function openSessionOnRandomConnector(isPublicAccess, publisherId, transaction) {
  let isConnectorSessionOpen = false;
  let session = null;
  let connector = null;
  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      connector = await _getRandomConnector(transaction);
      session = await _openSessionOnConnector(connector, isPublicAccess, publisherId);
      if (session) {
        isConnectorSessionOpen = true;
        break;
      }
    } catch (e) {
      logger.warn(`Failed to open ports on Connector. Attempts ${i + 1}/${maxAttempts}`)
    }
  }
  if (!isConnectorSessionOpen) {
    throw new Error('Not able to open port on remote Connector. Gave up after 5 attempts.')
  }
  session.connectorId = connector.id;
  return {session: session, connector: connector}
}

async function _openSessionOnConnector(connector, isPublicAccess, publisherId) {
  const json = isPublicAccess
    ? {
        publisherId: publisherId,
        routeType: connectorMode.PUBLIC
      }
    : {
        publisherId: publisherId,
        routeType: connectorMode.PRIVATE
      };

  const data = JSON.stringify(json);

  let port = connector.devMode ? constants.CONNECTOR_HTTP_PORT : constants.CONNECTOR_HTTPS_PORT;

  let options = {
    host: connector.domain,
    port: port,
    path: '/route',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  if (!connector.devMode && connector.cert && connector.isSelfSignedCert === true) {
    const ca = fs.readFileSync(connector.cert);
    options.ca = new Buffer.from(ca);
  }

  const session = await _makeRequest(connector, options, data);
  return session
}

async function _getRandomConnector(transaction) {
  const connectors = await ConnectorManager.findAll({}, transaction);

  if (connectors && connectors.length > 0) {
    const randomNumber = Math.round((Math.random() * (connectors.length - 1)));
    return connectors[randomNumber]
  } else {
    throw new Error('no connectors defined')
  }
}

async function closeSessionOnConnector(connector, isPublicAccess, publisherId) {
  const port = connector.devMode ? constants.CONNECTOR_HTTP_PORT : constants.CONNECTOR_HTTPS_PORT;
  const mode = isPublicAccess ? connectorMode.PUBLIC : connectorMode.PRIVATE;
  const path = '/route/' + mode + '/' + publisherId;

  let options = {
    host: connector.domain,
    port: port,
    path: path,
    method: 'DELETE',
    // headers: {
      // 'Content-Type': 'application/json'
      // 'Content-Length': Buffer.byteLength(0)
    // }
  };
  if (!connector.devMode && connector.cert && connector.isSelfSignedCert === true) {
    const ca = fs.readFileSync(connector.cert);
    options.ca = new Buffer.from(ca);
  }


  await _makeRequest(connector, options, '')
}

async function _makeRequest(connector, options, data) {
  return new Promise((resolve, reject) => {
    let httpreq = (connector.devMode ? http : https).request(options, function (response) {
      let output = '';
      response.setEncoding('utf8');

      response.on('data', function (chunk) {
        output += chunk;
      });

      response.on('end', function () {
        if (response.statusCode === 204) {
          return resolve();
        }
        let responseObj = {};
        try {
          responseObj = JSON.parse(output);
        } catch (e) {
          logger.warn(e.message);
        }

        if (responseObj.errormessage) {
          return reject(new Error(responseObj.errormessage));
        } else {
          return resolve(responseObj);
        }
      });
    });

    httpreq.on('error', function (err) {
      console.log(err);
      if (err instanceof Error)
        return reject(new Error(err.message));
      else
        return reject(new Error(JSON.stringify(err)));
    });

    httpreq.write(data);
    httpreq.end();
  })
}

module.exports = {
  openSessionOnRandomConnector: openSessionOnRandomConnector,
  closeSessionOnConnector: closeSessionOnConnector
};
