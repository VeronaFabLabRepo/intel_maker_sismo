var digitalAccelerometer = require('jsupm_mma7660');
var fs = require('fs');
var request = require("request");

var g = 1.0;
var delta = 0.05;
var max = 700;
var stazione = "pippo";

var sismografo = new digitalAccelerometer.MMA7660(digitalAccelerometer.MMA7660_I2C_BUS, digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);
sismografo.setModeStandby();
sismografo.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_120);
sismografo.setModeActive();

var ax, ay, az;
ax = digitalAccelerometer.new_floatp();
ay = digitalAccelerometer.new_floatp();
az = digitalAccelerometer.new_floatp();

var intervallo = setInterval(function(){
	sismografo.getAcceleration(ax, ay, az);
	if(isMotion()){
		request('http://104.40.139.35:1880/sismo?ax='+roundNum(digitalAccelerometer.floatp_value(ax),4)+'&ay='+roundNum(digitalAccelerometer.floatp_value(ay),4)+'&az='+roundNum(digitalAccelerometer.floatp_value(az),4)+'&nodeId='+stazione, function(error, response, body) {
			console.log(body);
        });
	}
}, 10);


function roundNum(num, decimalPlaces){
	var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
	return (Math.round((num + extraNum) * (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));
}

function isMotion(){
	var value = Math.sqrt(Math.pow(roundNum(digitalAccelerometer.floatp_value(ax),4),2) + Math.pow(roundNum(digitalAccelerometer.floatp_value(ay),4),2) + Math.pow(roundNum(digitalAccelerometer.floatp_value(az),4),2));
	console.log(value);
	if((value >= g+delta || value <= g-delta) && value < max){
		return true;
	}else{
		return false;
	}
}

// When exiting: clear interval and print message
process.on('SIGINT', function(){
	clearInterval(intervallo);

	digitalAccelerometer.delete_floatp(ax);
	digitalAccelerometer.delete_floatp(ay);
	digitalAccelerometer.delete_floatp(az);

	sismografo.setModeStandby();
	
	

	console.log("Exiting...");
	process.exit(0);
});
