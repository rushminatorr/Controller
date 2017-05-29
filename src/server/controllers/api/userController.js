import async from 'async';
import https from 'https';
require('dotenv').config();
import emailRecoveryTemplate from '../../../views/emailTemp';

import UserService from '../../services/userService';
import transporter  from '../../utils/emailSender';
import AppUtils from '../../utils/appUtils';
import logger from '../../utils/winstonLogs';

/*********************************************** EndPoints ******************************************************/
/********************** Get User Details EndPoint (Get: /api/v2/get/user/data/:t *******************************/
 const getUserDetailsEndPoint = function(req, res) {
 	logger.info("Endpoint hit: "+ req.originalUrl);

  	var params = {},
    userProps = {
      userId: 'bodyParams.t',
      setProperty: 'user'
    };

  	params.bodyParams = req.params;
  	logger.info("Parameters:" + JSON.stringify(params.bodyParams));

  	async.waterfall([
    	async.apply(UserService.getUser, userProps, params)

   	], function(err, result) {
   		if(!err){
   			var output = {
 				firstName: params.user.firstName,
 				lastName: params.user.lastName
 			}
 			params.output = output;
   		}
    	
    	AppUtils.sendResponse(res, err, 'user', params.output, result);
  	});
 }

/********************** Update User Details EndPoint (Post: /api/v1/user/profile/update *****************/
 const updateUserDetailsEndPoint = function(req, res) {
 	logger.info("Endpoint hit: "+ req.originalUrl);

  	var params = {},
    userProps = {
      userId: 'bodyParams.t',
      setProperty: 'user'
    };

  	params.bodyParams = req.body;
  	logger.info("Parameters:" + JSON.stringify(params.bodyParams));

  	async.waterfall([
    	async.apply(UserService.getUser, userProps, params),
    	updateUserProfile

   	], function(err, result) {
    	
    	AppUtils.sendResponse(res, err, '', '', result);
  	});
 }

/********************** Update User Password EndPoint (Post: /api/v1/user/password/change *****************/
 const updateUserPasswordEndPoint = function(req, res) {
 	logger.info("Endpoint hit: "+ req.originalUrl);

  	var params = {},
    userProps = {
      userId: 'bodyParams.t',
      setProperty: 'user'
    };

  	params.bodyParams = req.body;
  	logger.info("Parameters:" + JSON.stringify(params.bodyParams));

  	async.waterfall([
    	async.apply(UserService.getUser, userProps, params),
    	validateOldPassword,
    	validateNewPassword,
    	updateUserPassword,
    	notifyUserAboutPasswordChange

   	], function(err, result) {
    	AppUtils.sendResponse(res, err, '', '', result);
  	});
 }

const notifyUserAboutPasswordChange = function(params, callback){
	try{
  if (params.user){
    let mailOptions = {
      from: '"IOTRACKS" <' + process.env.email + '>', // sender address
      to: params.user.email, // list of receivers
      subject: 'Password Change Notification', // Subject line
      html: emailRecoveryTemplate.p1+ params.user.firstName + ' ' + params.user.lastName + emailRecoveryTemplate.p2 // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
        callback('Err', 'Email not sent due to technical reasons. Please try later.');
      }else{
      	logger.info('Message %s sent: %s', info.messageId, info.response);
      	callback(null, params);
      }
    });
  }else{
    callback('Err','Cannot find user email.')
  }
}catch(e){
	logger.error(e);
}
}

/********************** Delete User Account EndPoint (Post: /api/v1/user/account/delete *****************/
 const deleteUserAccountEndPoint = function(req, res) {
 	logger.info("Endpoint hit: "+ req.originalUrl);

  	var params = {},
    userProps = {
      userId: 'bodyParams.t',
      setProperty: 'user'
    },
    deleteProps = {
      userId: 'user.id'
    };

  	params.bodyParams = req.body;
  	logger.info("Parameters:" + JSON.stringify(params.bodyParams));

  	async.waterfall([
    	async.apply(UserService.getUser, userProps, params),
    	async.apply(UserService.deleteByUserId, deleteProps)

   	], function(err, result) {
    	AppUtils.sendResponse(res, err, '', '', result);
  	});
 }

/***************************** Extra Functions **************************/
 const validateOldPassword = function(params, callback){
 	if(params.bodyParams.oldPassword == params.user.password){
 		callback(null, params);
 	}else{
 		callback('Error', 'Old password donot match with this userId.');
 	}
 }

 const validateNewPassword = function(params, callback){
 	if(params.bodyParams.newPassword.length > 7)	
 		if(params.bodyParams.newPassword == params.bodyParams.repeatNewPassword){
 			callback(null, params);
 		}else{
 			callback('Error', 'New passwords donot match each other.');
 	}else{
 		callback('Error', 'Password length should be at least 8 characters.');
 	}
 }

 const updateUserPassword = function(params, callback){
    var updateProps = {
      token: 'bodyParams.t',
      updateData: {
      	password: params.bodyParams.newPassword
      }
    };
 	UserService.updateUserByToken(updateProps, params, callback);
 }

 const updateUserProfile = function(params, callback){
  if (params.bodyParams.firstName.length > 2){
    if(params.bodyParams.lastName.length > 2){
      var updateProps = {
        token: 'bodyParams.t',
        updateData: {
      	 firstName: params.bodyParams.firstName,
      	 lastName: params.bodyParams.lastName
        }
      };
 	  
      UserService.updateUserByToken(updateProps, params, callback);
    }else{
    callback('Error', 'Last Name should have at least 3 characters.' )
    }
  }else{
    callback('Error', 'First Name should have at least 3 characters.' )
 }
 }

 export default {
 	getUserDetailsEndPoint: getUserDetailsEndPoint,
 	updateUserDetailsEndPoint: updateUserDetailsEndPoint,
 	updateUserPasswordEndPoint: updateUserPasswordEndPoint,
 	deleteUserAccountEndPoint: deleteUserAccountEndPoint
 }