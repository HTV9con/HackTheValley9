//const mic_btn = document.querySelector('#mic')
const playback = document.querySelector(".playback")
console.log(playback);

//mic_btn.addEventListener('click', ToggleMic);

let can_record = false;
let is_recording = false;

let recorder = null;

let chunks = [];

function PrepareAudio() {
    console.log("Setting up microphone");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({
	    audio: true
	})
	.then(SetupStream)
	.catch(err => {
	    console.error(err)
	});
    }
}
PrepareAudio();
function SetupStream(stream) {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e=> {
	chunks.push(e.data);
    }

    recorder.onstop = e=> {
	const blob = new Blob(chunks, { type: "audio/mp3; codecs=opus"});
	chunks = [];
	const audioURL = window.URL.createObjectURL(blob);
	playback.src = audioURL;
	console.log("Fuck");
    }
    can_record=true;
    console.log("Bruh");
}

function ToggleMic() {
    if (!can_record) {
	console.log("fucked");
	return;
    }
    console.log("Actually started");

    is_recording = !is_recording;

    if (is_recording) {
	console.log("bruh1");
	recorder.start();
    }
    else {
	recorder.stop();
	console.log("bruh2");
    }
}
