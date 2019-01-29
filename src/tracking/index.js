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

const {isOnline} = require('../helpers/app-helper');
const https = require('https');
const EventTypes = require('../enums/tracking-event-type');
const os = require('os');
const AppHelper = require('../helpers/app-helper');
const crypto = require('crypto');

const TrackingEventManager = require('../sequelize/managers/tracking-event-manager');
const Transaction = require('sequelize/lib/transaction');

const fakeTransactionObject = {fakeTransaction: true};

const trackingUuid = getUniqueTrackingUuid();

function buildEvent(eventType, args, res, functionName) {
  let eventInfo = {
    uuid: trackingUuid,
    sourceType: 'controller',
    timestamp: Date.now(),
    type: eventType
  };
  switch (eventType) {
    case EventTypes.INIT:
      eventInfo.data = {event: 'controller inited'};
      break;
    case EventTypes.START:
      eventInfo.data = {event: `controller started: ${res}`};
      break;
    case EventTypes.USER_CREATED:
      eventInfo.data = {event: 'user created'};
      break;
    case EventTypes.RUNNING_TIME:
      eventInfo.data = {event: `${res} min`};
      break;
    case EventTypes.IOFOG_CREATED:
      eventInfo.data = {event: 'iofog agent created'};
      break;
    case EventTypes.IOFOG_PROVISION:
      eventInfo.data = {event: 'iofog agent provisioned'};
      break;
    case EventTypes.CATALOG_CREATED:
      eventInfo.data = {event: 'catalog item was created'};
      break;
    case EventTypes.MICROSERVICE_CREATED:
      eventInfo.data = {event: 'microservice created'};
      break;
    case EventTypes.CONFIG_CHANGED:
      eventInfo.data = {event: `new config property '${res}'`};
      break;
    case EventTypes.OTHER:
      eventInfo.data = {event: `function ${functionName} was executed`};
      break;
  }
  return eventInfo;
}

function sendEvents(events) {
  const body = {
    events: events
  }
  const data = JSON.stringify(body);
  let options = {
    host: 'analytics.iofog.org',
    path: '/post',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const request = https.request(options, (response)=>{
    //only for debug. comment before commit
    // console.log(response.statusCode);
  });
  request.write(data);
  request.end();
}

function getUniqueTrackingUuid() {
  let uuid;
  try {
    let allMacs = '';
    const interfaces = os.networkInterfaces();
    for (const i in interfaces) {
      if (i.internal) {
        continue;
      }
      allMacs += i.mac + '-'
    }
    uuid = crypto.createHash('md5').update(allMacs).digest("hex");
  } catch (e) {
    uuid = 'random_' + AppHelper.generateRandomString(32)
  }
  return uuid;
}

async function processEvent(event, fArgs) {
  if (isOnline()) {
    //save in db, and send later by job
    if (fArgs && fArgs.length > 0 && fArgs[fArgs.length - 1] instanceof Transaction) {
      await TrackingEventManager.create(event, fArgs[fArgs.length - 1]);
    } else {
      await TrackingEventManager.create(event, fakeTransactionObject);
    }
  } else {
    //just send
    try {
      sendEvents([event]);
    } catch (e) {
      //ignore
    }
  }
}

module.exports = {
  trackingUuid: trackingUuid,
  buildEvent: buildEvent,
  sendEvents: sendEvents,
  processEvent: processEvent
};