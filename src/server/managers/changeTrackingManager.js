/**
 * @file changeTrackingManager.js
 * @author Zishan Iqbal
 * @description This file includes the CURD operations for the changeTracking Model.
 */

import ChangeTracking from './../models/changeTracking';
import BaseManager from './../managers/baseManager';

class ChangeTrackingManager extends BaseManager {

	getEntity() {
			return ChangeTracking;
		}
		/**
		 * @desc - finds the changeTracking based on the instanceId
		 * @param String - instanceId
		 * @return JSON - returns a JSON object of changeTracking
		 */
	findByInstanceId(instanceId) {
			return ChangeTracking.find({
				where: {
					iofabric_uuid: instanceId
				}
			});
		}
		/**
		 * @desc - deletes the changeTracking based on the instanceId
		 * @param String - instanceId
		 * @return  Integer - returns the number of rows deleted
		 */
	deleteByInstanceId(instanceId) {
			return ChangeTracking.destroy({
				where: {
					iofabric_uuid: instanceId
				}
			});
		}
		/**
		 * @desc - updates the changetrakind data
		 * @param Integer, JSON object - uuid, data
		 * @return Integer - returns the number of rows updated
		 */
	updateByUuid(uuid, data) {
		console.log(data);
		return ChangeTracking.update(data, {
			where: {
				iofabric_uuid: uuid
			}
		});
	}
}

const instance = new ChangeTrackingManager();
export default instance;