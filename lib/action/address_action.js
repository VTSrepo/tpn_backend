const { SendResponse } = require('../../common/app_utils');
const { AddressModule } = require('../modules/address_module');
var debug = require('debug')('v1:address:actions');

var addressModule = new AddressModule();
class AddressAction {


    GetAddressList(event, context) {
        var org_id = event.pathParameters.org_id; 
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return addressModule.getAddresss( org_id,query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }
  
    CreateAddress(event, context) {      
        var body_data = event.body;
        console.log(body_data)
        var query = event.queryParameters;
        validate_data_create_address(event.body.address)       
        .then(function(_response) {
            debug("validate data ", _response);
            return addressModule.createAddress(body_data.address,  query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }
    

  
   
    
}


function validate_data_create_address(product_data) {
    return new Promise((resolve, reject) => {
        return resolve(product_data)
    })
}
function validate_data(data) {
    return new Promise((resolve, reject) => {
        return resolve(data);
    })
}
module.exports = {
    AddressAction,
}