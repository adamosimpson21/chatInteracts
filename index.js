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
// initialize chat object to hold players
let chat = {};
const defaultChatter= {
  username:undefined,
  bits:5,
  health: 0,
  attack: 0,
  magic: 0,
  status: 'new'
}

const introWhisper = "Thanks for joining in the game. Here are the instructinos: ";

client.on("connected", function (address, port) {
  client.whisper(myUserName, `Connected on ${address} ${port}`)
});

client.on("chat", (channel, userstate, message, self) => {
  message = message.toLowerCase();
  const {username} = userstate
  if(self) return;
  // verify this later with bits and/or other necessary pieces
  if(message.contains("!play")){
    chat[username] = defaultChatter;
    chat[username].username = username;
    client.whisper(username, introWhisper)
  }
})

client.on("cheer", (channel, userstate, message) => {
  // Do your stuff.
  // userstate.bits contains # of bits
  if(message.contains("!play")){
    client.whisper(target, introWhisper)
  }

});

client.on("whisper", function(from, userstate, message, self){
  if(self) return;
  const {username} = userstate;
  if(message.startsWith(""))
})

const verifyStats = chatter => {
//  takes in a chatter object and returns true if their creature stats are valid (within range + budget)
  return true;
}

// This will eventually live somewhere in plot_twist
const createMonster = (username, stats) => {
    // do something
}