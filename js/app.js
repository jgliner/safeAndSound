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
var correct = 0;
var screenwidth = $(window).width();
var screenheight = $(window).height();

// Simply use "playAudio" with the file as a parameter
function playAudio(wav) {
	if (!(/iPhone|iPad|iPod|Android|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent))) {
		var sound = new Audio(wav);
		return sound.play();
	}
}

//-------------------------------------------------------
//	OUTCOMES
//-------------------------------------------------------

// Clears all intervals, stops the panic module, 
function everythingOff() {
	$('.mod').find('.modled').removeClass('panicOff');
	$('a').off();
	$('button, .launchpad').off();
	$('.commandText').html('<br>--------');
	$('.panicTimer').html('__');
	for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    $('#menuText, #countdown').text('');
}

function winner() {
	console.log('A WINRAR IS YOU');
	everythingOff();
	$('.commandText, .panicTimer, .val').css('color', 'green');
	$('.panicBar').css({'background-color': 'green', 'border': '3px solid #03A603'});
	$('.lbutton, .lbuttonOn').removeClass('W B Y G blink noblink').addClass('G');

	var opensafeint = 0;
	var opensafe = setInterval(function() {
		switch(opensafeint) {
			case 0: playAudio('./soundfx/accessGranted.wav'); $('#mainTimer').text('AUTHORIZED').addClass('defusedTimer'); break;
			case 1: $('.bomb').addClass('dooropen'); playAudio('./soundfx/hit.wav'); $('.mod').addClass('moddooropen'); $('#safeimg').attr('src', './images/safeopen.png'); break;
			case 3:	
				playAudio('./soundfx/victory.wav');
				$('#menu').addClass('success').css('display','initial');
				$('#menuheader').attr('src', './images/successtext.png');
				$('#menuText').addClass('successMenu').html('<h1>Excellent work.</h1><h1>You outsmarted the Commando 8.</h1><br></div>').after('<div class="successMenu2"><h1>You could even say.....</h1><h1>You blew us all away.</h1></div>');
				$('#startGame').text('Go Again').removeClass('invis startmenu').addClass('gameoverwin');
				break;
			case 4: clearInterval(opensafe); break;
		}
		opensafeint++;
	},800);

}

function kablooey() {
	console.log('BOOM!!!!');
	everythingOff();
	$('.commandText, .panicTimer').addClass('blinker');
    $('.lbutton, .lbuttonOn').removeClass('W B Y G blink noblink').addClass('R');
	
	$('#menu').css('display','initial').addClass('flash');
	
	var explodeint = 0;
	var explode = setInterval(function() {
		switch(explodeint) {
			case 0: $('#menu').removeClass('flash'); $('#explode').css('display', 'block'); $('#inner').css('opacity', 1); playAudio('./soundfx/hit.wav'); break;
			case 1: $('#mid').css('opacity', 1); playAudio('./soundfx/hit.wav'); break;
			case 2: $('#outer').css('opacity', 1); playAudio('./soundfx/hit.wav'); break;
			case 3:	
				playAudio('./soundfx/failure.wav');
				$('#menu').addClass('failure');
				$('#menuheader').attr('src', './images/failuretext.png');
				$('#explode').css('display', 'none');
				$('#menuText').html('<h1>Try again?</h1>');
				$('#startGame').text('Restart').removeClass('invis startmenu').addClass('gameover');
				break;
			case 4: clearInterval(explode); break;
		}
		explodeint++;
	},800);
}

// Reloads the page on a game over screen
$('#menu').on('click', '.gameover, .gameoverwin', function() {
	location.reload();
});

//For debugging. Pressing "R" will automatically open the safe
$(window).on('keydown', function(e) {
	if(e.which===82) {
		winner();
	}
});

//-------------------------------------------------------
//	GAME START
//-------------------------------------------------------

playAudio('./soundfx/type.wav');

// Set timer to three minutes, change the "time" variable to give the player more/less time
function gameTimerOn() {
	var time = 18000,
	sec, mins;

	var counter = setInterval(function() {
		sec = parseInt(time/100%60);
		mins = parseInt(time/100/60);

		sec < 10 ? sec = String('0'+sec) : sec;

		$('#mainTimer').html(mins + ':' + sec );
		time = time - 1;

		// If the timer runs out, start explosion animation (function found on the bottom of the app)
		if (time <= 0 || strikes === 3) {
			$('#mainTimer').html('- -- --');
			clearInterval(counter);
			kablooey();
		}

	}, 10);

}

// Start timer, hide menu, and place modules
$('.startmenu').click(function() {
	// Hide menu
	$('.startmenu').addClass('invis');
	$('#countdown').removeClass('invis');

	// Begin countdown
	var tminus = 3;
	$('#countdown').append('Mission Begins in '+tminus+'... ');
	playAudio('./soundfx/blip.wav');

	// Start countdown interval
	var gamestart = setInterval(function() {
		tminus--;
		$('#countdown').append(''+tminus+'... ');
		if (tminus > 0) {
			playAudio('./soundfx/blip.wav');
		}
		// Once countdown reaches 0:
		else {
			$('#menu').fadeOut(function() {
				$(this).removeClass('start');
				$('#menuheader').attr('src', '');
			});
			clearInterval(gamestart);
			playAudio('./soundfx/blipdone.wav');
			// Game timer starts here
			gameTimerOn();
		}
	}, 1000);
	// Function continues until "EVENTS" section, countdown gives app sufficient time to load (used in leiu of loading bar)
	console.time('All of it');

//-------------------------------------------------------
//	BANKS AND LISTS
//-------------------------------------------------------

// Possibilities for the symbol keypads (these are programmed in ASCII characters, but later changed to symbols with custom glyph font)
var keypadColumns = [
	['a','b','c','d','e','f','g','h','i','j'],
	['q','s','z','t','1','a','r','p','0','7'],
	['z','3','m','5','l','p','q','n','4','x'],
	['1','2','6','e','h','k','n','u','v','y'],
	['8','9','c','i','k','m','t','w','x','y'],
	['0','2','4','6','d','f','j','r','s','w']
];

var panicWords = {
	commandPrefix: [['Alpha','Eligible','Hypo-','Master','Secret','Super-'],['Bravo','Flub-','i-','Mechanical','Secu-','Uber-'],['Crypto-','Garbage','Illegible','Oopsie','Spy'],['Delta','Geopolitical','Invisible','Peta-','Yoooo'],['Draxon','Glaxon','Java-','Quark','Umm'],['Electric','Hydro-','Left Hand','Right Hand','Uh Oh,'],['Electro-','Hyper-','Locking','Schwifty','Uhh']],
	commandSuffix: ['Agent','Bearfold','Bit','Bite','Bot','Bro','Bypass','Byte','Crystal','Dispersal Unit','Dryer','Enigma','Freud','Goose','Groose','Hacker','Jabroni','Key','Link','Man','Matic','Mixer','Pannel','Port','Reactor','Servo','Slide','Slot','Solwafter','Sponge','Thing','Touchdown','Tray','Trigger','Tumbler','Unit','Zorp'],
	commandStatus: ['Failing','Error','Access',': Permission Denied','Messed Up','On the Fritz','Loose','Not Working','at Critical Mass','Needs Tinkering','Check','Compromised','Breakdown','Drained','Needs Greasing','Unsafe','Released','Overheating','is Not Feeling Well','Stopped','Malfunction','Falling','Slacking','Deflated','Needs Rebooting','Unauthorized','Incorrect','Evacuated','Defective','Reset','Combination','Code','FUBARed','Override','Locked','No, Wait...','Mixed Up']
};

var launchpadFormations = [['R','W','W','B','W','R','B','W','W','B','R','W','B','W','W','R'],['B','Y','Y','B','W','R','Y','W','Y','Y','Y','Y','Y','Y','Y','W'],['B','B','B','W','W','B','B','B','W','B','Y','B','R','W','R','W'],['G','R','W','W','W','G','B','W','G','G','G','G','W','R','R','G'],['R','W','W','R','W','Y','Y','W','W','R','R','W','W','W','W','W'],['W','R','B','R','W','W','R','W','W','W','B','W','R','B','R','W'],['W','W','W','W','G','Y','G','W','Y','R','Y','W','G','Y','G','W'],['B','W','W','B','W','W','W','W','R','R','R','R','B','R','R','B'],['W','W','G','W','Y','W','W','Y','W','W','G','W','W','G','W','Y'],['W','W','Y','Y','R','Y','Y','B','W','Y','B','W','W','W','Y','W'],['W','Y','Y','W','R','Y','Y','R','W','G','G','W','Y','W','W','Y'],['R','R','G','G','R','G','R','G','R','G','G','G','R','R','R','G'],['R','W','W','R','W','G','G','G','W','G','Y','G','R','G','G','G'],['G','R','R','R','G','B','B','R','G','B','B','Y','G','Y','Y','Y'],['B','B','R','R','B','B','W','W','R','R','R','R','W','W','W','W']]; 

//-------------------------------------------------------
//	GLOBAL FUNCTIONS
//-------------------------------------------------------

// specificRand is used throughout the app and generates a random number between min and max (inclusive)
var specificRand = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Used for the "Simple Wires" module:
// Counts the number of target values in an array
var countTarget = function(arr, targetval) {
	var count = arr.reduce(function(n, item) {
		return item === targetval ? n+1 : n;
	}, 0);
	return count;
};

// Used for the "Simple Wires" module:
// Checks if a single value in an array exceeds a given limit
var countLimits = function(arr, limit) {
	var count = arr.reduce(function(n, item) {
		n[item] === undefined ? n[item] = 1 : n[item] += 1;
		return n[item] > limit ? false : n;
	}, {});
	return count;
};

// Used for the "Simple Wires" module:
// Checks how many values in the array have met the limit, and returns true if the result is below the allowed limit
// Use Case: checks if there are no more than one occurrance (allowedLimit) of two of wires that are the same color
var multiLimits = function(arr, limit, allowedLimit) {
	var obj = countLimits(arr, limit),
	reachedLimit = 0;
	if (Object.keys(obj).length > 1) {
		for (var key in obj) {
			if (obj[key] === limit) {
			reachedLimit+= 1;
			}
		}
		return reachedLimit > allowedLimit ? false: true;
	}
	return false;
};

// Used for the "Simple Wires" module:
// Checks if all values in an array are the same
var arrSame = function(arr) {
	return arr.reduce(function(n, item) {
		return n === item ? n : false;
	});
};

// Used for the "Simple Wires" module:
// Returns the count for the longest streak of consecutive values (e.g. [1,1,1,1,2,2,1] --> 4)
var arrConsecutive = function(arr) {
	var len = arr.length,
	consec = 1,
	temp = 1;
	for (var i = 0; i < len-1; i++) {
		if (arr[i] === arr[i+1]) {
			temp += 1;
		}
		else {
			if (temp > consec) {
				consec = temp;
			temp = 1;
			}
		}
	}
	return consec > temp ? consec : temp;
};

//-------------------------------------------------------
//	UNIQUE MODULE GENERATOR
//-------------------------------------------------------

// The functions in this section generate global variables for the Serial Number, Three-Letter Indicator, and Outlet Type
// Reminder, these functions execute when the "Start Game" button is pressed on the main menu

function GenSerial() {
	var serial = '',
	bank = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for (var i = 0; i < 8; i++) {
		serial+=bank.charAt(Math.floor(Math.random() * bank.length));
	}
	$('#serial').html('SN: <b>' + serial + '</b>');
	return serial;
}

function GenIndicator() {
	var indicator = '',
	bank = 'EPZOBENMDTC';
	for (var i = 0; i < 3; i++) {
		indicator+=bank.charAt(Math.floor(Math.random() * bank.length));
	}
	$('#indicatorCode').html('<b>' + indicator + '</b>');
	return indicator;
}

function GenOutlet() {
	var countries = ['usa','uk','ger','ind','aus','isr'][specificRand(0,5)];
	$('.outlet').attr('id', countries);
	return countries;
}

var serial = GenSerial(),
indicator = GenIndicator(),
outlet = GenOutlet();

console.log(serial, indicator, outlet);

//-------------------------------------------------------
//	MODULES
//-------------------------------------------------------

// This section just sets up module behavior and correct configurations (i.e., answers).
// Later in the app is a section for click events that handle user input.

// Each type of module includes similar dynamic local variables:
// modNumber: Modules are placed one-by-one in the "PLACE MODULES" section of the app via for loop.
//			  On placement, the iterator "i" is passed in as a parameter, which we use for the location of a given module.
// modcode: Corresponds to an ID on the DOM, uses the modNumber to determine correct value.

// Each module has a "place" and "init"
// "place" interacts directly with the DOM and sets up the skeleton for the module
// "init" sets up the functionality and dynamic components

/*____LAUNCHPAD____*/

var Launchpad = function() {

	// Places 16 squares and IDs each one 
	this.place = function(modNumber) {
		var modcode = $('#mod' + modNumber);

		modcode.prepend('<div class="launchpad"></div>');
		for (var i = 0; i<16; i++) {
			$('#mod' + modNumber).find('.launchpad').append('<button class="col-xs-3 lbutton" id="lbutton' + String(i) + '"></button>');
		}

		// The 'init' function below generates the correct configuration and is returned into the 'ans' array in the 'PLACE MODULES' section of the app
		return this.init(modcode);
	},

	this.init = function(modcode) {
		var launchpadConfig = specificRand(0,14), // From 'BANKS AND LISTS' section
		classes = '',
		position = '#lbutton';

		// Defines the launchpad's signal, which the player refrences in the manual
		switch (launchpadConfig) {
			case 0: case 1: case 8: case 9: classes += 'R '; break;
			case 2: case 3: case 10: case 11: classes += 'B '; break;
			case 4: case 5: case 12: case 13: classes += 'Y '; break;
			case 6: case 7: case 14: case 15: classes += 'G '; break;
		}
		launchpadConfig % 2 === 0 ? classes += 'blink' : classes += 'noblink';
		launchpadConfig <= 7 ? position += '0' : position += '15';

		modcode.find(position).addClass(classes);

		// Used by the 'placed'
		return launchpadFormations[launchpadConfig];
	};

};

/*____PANIC____*/

var Panic = function(serial, modNumber) {

	this.place = function(modNumber) {
		var modcode = $('#mod' + modNumber);
		modcode.find('.modled').addClass('panicOff');
		modcode.prepend('<div class="panic"></div>');
		modcode.find('.panic').prepend('<div class="panicModule"><div class="panicTimerBox"><div class="panicTimer"></div></div><div class="panicBar"></div><button class=buttontimer></button><div class="commandBox"><div class="commandText"></div></div><div class="panicslider"></div><input class="val" readonly></input></div>');
		$(function() {
		    modcode.find( '.panicslider' ).slider({
		      range: 'max',
		      min: 0,
		      max: 9,
		      value: 5,
		      slide: function( event, ui ) {
		        modcode.find( '.val' ).val( ui.value );
		      }
		    });
		    modcode.find( '.val' ).val( $( '.panicslider' ).slider( 'value' ) );
		});
		this.initTimer(modcode);
	},

	this.initTimer = function(modcode) {
		var frq = specificRand(300,600), // time until module activates (a random number between 30 and 60 seconds)
		panicTimer = 300, // how long the player has to input the correct answer
		newbar = 61; // length of the timer bar
		correct++; // awards one point while the module is inactive

		modcode.find('.panicTimer').html('__');
		modcode.find('.commandText').html('<br>--------');
		this.runTimer(modcode, modNumber, frq, panicTimer, newbar);
	},

	this.runTimer = function(modcode, modNumber, frq, panicTimer, newbar) {
		// Scope to function (to be used on function equations below)
		var self = this;
		self.runningTimer = panicTimer;
		self.runningFrq = frq;

		// Start interval timer
		var frqcounter = setInterval(function() {

			self.runningFrq = self.runningFrq-1;

			// Once interval timer hits zero, activate the module
			if (self.runningFrq === 0) {

				var sec;
				modcode.find('.modled').toggleClass('on panicOff');
				correct--; // Take away point while module is active
				console.log(correct);
				self.placeCommand(modcode);
				playAudio('./soundfx/type.wav');

				self.counter = setInterval(function() {
					
					sec = parseInt(self.runningTimer/10%60);
					newbar = newbar-0.19677419355;

					modcode.find('.panicTimer').html(sec);
					modcode.find('.panicBar').css('width', newbar+'%');
					self.runningTimer = self.runningTimer - 1;
					// Add a strike or end the game when the timer runs out
					if (self.runningTimer === 0) {
						strikes === 2 ? ($('.panicTimer').html('__'), $('.commandText').html('<br>--------'), kablooey() ) :
						( strikes++, playAudio('./soundfx/x.wav'), $('.strikes').html('STRIKES: ' + strikes), $('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), console.log('NOPE! STRIKES:', strikes) );
						resetTimer();
					}

				}, 100);
			}
		}, 100);

		var resetTimer = function() {

			console.log('resetting', 'OLD FRQ COUNT: ', self.runningFrq);

			modcode.find('.panicBar').css('width', '61%');
			modcode.find('.panicTimer').html('__');
			modcode.find('.commandText').html('<br>--------').removeAttr('style');
			modcode.find('.modled').toggleClass('on panicOff');

			// Stops module's timer
			clearInterval(self.counter);

			self.runningTimer = 300;
			newbar = 61;
			self.runningFrq = specificRand(300,600); // Generates new random number for next activation
			correct++; // Gives back point since module is inactive
			console.log('NEW FRQ COUNT: ', self.runningFrq, 'GIVING BACK POINT... POINTS: ', correct);

		};

		// Click event needs to be locally scoped due to interval, so it is grouped outside of the other click events
		modcode.find('.buttontimer').on('click', function(e) {
			if (modcode.find('.modled').hasClass('on')) {
				e.preventDefault();
				resetTimer(); // Reset timer regardless of correct or incorrect answer
				var sliderVal = modcode.find('.ui-slider').slider('option', 'value');
				// Determines if 1) the slider value matches the command 2) if this gives the player 100% completion once the module is deactivated
				sliderVal === answers[modNumber] ? ( playAudio('./soundfx/correctMod.wav'), ( correct === 4 ? winner() : (console.log('Phew.')) ) ) : (strikes++, playAudio('./soundfx/x.wav'), $('.strikes').html('STRIKES: ' + strikes), $('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? ($('.panicTimer').html('__'), $('.commandText').html('<br>--------'), kablooey() ) : console.log('NOPE! STRIKES: ', strikes)) );
			}
		});
	},

	this.placeCommand = function(modcode) {
		var randPrefixGroup = specificRand(0,6),
		randPrefix, // Determined a couple lines down
		randSuffix = specificRand(0,36),
		randStatus = specificRand(0,36),

		commandText = [],
		commandTextElement,
		commandTextElementDefaultH;

		// Groups 0 and 1 have one more prefix than the others
		randPrefixGroup === 0 || randPrefixGroup === 1 ? randPrefix = specificRand(0,5) : randPrefix = specificRand(0,4);

		// From 'BANKS AND LISTS' Section
		// Constructs an amusing phrase based off of a random prefix in the group, a random suffix, and an arbitrary 'status' meant to throw off the player
		commandText.push(panicWords.commandPrefix[randPrefixGroup][randPrefix] + ' ', panicWords.commandSuffix[randSuffix] + ' ', panicWords.commandStatus[randStatus]);
		// Prefixes that end in '-' cause the prefix and suffix to become one word
		commandText[0].indexOf('-') > -1 ? commandText[0] = commandText[0].slice(0, -2) : commandText;
		commandText = commandText.join('');

		commandTextElement = modcode.find('.commandText');

		// Dynamic sizing for the command text based on screen size and orientation
		commandTextElement.text(commandText);
		commandTextElementDefaultH = modcode.find('.commandBox').height();
		
		if (commandTextElement[0].scrollHeight > commandTextElementDefaultH) {

			var fontpx = Number($('.commandText').css('font-size').slice(0,-2));
			var fontvw = (((fontpx/screenwidth).toFixed(3))*100).toFixed(1);
			var fontvh = (((fontpx/screenheight).toFixed(3))*100).toFixed(1);

			while (commandTextElement[0].scrollHeight > commandTextElementDefaultH) {
				if (screenwidth <= screenheight) {
					fontvw -= 0.1;
					commandTextElement.css('font-size', fontvw+'vw');
				}
				else {
					fontvh -= 0.1;
					commandTextElement.css('font-size', fontvw+'vh');
				}
			}
		}

		this.createAns(modcode, randPrefixGroup, randSuffix);
		return commandText;
	},

	this.createAns = function(modcode, group, suffix) {
		// Determines correct slider value (see game manual for table)
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

		console.log('ANSWER: ', guide, 'GROUP: ', group, 'SUFFIX: ', panicWords.commandSuffix[suffix]);
		answers[modNumber] = guide;
		console.log('TEMP ANSWERS: ', answers);
		return guide;
		
	};

};

/*____SIMPLE WIRES____*/

var SimpleWires = function() {

	this.place = function(serial, modNumber) {
		var modcode = $('#mod' + modNumber);
		modcode.prepend('<div class="wires"></div>');
		modcode.find('.wires').prepend('<div class="simpleWireWrap"></div>');
		modcode.find('.simpleWireWrap').append('<div class="indivWireContS"></div>');

		// Determines if there are 3, 4, 5, or 6 wires
		var simpleWireCount = specificRand(3,6),
		wireColors = ['black', '#095AD9', '#34681D', '#8F0202', 'white'], // Array position is "colorMapCode"
		wireArrays = [];

		// For each wire, assign a color and push its colorMapCode into wireArrays
		for (var i = 0; i < simpleWireCount; i++) {
			var colorMapCode = specificRand(0,4), // Random color
			colorMap = wireColors[colorMapCode]; // String for CSS coloring at the end of the loop
			wireArrays.push(colorMapCode);

			modcode.find('.indivWireContS').append('<button class="indivWiresS" id = "wire' + i + '"></button>');
			modcode.find('#wire' + i).css('background-color',colorMap);
		}
		console.log('GIVEN: ', wireArrays);

		// Array of numberical values corresponding to the wire's color, used for initSimpleWires function below
		return this.initSimpleWires(serial, modNumber, wireArrays);
	},

	this.initSimpleWires = function(serial, modNumber, wireArrays) {
		var numWires = wireArrays.length,
		guide = 0; // Will become the correct numbered wire to cut

		// See flowcharts in the game manual
		// Consult the "GLOBAL FUNCTIONS" section of the app for countTarget, multiLimits, arrSame, and arrConsecutive
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
					countTarget(wireArrays, 2) === 1 ? guide = wireArrays.indexOf(2) : guide = 2; break;
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
	};
};

/*____COMPLEX WIRES____*/

var ComplexWires = function() {

	// Determines a wire layout for each of the 6 wires, becomes [nodelta/delta, ledoff/ledon, othercolor/red/black] after this.place
	this.rando = function() {
		var randomLayout = [];
		for (var i = 0; i < 6; i++) {
			var layout = [specificRand(0,1), specificRand(0,1), specificRand(0,2)];
			randomLayout.push(layout);
		}
		return randomLayout;
	},

	this.place = function(serial, modNumber) {
		var wireArrays = this.rando(),
		modcode = $('#mod' + modNumber);

		modcode.prepend('<div class="wires"></div>');
		modcode.find('.wires').prepend('<div class="wireWrap"></div>');
		modcode.find('.wireWrap').prepend('<button class="confirm wireDocks"></button><div class="wireDocks dock0"></div><div class="delta wireDocks"></div><div class="wireDocks dock1"></div><div class="led wireDocks"></div>');
		modcode.find('.wireWrap').append('<div class="indivWireCont"></div>');
		for (var i = 0; i < 6; i++) {
			modcode.find('.indivWireCont').append('<button class="indivWires" id = "wire' + i + '"></button><div class="wireSpacing"></div>');

			modcode.find('#wire' + i).append('<div class="deltaOnOff">∆</div>').addClass( wireArrays[i][0] === 0 ? 'deltaOff' : 'deltaOn' );
			modcode.find('#wire' + i).append('<div class="ledOnOff"></div>').addClass( wireArrays[i][1] === 0 ? 'ledOff' : 'ledOn' );
			modcode.find('#wire' + i).css('background-color', wireArrays[i][2] === 0 ? this.randoColor() : (wireArrays[i][2] === 1 ? '#8F0202' : 'black') );

		}
		return this.initWires(serial, modNumber, wireArrays);
	},

	// Assigns random color from "temp" array for non red/black wires 
	this.randoColor = function() {
		var temp = ['#6aa84f', 'orange', 'white', 'yellow', 'purple', 'teal'];
		return temp[specificRand(0,5)];
	},

	this.initWires = function(serial, modNumber, wireArrays) {
		var guide = [],
		i, x;

		// Determines whether the player should or should not cut a wire based on Color/LED/Delta
		for (i = 0, x = wireArrays.length; i < x; i++) {
			switch(wireArrays[i][2]) {
				case 2: // Black
					guide.push( wireArrays[i][0] === 0 ? (wireArrays[i][1] === 0 ? (serial[7].match(/[^AEIOU24680]/g) ? 'Y' : 'N' ) : (serial[7].match(/[^AEIOU24680]/g) ? 'Y' : 'N' )) : (wireArrays[i][1] === 0 ?  'N' : (serial[7].match(/[^AEIOU24680]/g) ? 'Y' : 'N' )));
					break;
				case 1: // Red
					guide.push( wireArrays[i][0] === 0 ? (wireArrays[i][1] === 0 ? (serial[7].match(/[^AEIOU24680]/g) ? 'Y' : 'N' ) : (serial[7].match(/[^AEIOU24680]/g) ? 'Y' : 'N' )) : (wireArrays[i][1] === 0 ?  'Y' : (serial[7].match(/[^AEIOU24680]/g) ? 'Y' : 'N' )));
					break;
				default: // Neither
					guide.push( wireArrays[i][0] === 0 ? (wireArrays[i][1] === 0 ? 'Y' : 'N') : (wireArrays[i][1] === 0 ?  'Y' : 'N') );
			}
		}
		console.log((outlet.match(/(usa)|(uk)|(ger)/g)) ? 'NORMAL' : 'REVERSE');
		// Reverses the 'Y's and 'N's in the guide if the outlet is NOT USA/UK/GER
		return (outlet.match(/(usa)|(uk)|(ger)/g)) ? guide : guide.join('').replace(/[YN]/g, function(i) {return i === 'Y' ? 'N' : 'Y';} ).split('');
	};
};

/*____KEYPAD____*/

var Keypad = function(modNumber) {

	this.place = function(modNumber) {
		$('#mod' + modNumber).prepend('<div class="keypad"></div>');
		for (var i = 0; i<4; i++) {
			$('#mod' + modNumber).find('.keypad').append('<button class="kbutton" id="button' + String(i) + '"></button>');
		}

		return this.initKeypad();
	},

	this.initKeypad = function() {
		// Get a random array from keypadColumns in "BANKS AND LISTS"
		var fullRow = keypadColumns[specificRand(0,5)].slice(),
		modifiedRow = fullRow.slice(), // both fullRow and modifiedRow use slice to make copies of the array instead of referencing it
		onSafe = [],
		guide = [];

		// Gets a random value from modifiedRow, pushes it to onSafe, and removes it from modifiedRow to avoid duplicates
		for (var i = 0; i < 4; i++) {
			var s = specificRand(0,modifiedRow.length-1);
			onSafe.push(modifiedRow[s]);
			$('#mod' + modNumber).find('#button' + i).text(modifiedRow[s]);
			modifiedRow.splice(s,1);
		}
		// Pushes value's position in fullRow to the guide (this will determine the order that the player should click it)
		for (var j = 0; j < 4; j++) {
			guide.push( fullRow.indexOf(onSafe[j]) );
		}
		// Sorts the guide
		guide = guide.sort();
		console.log(guide);
		// Transforms positions into values to make click events easier
		for (var k = 0; k < 4; k++) {
			guide[k] = fullRow[guide[k]];
		}
		return guide;
	};

};

//-------------------------------------------------------
//	PLACE MODULES
//-------------------------------------------------------

// The IIFE initAll in this section places four random modules from the section above

var spaces = ['m0','m1','m2','m3'], // Places all modules in an array (good for debugging)
serialtxt = serial,
answers = ['ans0','ans1','ans2','ans3'], // Each module's "init" (or "createAns" for the Panic Module) pushes answers here
optHolder = {hold0: [], hold1: [], hold2: [], hold3: []}; // Holder for click events (used below), some arrays will be empty on purpose

(function initAll() {
	var i, chosenmod;
	for (i = 0; i < 4; i++) {
		// Random number to decide which module gets placed
		// Only one Panic Module can be placed, or else the game would be too hectic (maybe I'll make a hard mode later :D)
		answers.indexOf('panicWaiting') === -1 ? (chosenmod = specificRand(0,4), console.log('panic not placed yet')) : (chosenmod = specificRand(0,3), console.log('already here'));

		switch (chosenmod) {
		// For every module, the spaces array receives the newly constructed object, and the answer is populated
			case 0:
				spaces[i] = new Keypad(i);
				answers[i] = spaces[i].place(i);
				console.log(spaces[i], answers[i]);
				break;
			case 1:
				spaces[i] = new ComplexWires(serialtxt, i);
				answers[i] = spaces[i].place(serialtxt, i);
				console.log(spaces[i], answers[i]);
				break;
			case 2:
				spaces[i] = new SimpleWires(serialtxt, i);
				answers[i] = spaces[i].place(serialtxt, i);
				console.log(spaces[i], answers[i]);
				break;
			case 3:
				spaces[i] = new Launchpad(i);
				answers[i] = spaces[i].place(i);
				console.log(i, spaces[i], answers[i]);
				break;
			case 4:
				spaces[i] = new Panic(serialtxt, i);
				spaces[i].place(i);
				answers[i] = 'panicWaiting'; // This will not be populated until the Panic Module goes off
				console.log(spaces[i], 'WAITING');
				break;
			default:
				break;
		}
	}
	console.log('CURRENT MODULES: \n\n\n', spaces, '\n\nANSWERS: ', answers, '\n\nHOLDER: ', optHolder, '\n\nPOINTS: ', correct);
}());
	


//-------------------------------------------------------
//	EVENTS
//-------------------------------------------------------

// All events have their own local "clickedMod" to ensure that the scope stays consistent

// SIMPLE WIRES

$('.indivWiresS').on('click', function(e) {
	e.preventDefault();

	var clickedMod = ($(this).closest('.mod').attr('id')[3]), // Get module number from DOM
	guide = Number(answers[clickedMod]), // Get answer from array in "PLACE MODULES" section --> Numbered wire
	x = Number($(this).attr('id')[4]); // Get the number of the wire the player clicked on

	//If correct, add "cutS" class, add to score, check for win... If not, add strike, check for loss
	x === guide ? ($(this).append('<div class="cutS"></div>'), ($(this).closest('.mod').find('.indivWiresS').off()), $(this).closest('.mod').find('.modled').addClass('correct'), playAudio('./soundfx/correctMod.wav'), correct++, ( correct === 4 ? winner() : console.log('SUCCESS!', 'CORRECT: ', correct+'/4')) )  : (strikes++, playAudio('./soundfx/x.wav'), $('.strikes').html('STRIKES: ' + strikes), $('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? kablooey() : console.log('NOPE! STRIKES: ', strikes)));
});

// COMPLEX WIRES

$('.indivWires').on('click', function(e) {
	e.preventDefault();

	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod], // array of "Y"s and "N"s
	x = ($(this).attr('id')[4]), // Get the number of the wire the player clicked on (corresponds to array position)

	outcome = guide[x], // "Y" or "N"
	postcheck; // Instantiated for use below

	// If "N", add strike, check for loss
	// If "Y", change 'guide' entry to "-" (to prevent double scoring) and add "cut" class
	outcome === 'N' ? (strikes++, playAudio('./soundfx/x.wav'), $('.strikes').html('STRIKES: ' + strikes), $('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? kablooey() : console.log('NOPE! STRIKES: ', strikes)) ) 
	: ($(this).addClass('cut'), guide[x] = '-'), console.log(guide);
	// Checks if module has been completed
	postcheck = guide.indexOf('Y');
	// i.e., If there is no "Y", and there is at least one "-", (denoting correct) consider the module complete and check for win
	postcheck === -1 && guide.indexOf('-') > -1 ? (($(this).closest('.mod').find('.indivWires').off()), $(this).closest('.mod').find('.modled').addClass('correct'), playAudio('./soundfx/correctMod.wav'), correct++, ( correct === 4 ? winner() : console.log('SUCCESS!', 'CORRECT: ', correct+'/4')), $(this).off(), $(this).closest('.wireWrap').find('.confirm').off()) : false;
});
	// The handler below refers to the red button on the top of the module
$('.confirm').on('click', function(e) {
	e.preventDefault();
	var guide = answers[($(this).closest('.mod').attr('id')[3])];
	// i.e., If everything is "N", consider the module complete and check for win
	guide.indexOf('Y') === -1 ? (($(this).closest('.mod').find('.indivWiresS').off()), $(this).closest('.mod').find('.modled').addClass('correct'), playAudio('./soundfx/correctMod.wav'), correct++, ( correct === 4 ? winner() : console.log('SUCCESS!', 'CORRECT: ', correct+'/4')) ) : (strikes++, playAudio('./soundfx/x.wav'), $('.strikes').html('STRIKES: ' + strikes), $('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), (strikes === 3 ? kablooey() : console.log('NOPE! STRIKES: ', strikes)));
});

// KEYPAD

$('.kbutton').on('click', function(e) {
	e.preventDefault();

	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod], // Uses non-glyphed ASCII characters
	bclicked = optHolder['hold' + clickedMod]; // Starts out empty, keeps track of clicked inputs

	// If this is not the final input
	if (bclicked.length < 3) {
		bclicked.push($(this).text());
		console.log(bclicked);
		if (bclicked[bclicked.length-1] !== guide[bclicked.length-1]) { // If input is incorrect
			strikes++;
			playAudio('./soundfx/x.wav');
			$('.strikes').html('STRIKES: ' + strikes);
			strikes === 3 ? kablooey() : ( $('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100), console.log('NOPE!', 'strikes', strikes, bclicked),
			bclicked.splice(-1,1),
			console.log('---->',bclicked));
		}
		else {
			console.log('YEAH!', 'strikes', strikes, bclicked);
			$(this).addClass('correctKeypad');
		}
	}
	else if (bclicked.length === 3) {
		bclicked.push($(this).text());
		if (bclicked[bclicked.length-1] !== guide[bclicked.length-1]) {
			console.log('SERIOUSLY!?!');
			strikes++;
			playAudio('./soundfx/x.wav');
			$('.strikes').html('STRIKES: ' + strikes);
			$('.strikebuzzer').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
			bclicked.splice(-1,1); // Remove incorrect input from "bclicked" array
			return false;
		}
		else {
			correct++;
			console.log('SUCCESS!', 'CORRECT: ', correct+'/4');
			$(this).addClass('correctKeypad');
			$(this).closest('.mod').find('.modled').addClass('correct');
			playAudio('./soundfx/correctMod.wav');
			$(this).off('click');
			if (correct === 4) { winner(); }
		}
	}
});

//LAUNCHPAD

$('.launchpad').on('click', '.blink, .noblink', function(e) {
	e.preventDefault();
	var clickedMod = ($(this).closest('.mod').attr('id')[3]);

	// Initializes launchpad config in holder
	optHolder['hold' + clickedMod] = ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'];

	// Prepares launchpad for next event
	$(this).removeClass('R G B Y blink noblink lbutton').addClass('lbuttonOn W');
	$(this).siblings().removeClass('lbutton').addClass('lbuttonOn W');

});
$('.launchpad').on('click', '.lbuttonOn', function(e) {
	e.preventDefault();

	var clickedMod = ($(this).closest('.mod').attr('id')[3]),
	guide = answers[clickedMod].join(''), // Joins answer array for easier comparisons
	clickedPadID = ($(this).attr('id').slice(7)),
	currentConfig = optHolder['hold' + clickedMod];
	
	// Cycle through colors
	if ($(this).hasClass('W')) {$(this).removeClass('W').addClass('R'); currentConfig[clickedPadID] = 'R';}
	else if ($(this).hasClass('R')) {$(this).removeClass('R').addClass('B'); currentConfig[clickedPadID] = 'B';}
	else if ($(this).hasClass('B')) {$(this).removeClass('B').addClass('G'); currentConfig[clickedPadID] = 'G';}
	else if ($(this).hasClass('G')) {$(this).removeClass('G').addClass('Y'); currentConfig[clickedPadID] = 'Y';}
	else if ($(this).hasClass('Y')) {$(this).removeClass('Y').addClass('W'); currentConfig[clickedPadID] = 'W';}

	// After each click, check if current config matches the guide
	console.log('CUR: ', currentConfig.join(''), '\nANS: ', guide, currentConfig === guide);

	if (currentConfig.join('') === guide) {
		correct++; 
		console.log('SUCCESS!', 'CORRECT: ', correct+'/4');
		$(this).closest('.mod').find('.modled').addClass('correct');
		$(this).closest('.mod').find('.launchpad').off();
		playAudio('./soundfx/correctMod.wav');
		$(this).off('click');
		if (correct === 4) { winner(); }
	}

});
	console.timeEnd('All of it');
});