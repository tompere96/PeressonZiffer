const db = require('../database/DbConnection');
class UserData {
    constructor(email,hearthRate,minBloodPressure,maxBloodPressure,lat,long,timestamp,timeOfAcquisition) {
        this._email = email;
        this._hearthRate = hearthRate;
        this._minBloodPressure = minBloodPressure;
        this._maxBloodPressure = maxBloodPressure;
        this._lat = lat;
        this._long = long;
        //time of insert into db
        this._timestamp = timestamp;
        //time of acquisition of data on smartphone
        this._timeOfAcquisition = timeOfAcquisition;
    }
    static getUserDataFromEmail(email,callback){
        let sql = "SELECT * FROM UserData where PrivateCustomers_email = ?";
        db.con.query(sql,email,(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let userData = [];
                let tuple;
                for(let i = 0; i < res.length ; i++)
                    tuple = res[i];
                    userData.push(new UserData(
                        tuple.PrivateCustomers_email,
                        tuple.hearthRate,
                        tuple.minBloodPressure,
                        tuple.maxBloodPressure,
                        tuple.lat,
                        tuple.long,
                        new Date(tuple.timestamp),
                        new Date(tuple.timeOfAcquisition)
                    ));
                callback(userData);
            }else callback(false);
        })
    }


}
//UserData.getUserDataFromEmail("tompere96@gmail.com",(res)=> console.log(res));