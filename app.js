//-------------------------------------------------------------------
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
    //.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe")
    .toFormat('mp3')
    .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
    })
    .on('progress', (progress) => {
        // console.log(JSON.stringify(progress));
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
      audio: `https://mangoplantations.net/media/${file}`,
      auto_highlights: true
    };
     console.log("Text -------------")
    const transcript = await client.transcripts.transcribe(data);
        console.log("Text -------------")
    console.log(transcript)
    console.log("Text -------------")
    let a = {texts: transcript.text, results: ""};
    for (let result of transcript.auto_highlights_result.results) {
        a.results = a.results + "\n" + result.count + "\n" + result.rank + ";";
    }
    console.log(a)
    console.log(JSON.stringify(a))
    return JSON.stringify(a)
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
          console.log(req.files)
         console.log(JSON.parse(JSON.stringify(req.body)))
         console.log(req.files)
         decodeAudio("./PUBLIC/media" + "/audio")
         console.log(upload)
         getSummary("hello.mp3")
         res.json(getSummary("hello.mp3"))
         // res.json(getSummary(req.file))
        })
        .post((req, res) => {
          console.log(req.files)
         console.log(JSON.parse(JSON.stringify(req.body)))
         console.log(req.files)
         console.log(upload)
         res.json("gg:audio")
         // res.json(getSummary(req.file))
        })
        .put((req, res) => {
          console.log(req.files)
          console.log(JSON.parse(JSON.stringify(req.body)))
          console.log(req.body)
          console.log(req.files)
          res.json("gg")
         // res.json(getSummary(req.file))
        })
     .put(function(req, res) {
        if(req.query.submit_user_info == "generate"){res.json(stocks_everything("hello.mp3"))
        }
     })
    .get(function(req, res) {
      res.sendFile(__dirname + "/PUBLIC/conversation.html")
    });
