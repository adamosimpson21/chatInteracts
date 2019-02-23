require('dotenv').config();
const TwitchJS = require('twitch-js');

const myUserName = 'bandswithlegends'

const channels = ["#BandsWithLegends"]

//connecting to twitch client
const options = {
  options:{
    debug:true
  },
  connection:{
    port,
    secure:false,
    reconnect:true
  },
  identity:{
    username: "",
    password: process.env.PASSWORD
  },
  channels
};

const client = new TwitchJS.client(options);

client.on("connected", function (address, port) {
  client.whisper(myUserName, `Connected on ${address} ${port}`)
});