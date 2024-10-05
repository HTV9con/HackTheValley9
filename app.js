

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
//const { AssemblyAI }  = require('assemblyai');

const client = new AssemblyAI({
  apiKey: 'e10a491c4dde4392b5cc848fa49ed09e',
});

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
    const transcript = await client.transcripts.transcribe(data);
    let a = {texts: transcript.text, results: ""};
    for (let result of transcript.auto_highlights_result.results) {
        a.results = a.results + "\n" + result.count + "\n" + result.rank + ";";
    }
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
      .post(multer({ storage }).single('audio'), (req, res) => {
          console.log(req);console.log(req?.file)
          res.json(JSON.stringify(req))
         // res.json(getSummary(req.file))
        })
     .put(function(req, res) {
        if(req.query.submit_user_info == "generate"){res.json(stocks_everything(req.body))
        }
     })
    .get(function(req, res) {
      res.sendFile(__dirname + "/PUBLIC/conversation.html")
    });
