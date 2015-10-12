//-------------------------------------------------------
//	Safe and Sound
//  by Jarrett Gliner
//  © 2015 All Rights Reserved
//
//	Based off "Keep Talking and Nobody Explodes"
//  © 2015 Steel Crate Games
//-------------------------------------------------------

//-------------------------------------------------------
//	INSTANTIATON FOR GLOBAL VARIABLES
//-------------------------------------------------------
var strikes = 0;

//-------------------------------------------------------
//	GAME START
//-------------------------------------------------------

function gameTimerOn() {
	var time = 12000,
	sec, mins, tenthsec, hundsec;

	var counter = setInterval(function() {
		sec = parseInt(time/100%60),
		mins = parseInt(time/100/60);

		sec < 10 ? sec = String("0"+sec) : sec;

		$('#mainTimer').html(mins + ":" + sec );
		time = time - 1;

		if (time <= 0 || strikes === 3) {
			$('#mainTimer').html("- -- --");
			clearInterval(counter);
			kablooey();
		}

	}, 10);

};

$('.startmenu').click(function() {

$('.startmenu').addClass('invis');
$('#countdown').removeClass('invis');
var tminus = 3;
$('#countdown').append('Mission Begins in '+tminus+'... ');
var gamestart = setInterval(function() {
	tminus--
	$('#countdown').append(''+tminus+'... ');
	if (tminus === 0) {
		$('#menu').fadeOut(function() {
			$(this).removeClass('start');
			$('#menuheader').attr('src', '');
		});
		clearInterval(gamestart);
		gameTimerOn();
	}
}, 1000)

console.time("All of it");

//-------------------------------------------------------
//	BANKS AND LISTS
//-------------------------------------------------------

var keypadColumns = {
	orders: [
		['a','b','c','d','e','f','g','h','i','j'],
		['q','s','z','t','1','a','r','p','0','7'],
		['z','3','m','5','l','p','q','n','4','x'],
		['1','2','6','e','h','k','n','u','v','y'],
		['8','9','c','i','k','m','t','w','x','y'],
		['0','2','4','6','d','f','j','r','s','w']
	]
};

var panicWords = {
	commandPrefix: [["Alpha","Eligible","Hypo-","Master","Secret","Super-"],["Bravo","Flub-","i-","Mechanical","Secu-","Uber-"],["Crypto-","Garbage","Illegible","Oopsie","Spy"],["Delta","Geopolitical","Invisible","Peta-","Yoooo"],["Draxon","Glaxon","Java-","Quark","Umm"],["Electric","Hydro-","Left Hand","Right Hand","Uh Oh,"],["Electro-","Hyper-","Locking","Schwifty","Uhh"]],
	commandSuffix: ["Agent","Bearfold","Bit","Bite","Bot","Boy","Bypass","Byte","Crystal","Dispersal Unit","Dryer","Enigma","Freud","Goose","Groose","Hacker","Jabroni","Key","Link","Man","Matic","Mixer","Pannel","Port","Reactor","Servo","Slide","Slot","Solwafter","Sponge","Thing","Touchdown","Tray","Trigger","Tumbler","Unit","Zorp"],
	commandStatus: ["Failing","Error","Access",": Permission Denied","Messed Up","On the Fritz","Loose","Not Working","at Critical Mass","Needs Tinkering","Check","Shot","Breakdown","Drained","Needs Greasing","Unsafe","Released","Overheating","is Not Feeling Well","Stopped","Malfunction","Falling","Slacking","Deflated","Needs Rebooting","Unauthorized","Incorrect","Evacuated","Defective","Reset","Combination","Code","FUBAR'd","Override","Locked","No, Wait...","Mixed Up"]
};

var launchpadFormations = [["R","W","W","B","W","R","B","W","W","B","R","W","B","W","W","R"],["B","Y","Y","B","W","R","Y","W","Y","Y","Y","Y","Y","Y","Y","W"],["B","B","B","W","W","B","B","B","W","B","Y","B","R","W","R","W"],["G","R","W","W","W","G","B","W","G","G","G","G","W","R","R","G"],["R","W","W","R","W","Y","Y","W","W","R","R","W","W","W","W","W"],["W","R","B","R","W","W","R","W","W","W","B","W","R","B","R","W"],["W","W","W","W","G","Y","G","W","Y","R","Y","W","G","Y","G","W"],["B","W","W","B","W","W","W","W","R","R","R","R","B","R","R","B"],["W","W","G","W","Y","W","W","Y","W","W","G","W","W","G","W","Y"],["W","W","Y","Y","R","Y","Y","B","W","Y","B","W","W","W","Y","W"],["W","Y","Y","W","R","Y","Y","R","W","G","G","W","Y","W","W","Y"],["R","R","G","G","R","G","R","G","R","G","G","G","R","R","R","G"],["R","W","W","R","W","G","G","G","W","G","Y","G","R","G","G","G"],["G","R","R","R","G","B","B","R","G","B","B","Y","G","Y","Y","Y"],["B","B","R","R","B","B","W","W","R","R","R","R","W","W","W","W"]]; 

//-------------------------------------------------------
//	GLOBAL FUNCTIONS
//-------------------------------------------------------

var specificRand = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

var countTarget = function(arr, targetval) {
	count = arr.reduce(function(n, item) {
		return item === targetval ? n+1 : n;
	}, 0);
	return count;
};

var countLimits = function(arr, limit) {
	count = arr.reduce(function(n, item) {
		n[item] == undefined ? n[item] = 1 : n[item] += 1;
		return n[item] > limit ? false : n;
	}, {});
	return count;
};

// Checks how many values in the array have met the limit, and returns true if the result is below the allowed limit
// Use: checks if there are no more than one occurrance (allowedLimit) of two of wires that are the same color
var multiLimits = function(arr, limit, allowedLimit) {
	var obj = countLimits(arr, limit),
	allowed = 0;
	if (obj.length > 1) {
		for (key in obj) {
			if (obj[key] === limit) {
			allowed+= 1;
			}
		}
		return allowed > allowedLimit ? false: true;
	}
	return false;
}

var arrSame = function(arr) {
	return arr.reduce(function(n, item) {
		return n === item ? n : false;
	});
}

var arrConsecutive = function(arr) {
	var len = arr.length,
	consec = 1,
	temp = 1;
	for (var i = 0; i < len-1; i++) {
		if (arr[i] === arr[i+1]) {
			temp += 1
		}
		else {
			if (temp > consec) {
				consec = temp;
			temp = 1;
			}
		}
	}
	return consec > temp ? consec : temp;
}

//-------------------------------------------------------
//	UNIQUE MODULE GENERATOR
//-------------------------------------------------------

function GenSerial() {
	var serial = "",
	bank = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i < 8; i++) {
		serial+=bank.charAt(Math.floor(Math.random() * bank.length));
	}
	$('#serial').html("SN: <b>" + serial + "</b>");
	return serial;
}

function GenEdition() {
	var edition = "Extra Nice";
	$('#edition').html("Special " + edition + " Edition!");
	return edition;
}

function GenIndicator() {
	var indicator = "",
	bank = "EPZOBENMDTC";
	for (var i = 0; i < 3; i++) {
		indicator+=bank.charAt(Math.floor(Math.random() * bank.length));
	}
	$('#indicatorCode').html("<b>" + indicator + "</b>");
	return indicator;
}

function GenOutlet() {
	var countries = ['usa','uk','ger','ind','aus','isr'][specificRand(0,5)];
	$('.outlet').attr('id', countries);
	return countries
}

var serial = GenSerial(),
edition = GenEdition(),
indicator = GenIndicator(),
outlet = GenOutlet();
console.log(serial, edition, indicator, outlet);

//-------------------------------------------------------
//	MODULES
//-------------------------------------------------------

var launchpadSetup = function(serial, modNumber) {

	this.place = function(modNumber) {
		var modcode = $("#mod" + modNumber);

		modcode.prepend('<div class="launchpad"></div>');
		for (var i = 0; i<16; i++) {
			$("#mod" + modNumber).find('.launchpad').append("<button class='col-xs-3 lbutton' id='lbutton" + String(i) + "'></button>");
		}

		return this.init(modcode, modNumber);
	}

	this.init = function(modcode, modNumber) {
		var launchpadConfig = specificRand(0,14),
		classes = "",
		position = "#lbutton";

		switch (launchpadConfig) {
			case 0: case 1: case 8: case 9: classes += "R "; break;
			case 2: case 3: case 10: case 11: classes += "B "; break;
			case 4: case 5: case 12: case 13: classes += "Y "; break;
			case 6: case 7: case 14: case 15: classes += "G "; break;
		}
		launchpadConfig % 2 === 0 ? classes += "blink" : classes += "noblink";
		launchpadConfig <= 7 ? position += "0" : position += "15";

		modcode.find(position).addClass(classes);

		return launchpadFormations[launchpadConfig];
	}

}

var panicSetup = function(serial, modNumber) {

	this.place = function(modNumber) {
		var modcode = $("#mod" + modNumber);
		modcode.addClass('panicOff');
		modcode.prepend('<div class="panic"></div>');
		modcode.find('.panic').prepend('<div class="panicModule"></div><div class="panicTimerBox"><div class="panicTimer"></div></div><div class="panicBar"></div><button class=buttontimer></button><div class="commandBox"><div class="commandText"></div></div><div class="panicslider"></div><input class="val" readonly></input>');
		$(function() {
		    modcode.find( ".panicslider" ).slider({
		      range: "max",
		      min: 0,
		      max: 9,
		      value: 5,
		      slide: function( event, ui ) {
		        modcode.find( ".val" ).val( ui.value );
		      }
		    });
		    modcode.find( ".val" ).val( $( ".panicslider" ).slider( "value" ) );
		});
		this.initTimer(modcode);
	}

	this.initTimer = function(modcode) {
		var frq = specificRand(300,600),
		panicTimer = 300,
		newbar = 65;
		modcode.find('.panicTimer').html('__');
		modcode.find('.commandText').html('<br>--------');
		this.runTimer(modcode, modNumber, frq, panicTimer, newbar);
	}

	this.runTimer = function(modcode, modNumber, frq, panicTimer, newbar) {
		var self = this;
		self.runningTimer = panicTimer;
		self.runningFrq = frq;

		var frqcounter = setInterval(function() {

			self.runningFrq = self.runningFrq-1;

			if (self.runningFrq === 0) {

				modcode.addClass('on');
				self.placeCommand(modcode);

				self.counter = setInterval(function() {
					
					sec = parseInt(self.runningTimer/10%60);
					newbar = newbar-0.2166666667;

					modcode.find('.panicTimer').html(sec);
					modcode.find('.panicBar').css('width', newbar+'%');
					self.runningTimer = self.runningTimer - 1;
					//console.log(runningTimer)

					if (self.runningTimer === 0) {
						strikes === 2 ? ($('.panicTimer').html('__'), $('.commandText').html('<br>--------'), kablooey() ) :
						( strikes++, $('.strikes').html("STRIKES: " + strikes), $(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), console.log("NOPE! STRIKES: ", strikes) )
						resetTimer();
					}

				}, 100);
			}
		}, 100);

		var resetTimer = function() {
			console.log("resetting", "OLD FRQ COUNT: ", self.runningFrq)

			modcode.find('.panicBar').css('width', "65%");
			modcode.find('.panicTimer').html('__');
			modcode.find('.commandText').html('<br>--------').removeAttr('style');
			modcode.removeClass('on');

			clearInterval(self.counter);

			self.runningTimer = 300;
			newbar = 65;
			self.runningFrq = specificRand(300,600);
			console.log("NEW FRQ COUNT: ", self.runningFrq)
		}

		modcode.find('.buttontimer').on("click", function(e) {
			e.preventDefault();
			resetTimer();
			var sliderVal = modcode.find('.ui-slider').slider('option', 'value')
			sliderVal === answers[modNumber] ? ( console.log("Phew."), modcode.find(".panicModule").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100) ) : (strikes++, $('.strikes').html("STRIKES: " + strikes), $(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? ($('.panicTimer').html('__'), $('.commandText').html('<br>--------'), kablooey() ) : console.log("NOPE! STRIKES: ", strikes)) )
		});
	}

	this.placeCommand = function(modcode) {
		var randPrefixGroup = specificRand(0,6),
		randPrefix,
		randSuffix = specificRand(0,36),
		randStatus = specificRand(0,36),
		commandText = [],
		commandTextElement,
		commandTextElementDefaultH;

		randPrefixGroup === 0 || randPrefixGroup === 1 ? randPrefix = specificRand(0,5) : randPrefix = specificRand(0,4);

		commandText.push(panicWords.commandPrefix[randPrefixGroup][randPrefix] + " ", panicWords.commandSuffix[randSuffix] + " ", panicWords.commandStatus[randStatus]);
		commandText[0].indexOf("-") > -1 ? commandText[0] = commandText[0].slice(0, -2) : commandText;
		commandText = commandText.join('');

		commandTextElement = modcode.find('.commandText');

		commandTextElement.text(commandText);
		commandTextElementDefaultH = modcode.find('.commandBox').height();
		
		if (commandTextElement[0].scrollHeight > commandTextElementDefaultH) {
			var fontSize = 2.15;
			while (commandTextElement[0].scrollHeight > 55) {
				fontSize -= 0.1;
				commandTextElement.css('font-size', fontSize+"vw");
			}
		}

		this.createAns(modcode, randPrefixGroup, randSuffix);
		return commandText;
	}

	this.createAns = function(modcode, group, suffix) {
		var guide = suffix;
		
		switch (group) {

			case 0: guide = guide%10; break;
			case 1: guide > 31 ? guide = (guide-32)%10 : guide = (guide+5)%10; break;
			case 2: guide > 26 ? guide = (guide-27)%10 : guide = guide%10; break;
			case 3: guide > 21 ? guide = (guide-22)%10 : guide = (guide+5)%10; break;
			case 4: guide > 16 ? guide = (guide-17)%10 : guide = guide%10; break;
			case 5: guide > 11 ? guide = (guide-12)%10 : guide = (guide+5)%10; break;
			case 6: guide > 6 ? guide = (guide-7)%10 : guide = guide%10; break;

		}

		console.log("ANSWER: ", guide, "GROUP: ", group, "SUFFIX: ", panicWords.commandSuffix[suffix]);
		answers[modNumber] = guide;
		console.log("TEMP ANSWERS: ", answers)
		return guide;
		
	}

};

var simpleWireSetup = function(serial, modNumber) {

	this.place = function(modNumber) {
		var modcode = $("#mod" + modNumber);
		modcode.prepend('<div class="wires"></div>');
		modcode.find('.wires').prepend('<div class="simpleWireWrap"></div>')
		modcode.find('.simpleWireWrap').append('<div class="indivWireContS"></div>');

		var simpleWireCount = specificRand(3,6)
		wireColors = ['black', '#095AD9', '#34681D', '#8F0202', 'white'],
		wireArrays = [];
		for (var i = 0; i < simpleWireCount; i++) { //CHANGE HERE FOR TESTING
			var colorMapCode = specificRand(0,4),
			colorMap = wireColors[colorMapCode]
			wireArrays.push(colorMapCode);
			modcode.find('.indivWireContS').append('<button class="indivWiresS" id = "wire' + i + '"></button>');
			modcode.find('#wire' + i).css("background-color",colorMap);
		}
		console.log("GIVEN: ", wireArrays);
		return wireArrays
	}

	this.initSimpleWires = function(serial, modNumber) {
		var wireArrays = this.place(modNumber),
		numWires = wireArrays.length,
		guide = 0;

		switch (numWires) {
			case 3:

				if (wireArrays[0] === wireArrays[1]) { guide = 2; break;}
				else if (countTarget(wireArrays, 1) === 1) { guide = 0; break;}
				else if (wireArrays[0] === wireArrays[2] && wireArrays[1] !== wireArrays[2]) {serial[0].match(/[0-9]/g) ? guide = 1 : guide = 0; break;}
				else if (countTarget(wireArrays, 3) === 2 || countTarget(wireArrays, 4) === 2 ) {serial[0].match(/[0-9]/g) ? guide = 0 : guide = 1; break;}
				else {guide = 2; break;}

			break;

			case 4:

				if (arrSame(wireArrays)) { guide = 2; break; }
				else if (wireArrays[3] === 3) { guide = 0; break; }
				else if (countTarget(wireArrays, 4) !== 0 && countTarget(wireArrays, 1) > countTarget(wireArrays, 4) ) { guide = 3; break; }
				else if (countTarget(wireArrays, 1) === 2 || countTarget(wireArrays, 3) === 2 || countTarget(wireArrays, 4) === 2) {
					countTarget(wireArrays, 2) === 1 ? guide = wireArrays.indexOf(2) : guide = 2;
					break;
				}
				else {guide = 1; break;}

			break;

			case 5:

				if (wireArrays[0] === wireArrays[2] && wireArrays[2] === wireArrays[4]) { guide = 1; break; }
				else if (multiLimits(wireArrays, 2, 1)) { wireArrays.indexOf(0) === -1 ? guide = 4 : guide = 0; break; }
				else if (countTarget(wireArrays, 4) === 1 && countTarget(wireArrays, 2) > 1) { guide = 1; break; }
				else if (wireArrays.indexOf(3) === -1) { serial[0].match(/[0-9]/g) ? guide = 3 : guide = 2; break; }
				else {guide = 0; break;}

			break;

			case 6:

				if (countTarget(wireArrays, 2) > 2) { guide = 4; break; }
				else if (wireArrays.indexOf(0) === -1 && wireArrays.indexOf(2) === -1) { outlet === 'usa' ? guide = 0 : guide = 5; break; }
				else if (arrConsecutive(wireArrays) >= 3) { indicator[0] === indicator[1] && indicator[1] === indicator[2] ? guide = 3 : guide = 2; break; }
				else if (countTarget(wireArrays, 4) === 1 || countTarget(wireArrays, 0) === 1) { guide = 2; break;}
				else {guide = 0; break;}

			break;

		}
		return guide;
	}
};

var wireSetup = function(serial, modNumber) {
	
	this.rando = function() {
		var randomLayout = []
		for (var i = 0; i < 6; i++) {
			var layout = [specificRand(0,1), specificRand(0,1), specificRand(0,2)]
			randomLayout.push(layout);
		}
		return randomLayout;
	},

	this.randoColor = function() {
		var temp = ['#6aa84f', 'orange', 'white', 'yellow', 'purple', 'teal'];
		return temp[specificRand(0,temp.length-1)];
	},

	this.place = function(wireArrays, modNumber) {
		var modcode = $("#mod" + modNumber);
		modcode.prepend('<div class="wires"></div>');
		modcode.find('.wires').prepend('<div class="wireWrap"></div>')
		modcode.find('.wireWrap').prepend('<button class="confirm wireDocks"></button><div class="wireDocks dock0"></div><div class="delta wireDocks"></div><div class="wireDocks dock1"></div><div class="led wireDocks"></div>');
		modcode.find('.wireWrap').append('<div class="indivWireCont"></div>');
		for (var i = 0; i < 6; i++) {
			modcode.find('.indivWireCont').append('<button class="indivWires" id = "wire' + i + '"></button><div class="wireSpacing"></div>');


			modcode.find('#wire' + i).append('<div class="deltaOnOff">∆</div>').addClass( wireArrays[i][0] === 0 ? "deltaOff" : "deltaOn" );
			modcode.find('#wire' + i).append('<div class="ledOnOff"></div>').addClass( wireArrays[i][1] === 0 ? "ledOff" : "ledOn" );
			modcode.find('#wire' + i).css("background-color", wireArrays[i][2] === 0 ? this.randoColor() : (wireArrays[i][2] === 1 ? "#8F0202" : "black") );

		}
		return wireArrays
	},

	this.initWires = function(serial, modNumber) {
		console.time("Time to init wires");
		var wireArrays = this.place(this.rando(), modNumber),
		guide = [],
		ind = indicator,
		i;
		for (i = 0, x = wireArrays.length; i < x; i++) {
			switch(wireArrays[i][2]) {
				case 2:
					guide.push( wireArrays[i][0] === 0 ? (wireArrays[i][1] === 0 ? (serial[7].match(/[^AEIOU24680]/g) ? "Y" : "N" ) : (serial[7].match(/[^AEIOU24680]/g) ? "Y" : "N" )) : (wireArrays[i][1] === 0 ?  "N" : (serial[7].match(/[^AEIOU24680]/g) ? "Y" : "N" )));
					break;
				case 1:
					guide.push( wireArrays[i][0] === 0 ? (wireArrays[i][1] === 0 ? (serial[7].match(/[^AEIOU24680]/g) ? "Y" : "N" ) : (serial[7].match(/[^AEIOU24680]/g) ? "Y" : "Y" )) : (wireArrays[i][1] === 0 ?  "Y" : (serial[7].match(/[^AEIOU24680]/g) ? "Y" : "N" )));
					break;
				default:
					guide.push( wireArrays[i][0] === 0 ? (wireArrays[i][1] === 0 ? "Y" : "N") : (wireArrays[i][1] === 0 ?  "Y" : "N") );
			}
		}
		console.timeEnd("Time to init wires");
		console.log((outlet.match(/(usa)|(uk)|(ger)/g)) ? "NORMAL" : "REVERSE");
		return (outlet.match(/(usa)|(uk)|(ger)/g)) ? guide : guide.join('').replace(/[YN]/g, function(i) {return i == "Y" ? "N" : "Y"} ).split('');
	}

	this.run = function(serial, modNumber) {
		var a = "ans"+modNumber;
		a = this.initWires(serial, modNumber);
		return a;
	}


}

var modKeypad = function(modNumber) {
	
	this.a = [],
	this.afull = [],
	this.aans = [],

	this.initKeypad = function() {
		var orderlength = keypadColumns.orders.length-1,
		bank;
		this.afull = keypadColumns.orders[specificRand(0,orderlength)];
		bank = this.afull.slice(0),
		onBomb = [];
		for (var i = 0; i < 4; i++) {
			var s = specificRand(0,bank.length-1);
			onBomb.push(bank[s]);
			bank.splice(s,1);
		}
		this.a = onBomb;
		//console.log("GENERATED: ", this.afull, bank, this.a);
	},

	this.place = function(modNumber) {
		$("#mod" + modNumber).prepend('<div class="keypad"></div>');
		for (var i = 0; i<4; i++) {
			$("#mod" + modNumber).find('.keypad').append("<button class='kbutton' id='button" + String(i) + "'>" + String(this.a[i]) + "</button>");
		}
	},

	this.createAns = function() {
		for (var i = 0; i < 4; i++) {
			this.aans.push( this.afull.indexOf(this.a[i]) );
		}
		this.aans = this.aans.sort();
		for (var j = 0; j < 4; j++) {
			this.aans[j] = this.afull[this.aans[j]];
		}
	},

	this.run = function(modNumber) {
		this.initKeypad();
		this.place(modNumber);
		this.createAns();
		var a = "ans"+modNumber;
		a = this.aans;
		return a;
	};

};

//-------------------------------------------------------
//	PLACE MODULES
//-------------------------------------------------------

var spaces = ['m0','m1','m2','m3'],
serialtxt = serial,
answers = ['ans0','ans1','ans2','ans3'],
optHolder = {hold0: [], hold1: [], hold2: [], hold3: []};
(function initAll() {
	var i, chosenmod;
	for (i = 0; i < 4; i++) {

		answers.indexOf('panicWaiting') === -1 ? (chosenmod = specificRand(0,4), console.log('panic not placed yet')) : (chosenmod = specificRand(0,3), console.log('already here'));

		switch (chosenmod) {
			case 0:
				spaces[i] = new modKeypad(i);
				answers[i] = spaces[i].run(i);
				console.log(spaces[i], answers[i]);
				break;
			case 1:
				spaces[i] = new wireSetup(serialtxt, i);
				answers[i] = spaces[i].run(serialtxt, i);
				console.log(spaces[i], answers[i]);
				break;
			case 2:
				spaces[i] = new simpleWireSetup(serialtxt, i);
				answers[i] = spaces[i].initSimpleWires(serialtxt, i);
				console.log(spaces[i], answers[i]);
				break;
			case 3:
				spaces[i] = new launchpadSetup(i);
				answers[i] = spaces[i].place(i);
				console.log(i, spaces[i], answers[i]);
				break;
			case 4:
				spaces[i] = new panicSetup(serialtxt, i);
				spaces[i].place(i);
				answers[i] = "panicWaiting"
				console.log(spaces[i], "WAITING");
				break;
			default:
				break;
		}
	};
	console.log("CURRENT MODULES: ", spaces, "ANSWERS: ", answers, "HOLDER: ", optHolder);
}());
	


//-------------------------------------------------------
//	EVENTS
//-------------------------------------------------------

// SIMPLE WIRES

$('.indivWiresS').on("click", function(e) {
	e.preventDefault();
	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = Number(answers[clickedMod]),
	x = Number($(this).attr('id')[4]);
	x === guide ? ($(this).addClass('cutS'), $(this).closest('.mod').css('background-color', 'green'), console.log("SUCCESS!")) : (strikes++, $('.strikes').html("STRIKES: " + strikes), $(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? kablooey() : console.log("NOPE! STRIKES: ", strikes)));
});

// COMPLEX WIRES

$('.indivWires').on("click", function(e) {
	e.preventDefault();
	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod],
	x = $(this).attr('id'),
	outcome = guide[x[x.length-1]],
	guidecheck = guide.indexOf("Y"),
	postcheck;
	console.log(guidecheck, guide);
	if (guidecheck > -1) {
		outcome === 'N' ? (strikes++, $('.strikes').html("STRIKES: " + strikes), $(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? kablooey() : console.log("NOPE! STRIKES: ", strikes)) )
		: ($(this).addClass('cut'), guide[x[x.length-1]] = "-"), console.log(guide);
		postcheck = guide.indexOf("Y");
		postcheck === -1 ? ($(this).closest('.mod').css('background-color', 'green'), console.log("SUCCESS!"), $(this).off(), $(this).closest('.wireWrap').find('.confirm').off()) : false;
	}
	else {
		$(this).closest('.mod').css('background-color', 'green');
		console.log("SUCCESS!");
	}
});
$('.confirm').on("click", function(e) {
	e.preventDefault();
	var guide = answers[($(this).closest('.mod').attr('id')[3])];
	guide.indexOf('Y') === -1 ? ($(this).closest('.mod').css('background-color', 'green'), console.log("SUCCESS!")) : (strikes++,$('.strikes').html("STRIKES: " + strikes), $(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? kablooey() : console.log("NOPE! STRIKES: ", strikes)));
})

// KEYPAD

$('.kbutton').on("click", function(e) {
	e.preventDefault();
	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod],
	bclicked = optHolder["hold" + clickedMod];
	if (bclicked.length < 3) {
		bclicked.push($(this).text());
		console.log(bclicked);
		if (bclicked[bclicked.length-1] != guide[bclicked.length-1]) {
			strikes++;
			$('.strikes').html("STRIKES: " + strikes);
			strikes === 3 ? kablooey() : ( $(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), console.log("NOPE!", "strikes", strikes, bclicked),
			bclicked.splice(-1,1),
			console.log('---->',bclicked));
		}
		else {
			console.log("YEAH!", "strikes", strikes, bclicked);
			$(this).addClass('correctKeypad');
		}
	}
	else if (bclicked.length === 3) {
		bclicked.push($(this).text());
		if (bclicked[bclicked.length-1] != guide[bclicked.length-1]) {
			console.log("SERIOUSLY!?!");
			strikes++;
			$('.strikes').html("STRIKES: " + strikes);
			$(".strikebuzzer").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
			bclicked.splice(-1,1);
			return false
		}
		else {
			console.log("SUCCESS!");
			$(this).addClass('correctKeypad');
			$(this).parent('.keypad').parent('.mod').css('background-color','green');
			$(this).off("click");
		}
	}
});

//LAUNCHPAD

$('.launchpad').on("click", ".blink, .noblink", function(e) {
	e.preventDefault();
	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod];

	optHolder["hold" + clickedMod] = ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"];

	var lpClicked = optHolder["hold" + clickedMod];

	$(this).removeClass('R G B Y blink noblink lbutton').addClass("lbuttonOn W");
	$(this).siblings().removeClass('lbutton').addClass('lbuttonOn W');

});
$(".launchpad").on("click", ".lbuttonOn", function(e) {
	e.preventDefault();
	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod].join(''),
	clickedPadID = ($(this).attr("id").slice(7)),
	currentConfig = optHolder["hold" + clickedMod];
	
	if ($(this).hasClass("W")) {$(this).removeClass('W').addClass('R'); currentConfig[clickedPadID] = 'R';}
	else if ($(this).hasClass("R")) {$(this).removeClass('R').addClass('B'); currentConfig[clickedPadID] = 'B';}
	else if ($(this).hasClass("B")) {$(this).removeClass('B').addClass('G'); currentConfig[clickedPadID] = 'G';}
	else if ($(this).hasClass("G")) {$(this).removeClass('G').addClass('Y'); currentConfig[clickedPadID] = 'Y';}
	else if ($(this).hasClass("Y")) {$(this).removeClass('Y').addClass('W'); currentConfig[clickedPadID] = 'W';}

	console.log("CUR: ", currentConfig.join(''), "\nANS: ", guide, currentConfig === guide);

	if (currentConfig.join('') === guide) {
		console.log("SUCCESS!");
		$(this).closest('.mod').css('background-color','green');
		$(this).off("click");
	}

});

	console.timeEnd("All of it");



});

//-------------------------------------------------------
//	OUTCOMES
//-------------------------------------------------------

function kablooey() {
	console.log("BOOM!!!!"); 
	$(".mod").removeClass('on').removeClass('panicOff');
	$("a").off();
	$("button, .launchpad").off();
	$(".commandText").addClass("blinker").html('<br>--------');
	$(".panicTimer").addClass("blinker").html('__');
	for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    $('.lbutton, .lbuttonOn').removeClass('W B Y G blink noblink').addClass('R');
	
	$('#menuText, #countdown').text('');
	$('#menu').css('display','initial').addClass('flash');
	
	var explodeint = 0;
	var explode = setInterval(function() {
		switch(explodeint) {
			case 0: $('#menu').removeClass('flash'); $('#explode').css('display', 'block'); $('#inner').css('opacity', 1); break;
			case 1: $('#mid').css('opacity', 1); break;
			case 2: $('#outer').css('opacity', 1); break;
			case 3:	
				$('#menu').addClass('failure');
				$('#menuheader').attr('src', './images/failuretext.png');
				$('#explode').css('display', 'none');
				$('#menuText').html('<h1>Try again?</h1>');
				$('#startGame').text("Restart").removeClass('invis startmenu').addClass('gameover');
				break;
			case 4: clearInterval(explode); break;
		}
		explodeint++
	},800);
}

$('#menu').on("click", ".gameover", function() {
	location.reload();
})