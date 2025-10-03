const { UserDao } = require('../dao/user_dao');
var debug = require('debug')('v2:users:module');
const { changeLog } = require('../../common/error_handling');
var moment = require('moment-timezone');
const { GetRandomPatientID } = require('../../common/app_utils');

function generateParamString(query) {
    var key;
    var keys = new Array();
    var values = new Array();

    for (key in query.filter) {
        if (query.filter.hasOwnProperty(key)) {
            keys.push(key);
            values.push(query.filter[key])
        }
    }
    var strParams = '';

    for (i = 0; i < keys.length; i++) {
        var str = (keys.length - 1 != i) ? ' && ' : '';
        strParams += keys[i] + '=' + values[i] + str

    }
    // console.log('Parameters for query :',strParams)
    return strParams;
}

function generateSortOrder(query) {
    var key;
    var keys = new Array();
    var values = new Array();

    for (key in query.sort) {
        if (query.sort.hasOwnProperty(key)) {
            keys.push(key);
            values.push(query.sort[key])
        }
    }
    var strSortParams = ' ORDER BY ';

    for (i = 0; i < keys.length; i++) {
        var order = (values[i] == '-1') ? 'DESC' : 'ASC';
        var str = (keys.length - 1 != i) ? ', ' : '';
        strSortParams += keys[i] + ' ' + order + str
    }

    // console.log('Parameters for Sorting :',strSortParams)
    return strSortParams;
}

class UserModule {

    getUserLoginDetail(data) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var read_connection = null;
            var get_user;
            var access_menu;
            var returnResponse;
            var lang;
            try {
                console.log("inside");
                read_connection = await userDao.getReadConnection();
                console.log("Mddule")
                get_user = await userDao.getUserLogin(read_connection, data.user);
                console.log(get_user)
                console.log("User Module >>", get_user);
                if (get_user.hasOwnProperty('status') && get_user.status == 404) {
                    if (read_connection) {
                        await userDao.releaseReadConnection(read_connection);
                    }
                    returnResponse = changeLog(get_user.code, lang);
                    return resolve(returnResponse);
                }
                else {
                    debug("Get User Login Details", get_user,);
                    var user_data = await categories_schema_to_data_user(get_user);
                    console.log(user_data);
                    var final_res = {
                        status: 200, code: 200,
                        message: "Success",
                        developerMessage: "Success",
                        user: user_data

                    };
                    return resolve(final_res);
                }
            }
            catch (error) {
                if (read_connection) {
                    await userDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }


    CreateUser(data, query) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var read_connection = null;
            var user_data, set_user_data, user_user;
            var today = new Date();
            var date = moment(today).format("YYYY-MM-DD");
            try {
                read_connection = await userDao.getReadConnection();

                
                    var get_user_data = await userDao.getUserDetail(read_connection, data.user_id);
                    if (get_user_data.hasOwnProperty('status') && get_user_data.status == 404) {
                        set_user_data = await categories_data_to_schema_user_data_to_create(read_connection, data, date);
                        debug("set_user_data", set_user_data)
                        user_data = await userDao.createUser(read_connection, set_user_data);
                        if (read_connection) {
                            await userDao.releaseReadConnection(read_connection);
                        }
                        return resolve(user_data);
                    }
                    else {
                        // user_user = await categories_data_to_schema_user_data_to_update(data, get_user_data, date);
                        // user_data = await userDao.updateUser(read_connection, user_user, data.user_id);
                        var empty_response= { status: 404, code: 1001, message: "User ID Already Exist.  Try Another Name", developerMessage:"User ID Already Exist.  Try Another Name"};
                   
                        if (read_connection) {
                            await userDao.releaseReadConnection(read_connection);
                        }
                        return resolve(empty_response);
                    }
                
              
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await userDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    UpdateUser(data, query) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var read_connection = null;
            var user_data, set_user_data, user_user;
            var today = new Date();
            var date = moment(today).format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await userDao.getReadConnection();

                
                    var get_user_data = await userDao.getUserDetail(read_connection, data.user_id);
                    if    (get_user_data.hasOwnProperty('status') && get_user_data.status == 404) {
                       
                            // user_user = await categories_data_to_schema_user_data_to_update(data, get_user_data, date);
                            // user_data = await userDao.updateUser(read_connection, user_user, data.user_id);
                            var empty_response= { status: 404, code: 1001, message: "User ID Wrong.  Give Correct User Id", developerMessage:"User ID Wrong.  Give Correct User ID"};
                       
                            if (read_connection) {
                                await userDao.releaseReadConnection(read_connection);
                            }
                            return resolve(empty_response);
                        }
                     else {
                    
                    
                 
                        set_user_data = await categories_data_to_schema_user_data_to_update(data,get_user_data, date);
                        console.log("set_user_data", set_user_data)
                        user_data = await userDao.updateUser(read_connection, set_user_data,data.user_id);
                        if (read_connection) {
                            await userDao.releaseReadConnection(read_connection);
                        }
                        var final_res = {
                            status: 200, code: 200,
                            message: "Success",
                            developerMessage: "Success",
                            user: user_data
    
                        };
                        return resolve(final_res);
                    }
                    
                
              
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await userDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    GetUserList(org_id, query) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var connection = null;
            var get_users;
            try {
                connection = await userDao.getReadConnection();
                var get_users = await userDao.getUserList(connection,org_id,query);
            
                

                if (get_users.hasOwnProperty('status') && get_users.status == 404) {
                    if (connection) {
                        await userDao.releaseReadConnection(connection);
                    }
                    return resolve(get_users);
                }
                else {
                    var total_size = get_users.length;
                    var page_size = get_users.length//query.skip ? query.skip : total_size;
                    var result_size = get_users.length//strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        "status": 200,
                        "code": 200,
                        "message": "Success",
                        "developerMessage": "Success",
                        summary, users: get_users
                    }
                    debug("GetUSerList", get_users)
                    if (connection) {
                        await userDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch (error) {
                if (connection) {
                    await userDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }
}



function categories_data_to_schema_user_data_to_create(connection, data, date) {
    return new Promise(async (resolve, reject) => {
        try {

            
          
            var dob = null;
            if (data.hasOwnProperty('dob') && data.dob != '' && data.dob != null) {
                dob = moment(data.dob).format("YYYY-MM-DD");
            }
            var doj = null;
            if (data.hasOwnProperty('doj') && data.doj != '' && data.doj != null) {
                doj = moment(data.doj).format("YYYY-MM-DD");
            }
    
        
            var user_data = {
                org_id: data.org_id,
                branch_id: data.branch_id,
                user_id: data.user_id,
                user_name: data.user_name,
                dob: dob,
                doj: doj,
                mobile_no: data.mobile_no,
                home_contact_no: data.home_contact_no,
                residence_address: data.residence_address,
                email_id: data.email_id,
                user_type: data.user_type,
                user_status: data.user_status,
                pwd: data.pwd,
                updated_by: data.user_id,
                updated_date: date,
                created_by: data.user_id,
                created_date: date
            }
            return resolve(user_data)
        }
        catch (error) {
            return reject(error);
        }
    })
}


function categories_data_to_schema_user_data_to_update(data, get_user_data, date) {
    return new Promise(async (resolve, reject) => {
       
        var dob;
        if (data.hasOwnProperty('dob') && data.dob != '' && data.dob != null) {
            dob = moment(data.dob).format("YYYY-MM-DD");
        }
        var doj = null;
        if (data.hasOwnProperty('doj') && data.doj != '' && data.doj != null) {
            doj = moment(data.doj).format("YYYY-MM-DD");
        }
        try {
            var user_data = {  
                branch_id: data.hasOwnProperty('branch_id') ? data.branch_id : get_user_data.branch_id,
                user_name: data.hasOwnProperty('user_name') ? data.user_name : get_user_data.user_name,
                dob: dob,
                doj: doj,
                mobile_no: data.hasOwnProperty('mobile_no') ? data.mobile_no : get_user_data.mobile_no,
                home_contact_no: data.hasOwnProperty('home_contact_no') ? data.home_contact_no : get_user_data.home_contact_no,
                residence_address: data.hasOwnProperty('residence_address') ? data.residence_address : get_user_data.residence_address,
                email_id: data.hasOwnProperty('email_id') ? data.email_id : get_user_data.email_id,
                user_type: data.hasOwnProperty('user_type') ? data.user_type : get_user_data.user_type,
                user_status: data.hasOwnProperty('user_status') ? data.user_status : get_user_data.user_status,
                pwd: data.hasOwnProperty('pwd') ? data.user_name : get_user_data.pwd,
                updated_by: data.hasOwnProperty('user_id') ? data.user_id : get_user_data.updated_by,
                updated_date: date
            }
            return resolve(user_data)
        }
        catch (error) {
            return reject(error);
        }
    })
}

function categories_schema_to_data_user(userdata) {
    return new Promise((resolve, reject) => {
        var categorydata = {
            user_id: userdata.user_id,
            user_name: userdata.user_name,
            user_status: userdata.user_status,
            org_id: userdata.org_id,
            branch_id: userdata.branch_id,
            user_type: userdata.user_type

        }
        return resolve(categorydata)
    })
}

module.exports = {
    UserModule
}