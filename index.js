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
    username: "plot_twist_bot",
    password: process.env.PASSWORD
  },
  channels
};

const client = new TwitchJS.client(options);

const introWhisper = "Thanks for joining in the game. Here are the instructinos: "

client.on("connected", function (address, port) {
  client.whisper(myUserName, `Connected on ${address} ${port}`)
});

client.on("message", function(target, context, msg, self){
  msg = msg.toLowerCase();
  if(self) return;
  if(msg.contains("!play")){
    client.whisper(target, introWhisper)
  }
})