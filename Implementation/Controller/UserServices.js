const PrivateCustomer = require('../model/PrivateCustomer');
const UserData = require('../model/UserData');
const BusinessCustomer = require("../model/BusinessCustomer");
const PrivateRequest = require("../model/PrivateRequest");
const CodiceFiscale = require("codice-fiscale-js");
/*
*   PrivateCustomer Module:
*
*   Will interface only with the mobile app, providing all the methods of managing the
*   account (login, register, subscribe, etc.) and which also allows the Private Customer to see his/her personal data.
 */

/*
Object Containing
args: {
    email
    password
    name
    surname
    sex
    placeOfBirth
    dateOfBirth
    cf
}
like
registerPrivateCustomer({
    email:'tompere96@gmail.com',
    password: 'psw',
    name:'Tommaso',
    surname: 'Peresson',
    sex: 'M',
    placeOfBirth: 'Udine',
    dateOfBirth: new Date(1996,5,11),
    codiceFiscale:'PRSTMS96H11L483L'
});
callback returns weather if the committing was successful or not
*/
function registerPrivateCustomer(args,callback) {
    let pc = new PrivateCustomer(args);
    if(pc.isPCValid()){

        pc.commitToDb(callback);
    }else callback(false);

}

function authPrivateCustomer(email,password,callback) {
    PrivateCustomer.getPrivateCustomerFromDb(email,null,(res)=>{

        if(res !== false){
            if(res._password === password) callback(true);
            else callback(false);
        }else callback(false);
    })
}

function putUserData(args,callback) {
    new UserData(args.email,args.hearthRate,args.minBloodPressure,args.maxBloodPressure,args.lat,args.long,new Date(),args.timeOfAcquisition).commitToDb(callback)

}

/*
 * checks if exist any private/business customer with given email
 *
 * callback(res) res is bool
 */
function isCustomerRegistered(email,callback) {
    return PrivateCustomer.isEmailPresent(email,callback);
}

/*
*   callback(res) res is an array of UserData
 */
function getPersonalData(email,callback) {
    return UserData.getUserDataFromEmail(email,callback);
}

function getPrivateRequests(PCEmail,callback) {
    PrivateRequest.getPrivateRequestsByPC(PCEmail,callback);
}
function setPrivateRequestStatus(PCEmail,BCEmail,val,callback) {
    PrivateRequest.setAcceptedStatus(BCEmail,PCEmail,val,callback)
}

/*
 *   BusinessCustomer Module:
 *   Will interface only with the web app (business customer side) that will provide the methods for managing the account
 *   for the Business Customer
 *
 */
function registerBusinessCustomer(args,callback){
    args.active = 0;

    if(args.password.length <= 0) callback(false);

    else if(args.email.length <= 0) callback(false);

    else new BusinessCustomer(args).commitToDb(callback);

}



 /*
 *   SystemManager Account:
 *   Will interface only with the web app ( system manager side) providing methods to see the business customers
 *   who want to register and to accept / reject them
 */
function getPendingBusinessCustomers(callback){
    BusinessCustomer.getPendingBusinessCustomersFromDb((res) => {
        if(res !== false) {
            res = res.map((value, index) => {
                value.password = '';
                return value;
            });
        }
        callback(res);
    });
}

function setBusinessCustomerActiveStatus(email,value,callback){
    BusinessCustomer.setActiveStatus(email,value,callback);
}

function setBusinessCustomerActive(email,callback){
    setBusinessCustomerActiveStatus(email,1,callback);
}

function setBusinessCustomerDenied(email,callback){
    setBusinessCustomerActiveStatus(email,2,callback);
}

 module.exports = {
     registerPrivateCustomer:registerPrivateCustomer,
     isCustomerRegistered:isCustomerRegistered,
     registerBusinessCustomer:registerBusinessCustomer,
     getPendingBusinessCustomers:getPendingBusinessCustomers,
     setBusinessCustomerActive:setBusinessCustomerActive,
     setBusinessCustomerDenied:setBusinessCustomerDenied,
     authPrivateCustomer:authPrivateCustomer,
     getPersonalData:getPersonalData,
     putUserData:putUserData,
     getPrivateRequests:getPrivateRequests,
     setPrivateRequestStatus:setPrivateRequestStatus



 };