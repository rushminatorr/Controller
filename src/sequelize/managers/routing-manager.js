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

const BaseManager = require('./base-manager')
const models = require('./../models')
const Routing = models.Routing
const ConnectorPrivateSession = models.ConnectorPrivateSession

class RoutingManager extends BaseManager {
  getEntity() {
    return Routing
  }

  findAllRoutesByConnectorId(connectorId, transaction) {
    return Routing.findAll({
      include: [
        {
          model: ConnectorPrivateSession,
          as: 'connectorPrivateSession',
          required: true,
        },
      ],
      where: {
        '$connectorPrivateSession.connector_id$': connectorId,
      },
    }, {transaction: transaction})
  }
}

const instance = new RoutingManager()
module.exports = instance
