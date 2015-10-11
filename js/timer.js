$(document).ready(function() {

(function timer() {
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

})();

});