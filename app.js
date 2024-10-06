////-------------------------------------------------------------------
//>> Server Set-up
const express = require('express');
const filter = express();
const https = require('https');
const port = 8443;
const multer = require('multer')
const fs = require('fs')
const path = require('path')


//import { AssemblyAI } from "assemblyai"
const a = require("assemblyai")
const AssemblyAI = a.AssemblyAI

const client = new AssemblyAI({
  apiKey: 'e10a491c4dde4392b5cc848fa49ed09e',
});

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

function decodeAudio(pathencode) {
    let track = pathencode;//your path to source file

    ffmpeg(track)
    .toFormat('mp3')
    .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
    })
    .on('progress', (progress) => {
        console.log('Processing: ' + progress.targetSize + ' KB converted');
    })
    .on('end', () => {
        console.log('Processing finished !');
    })
    .save('./PUBLIC/media/hello.mp3');//path where you want to save your file
}



var options = {
  key: fs.readFileSync(__dirname + '/ssl/key.key'),
  cert: fs.readFileSync(__dirname + '/ssl/certificate.crt'),
  ca: fs.readFileSync(__dirname + '/ssl/certificate_ca.crt')
};

var server = https.createServer(options, filter);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});


filter.disable('x-powered-by'); // Securiy point
filter.use(express.json());
filter.use('/media',express.static(path.join(__dirname + '/PUBLIC/media')));

//<< Server Set-up
// Landing page  --- for all check for token if no redirct to beginning

async function getSummary(file){
    const data = {
      audio: `https://mangoplantations.net:8443/media/${file}`,
      auto_highlights: true
    };

    const transcript = await client.transcripts.transcribe(data);
    return transcript.auto_highlights_result.results
  }


const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, './PUBLIC/media')
 },
})

const upload = multer({ storage })

filter.route('/conversation')
     .post(upload.any('audio'), (req, res) => {
         console.log("Audio  -  received")
         decodeAudio("./PUBLIC/media" + "/audio")
         getSummary("hello.mp3").then((resp) => {res.json(resp)})
        })
    const noti = new Notification("Hello! Your conversation could use some more:", {resp[0]});	
   .get(function(req, res) {
      res.sendFile(__dirname + "/PUBLIC/conversation.html")
    });
