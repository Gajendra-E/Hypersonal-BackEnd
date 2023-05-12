var _ = require('underscore');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


module.exports = {
	
	encrypt: function(text){
		return new Promise(function (resolve, reject) {
		  	var cipher = crypto.createCipher(algorithm, password)
		  	var crypted = cipher.update(text,'utf8','hex')
		  	crypted += cipher.final('hex');
		  	resolve(crypted);
		})
	},
 
	decrypt: function(text){
		return new Promise(function (resolve, reject) {
			try{
				var decipher = crypto.createDecipher(algorithm, password)
			  	var dec = decipher.update(text,'hex','utf8')
			  	dec += decipher.final('utf8');
			  	resolve(dec);
			}catch(err){
				resolve(null)
			}
		  	
	  	})
	},
}