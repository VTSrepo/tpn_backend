const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:addresss:dao');
const BaseDao = require('./base_dao');

class AddressDao extends BaseDao {

    getAddresss(connection, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                
                if(query.filter.hasOwnProperty('name') && query.filter.name!=null){
                     var custQuery = `SELECT *  FROM ${process.env.WRITE_DB_DATABASE}.address_entries 
                WHERE  name='${query.filter.name}'`;
                }else{
                      var custQuery = `SELECT *  FROM ${process.env.WRITE_DB_DATABASE}.address_entries `;
                }

                console.log("getAddresss", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    console.log('Sorry, Address Data Not Found!.');
                    var error_code = { status: 404, code: 4001, message: "Sorry, Address Data Not Found!.", developerMessage: "Sorry, Address Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getAddresss Error :', error)
                return reject(err_code);
            }
        })
    }
   

    createAddress(connection, product_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                console.log(product_data)
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.address_entries SET ?`, product_data);
                console.log('COMMIT at createAddress', product_data);
                return resolve(product_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                console.log("create address error :", err);
                return reject(err_code);
            }
        })
    }

   
    updateAddress(connection, set_product_data, name) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.address_entries SET ? 
                    WHERE name='${name}'   `, set_product_data);
                //debug('COMMIT at updateProduct', `UPDATE ${process.env.WRITE_DB_DATABASE}.address_data SET ? WHERE product_id='${product_id}' `, set_product_data);
                return resolve(set_product_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateProduct Error :", err);
                return reject(err_code);
            }
        })
    }



    GetAddress(connection, name) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.address_entries 
                WHERE name='${name}'   `;
                console.log("GetProductById", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    console.log('Sorry, Product Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Address Data Not Found!.", developerMessage: "Sorry, Product Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    var _res = JSON.parse(JSON.stringify(queryres));
                    var response = _res[0];
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                console.log('Get Address Error :', error)
                return reject(err_code);
            }
        })
    }

   
 
}

module.exports = {
    AddressDao
}