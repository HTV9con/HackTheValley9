const mic_btn = document.querySelector('#mic');
const playback = document.querySelector('.playback');

//mic_btn.addEventListener('click', ToggleMic);

let can_record = false;
let is_recording = false;

let recorder = null;

let chunks = [];

function PrepareAudio() {
    console.log("Setting up microphone");
    if (navigator.mediaDecives && navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({
	    audio: true
	})
	.then(SetupStream)
	.catch(err => {
	    console.error(err)
	});
    }
}

function SetupStream(stream) {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e=> {
	chunks.push(e.data);
    }

    recorder.onstop = e=> {
	const blob = new Blob(chunks, { type: "audio/ogg; codevs-opus"});
	chunks = [];
	const audioUrl = window.URL.createObjectURL(blob);
	playback.src = audioURL;
    }
    can_record=true;
}

function ToggleMic() {
    if (!can_record) return;

    recording =! isrecording;

    if (is_recording) {
	recorder.start();
    }
    else {
	recorder.stop();
    }
}
//PrepareAudio();
