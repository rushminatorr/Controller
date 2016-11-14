import ElementInstanceManager from '../managers/elementInstanceManager';
import AppUtils from '../utils/appUtils';

const getElementInstance = function(props, params, callback) {
  var elementInstanceId = AppUtils.getProperty(params, props.elementInstanceId);

  ElementInstanceManager
    .findByUuId(elementInstanceId)
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Cannot find Element Instance', callback));
}

const getElementInstancesByTrackId = function(params, callback) {
  ElementInstanceManager
    .findByTrackId(params.bodyParams.trackId)
    .then(AppUtils.onFind.bind(null, params, 'trackElementInstances', 'Cannot find Element Instances related to track ' + params.bodyParams.trackId, callback));
}

/**
 * @desc - this function uses the default values to create a new element instance
 */
const createElementInstance = function(propertyName, params, callback) {
  ElementInstanceManager
    .createElementInstance(params.element, params.userId, params.bodyParams.TrackId, params.bodyParams.Name, params.bodyParams.LogSize)
    .then(AppUtils.onCreate.bind(null, params, propertyName, 'Unable to create Element Instance', callback));
}

/**
 * @desc - this function finds the element instance which was changed
 */
const createStreamViewerElement = function(params, callback) {

  ElementInstanceManager
    .createStreamViewerInstance(params.fabricType.streamViewerElementKey, params.userId, params.fabricInstance.uuid)
    .then(AppUtils.onCreate.bind(null, params, 'streamViewer', 'Unable to create Stream Viewer', callback));

}

const createNetworkElementInstance = function(props, params, callback) {
  var networkElement = AppUtils.getProperty(params, props.networkElement),
    fogInstanceId = AppUtils.getProperty(params, props.fogInstanceId),
    satellitePort = AppUtils.getProperty(params, props.satellitePort),
    trackId = props.trackId ? AppUtils.getProperty(params, props.trackId) : 0,
    satelliteDomain = AppUtils.getProperty(params, props.satelliteDomain),
    userId = AppUtils.getProperty(params, props.userId);

  if (!props.networkName) {
    props.networkName = 'Network for Element ' + networkElement.uuid;
  }

  ElementInstanceManager
    .createNetworkInstance(networkElement, userId, fogInstanceId, satelliteDomain, satellitePort, props.networkName, props.networkPort, props.isPublic, trackId)
    .then(AppUtils.onCreate.bind(null, params, props.setProperty, 'Unable to create Network Element Instance', callback));

}

/**
 * @desc - this function finds the element instance which was changed
 */
const createDebugConsole = function(params, callback) {

  ElementInstanceManager
    .createDebugConsoleInstance(params.fabricType.consoleElementKey, params.userId, params.fabricInstance.uuid)
    .then(AppUtils.onCreate.bind(null, params, 'debugConsole', 'Unable to createDebug console object', callback));
}

const updateDebugConsole = function(params, callback) {
  ElementInstanceManager
    .updateByUUID(params.debugConsole.uuid, {
      'updatedBy': params.userId
    })
    .then(AppUtils.onUpdate.bind(null, params, "Unable to update 'UpdatedBy' field for DebugConsoleElement", callback));

}

const updateRebuild = function(props, params, callback) {
  var elementInstanceId = AppUtils.getProperty(params, props.elementInstanceId);

  ElementInstanceManager
    .updateByUUID(elementInstanceId, {
      'rebuild': 1
    })
    .then(AppUtils.onUpdate.bind(null, params, "Unable to update 'rebuild' field for ElementInstance", callback));

}

const updateElemInstance = function(params, callback) {
  var updateChange = {};

  if (params.bodyParams.config) {
    updateChange.config = params.bodyParams.config;
    updateChange.configLastUpdated = params.milliseconds;
    params.isConfigChanged = true;
  }

  if (params.bodyParams.name) {
    updateChange.name = params.bodyParams.name
  }

  ElementInstanceManager
    .updateByUUID(params.bodyParams.elementId, updateChange)
    .then(AppUtils.onUpdate.bind(null, params, 'Unable to update Element Instance', callback));

}

const deleteNetworkElementInstance = function(params, callback) {
  ElementInstanceManager
    .deleteNetworkElement(params.bodyParams.elementId)
    .then(AppUtils.onDelete.bind(null, params, 'No Network Element Instance found', callback));
}

const deleteElementInstance = function(params, callback) {
  ElementInstanceManager
    .deleteByElementUUID(params.bodyParams.elementId)
    .then(AppUtils.onDelete.bind(null, params, 'Was unable to delete Element Instance', callback));
}

const deleteElementInstanceByNetworkPairing = function(params, callback) {
  ElementInstanceManager
    .deleteByElementUUID(params.networkPairing.networkElementId1)
    .then(AppUtils.onDelete.bind(null, params, 'Was unable to delete Network pairing Element Instance', callback));
}

export default {
  createDebugConsole: createDebugConsole,
  createElementInstance: createElementInstance,
  createNetworkElementInstance: createNetworkElementInstance,
  createStreamViewerElement: createStreamViewerElement,
  deleteElementInstance: deleteElementInstance,
  deleteElementInstanceByNetworkPairing: deleteElementInstanceByNetworkPairing,
  deleteNetworkElementInstance: deleteNetworkElementInstance,
  getElementInstance: getElementInstance,
  getElementInstancesByTrackId: getElementInstancesByTrackId,
  updateDebugConsole: updateDebugConsole,
  updateElemInstance: updateElemInstance,
  updateRebuild: updateRebuild,

};