const { AddressDao } = require('../dao/address_dao');
var debug = require('debug')('v1:address:module');

var moment = require('moment-timezone');
//const { GetRandomPatientID } = require('../../common/app_utils');

class AddressModule {
    getAddresss(org_id, query) {
        return new Promise(async(resolve, reject) => {
            var addressDao = new AddressDao();
            var connection = null;
            var get_addresss
            try {
                connection = await addressDao.getReadConnection();
                debug("query.filter", query);
                
                    get_addresss = await addressDao.getAddresss(connection,query);
                    if(get_addresss.hasOwnProperty('status') && get_addresss.status == 404) {
                        if (connection) {
                            await addressDao.releaseReadConnection(connection);
                        }
                        return resolve(get_addresss);
                       
                    }
                    else{
                        var total_size = get_addresss.length;
                        var page_size = get_addresss.length;
                        var result_size = get_addresss.length;
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            status: 200, code: 200, 
                            message: "Success", 
                            developerMessage: "Success" ,
                            summary, address: get_addresss
                        }

                        if (connection) {
                            await addressDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                
            }
            catch(error) {
                if (connection) {
                    await addressDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

  

    createAddress(data,  query) {
        return new Promise(async (resolve, reject) => {
            
            var today = new Date();
            var datetime = moment(today).format("YYYY-MM-DD HH:mm:ss");
            var addressDao = new AddressDao();
            var read_connection = null;
            var address_data, set_address_data, user_address;
            var today = new Date();
           // var date = moment(today).format("YYYY-MM-DD");
            try {
                read_connection = await addressDao.getReadConnection();
                console.log("CreateEmpAddress", data);
               
                if(data.hasOwnProperty('name') && data.name!=null && data.name.length>0)  {
                    console.log("CreateEmpAddress name", data.name);
                    var get_address_data = await addressDao.GetAddress(read_connection,data.name);                   
                    if(get_address_data.hasOwnProperty('status') && get_address_data.status == 404)  {
                        set_address_data = await categories_data_to_schema_address_data_to_create(data, datetime);
                        console.log("Create", set_address_data)
                        address_data = await addressDao.createAddress(read_connection, set_address_data);
                        if (read_connection) {
                            await addressDao.releaseReadConnection(read_connection);
                        }
                        var final_res={
                            status: 200, code: 200, 
                            message: "Success", 
                            developerMessage: "Success" ,
                            "address":address_data
                        }
                        return resolve(final_res);
                    }
                    else{
                        console.log('update')
                        user_address = await categories_data_to_schema_address_data_to_update(data, get_address_data,datetime);
                        address_data = await addressDao.updateAddress(read_connection, user_address, data.name);
                        console.log("Update Address>139", user_address)
                       if (read_connection) {
                            await addressDao.releaseReadConnection(read_connection);
                        }
                        var final_res={
                            status: 200, code: 200, 
                            message: "Success", 
                            developerMessage: "Success" ,
                            "address":address_data
                        }
                        return resolve(final_res);
                    }
                }else{
                    console.log("Create Address>152");
                    set_address_data = await categories_data_to_schema_address_data_to_create(data, datetime);
                    console.log("Create Address>152");
                     address_data = await addressDao.createAddress(read_connection, set_address_data);
                     if (read_connection) {
                         await addressDao.releaseReadConnection(read_connection);
                     }
                     var final_res={
                         status: 200, code: 200, 
                         message: "Success", 
                         developerMessage: "Success" ,
                         "address":address_data
                     }
                     return resolve(final_res);
                }
                
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await addressDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

  
}


function categories_data_to_schema_address_data_to_create(data,datetime){
    return new Promise(async(resolve, reject) => {
        try {
           
           
        var address_data = {
    
            name: data.name, 
            receipt_name:data.receipt_name, 
            address1: data.address1, 
            address2:data.address2,
            address3:data.address3,
            city:data.city,
            pincode:data.pincode,
            phone:data.phone,
            pan:data.pan,
            updated_by: data.user_id, 
            updated_date: datetime, 
            created_by: data.user_id, 
            created_date: datetime
                
            

        }
        console.log("Two",address_data);
        return resolve(address_data)

            
        }
        catch (error) {
            return reject(error);    
        }
    })
}


function categories_data_to_schema_address_data_to_update(data, get_address_data, datetime) {        
    return new Promise(async(resolve, reject) => {
        try {
           
            var address_data = {
                 name: data.hasOwnProperty('name')?data.name:get_address_data.name,  
                 receipt_name:data.hasOwnProperty('receipt_name')?data.receipt_name:get_address_data.receipt_name, 
                 address1: data.hasOwnProperty('address1')?data.address1:get_address_data.address1,
                 address2:data.hasOwnProperty('address2')?data.address2:get_address_data.address2,
                 address3:data.hasOwnProperty('address3')?data.address3:get_address_data.address3,
                 city:data.hasOwnProperty('city')?data.city:get_address_data.city,
                pincode:data.hasOwnProperty('pincode')?data.pincode:get_address_data.pincode,
                phone:data.hasOwnProperty('phone')?data.phone:get_address_data.phone,
                pan:data.hasOwnProperty('pan')?data.pan:get_address_data.pan,
                updated_by: data.user_id, 
                updated_date: datetime
       }
           
            return resolve(address_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}




module.exports = {
   AddressModule
  
}