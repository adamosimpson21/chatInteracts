require('dotenv').config();
const TwitchJS = require('twitch-js');

const myUserName = 'bandswithlegends'

const channels = ["#BandsWithLegends"];
const port = process.env.PORT || 80;

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
let players = {};
const defaultChatter= {
  username:undefined,
  channel:undefined,
  // whether a player is creating a friend or foe for the given game
  makeFriend: true,
  bits:5,
  // these numbers should be less than bits to be within budget
  health: 0,
  attack: 0,
  speed: 0,
  // status is what steps a player has finished. They include new, faction, stats, done
  status: 'new',
}

const introWhisper = 'Thanks for joining in the game. Whisper me "new" to start';
const welcomeBackWhisper = "Ready to make another creature?";
const setUpWhisper = (numBits=5) => `Your budget for stats is ${numBits} bits. Cheer with bits for more power. Whisper "food" to help the streamer or "invader" to attack them.`;
const statsWhisper = "Choose Health, Attack, and Speed for your creature. Use numbers that add up to your budget, separated by commas. Ex: 3,1,1 for high health. 0,5,0 for extreme attack";
const overBudgetWhisper = numBits => `Sorry! Your creature is too powerful. You are over budget by ${numBits} bits`;
const goofWhisper = "Sorry! I didn't understand your message. Please review the instructions and try again";

const initializePlayer = (userstate, channel = 'undefined')=> {
  // userstate.bits contains # of bits
  const {username} = userstate;
  if(!players.username){
    players[username] = {...defaultChatter, username, channel};
    players[username].bits = userstate.bits ? userstate.bits : 5;
    client.whisper(username, introWhisper)
  } else if (players.username.status==='done'){
    players[username].status = 'new';
    client.whisper(username, welcomeBackWhisper);
  } else {
    processWhisper(username);
  }
}

const chooseStats = (player, message) => {
  client.whisper(player.username, "nothing yet")
  player.status='stats'
}

const chooseFaction = (player, message) => {
  if(message.includes('food')){
    player.makeFriend = true;
    player.status = 'faction'
    client.whisper(player.username, statsWhisper)
  } else if(message.includes('invader')) {
    player.makeFriend = false;
    player.status = 'faction';
    client.whisper(player.username, statsWhisper)
  } else {
    client.whisper(player.username, setUpWhisper(player.username.bits))
  }
}

const finishCreature = (player, message) => {
  if(verifyStats(player)){
    createMonster(player)
    player.status = 'done';
  } else {
    client.whisper(player.username, overBudgetWhisper(player.bits));
    chooseStats(player,message);
  }
}

const processWhisper = (player, message) => {
  switch(player.status){
    case 'new':
      chooseFaction(player,message);
      break;
    case 'faction':
      chooseStats(player,message);
      break;
    case 'stats':
      finishCreature(player,message);
      break;
    default:
      client.whisper(player.username, goofWhisper)
      break;
  }
}

client.on("connected", (address, port) => {
  // client.whisper(myUserName, `Connected on ${address} ${port}`)
});

client.on("chat", (channel, userstate, message, self) => {
  message = message.toLowerCase();
  if(self) return;
  // verify this later with bits and/or other necessary pieces
  if(message.includes("!play")){
    initializePlayer(userstate, channel)
  }
})

client.on("cheer", (channel, userstate, message) => {
  message = message.toLowerCase();
  if(message.includes("!play")){
    initializePlayer(userstate, channel)
  }
});

client.on("whisper", (from, userstate, message, self) =>{
  if(self) return;
  message = message.toLowerCase();
  if(players[userstate.username]){
    processWhisper(players[userstate.username], message)
  } else {
    initializePlayer(userstate)
  }
})

const verifyStats = player => {
  const {health, attack, speed, bits} = player
//  takes in a chatter object and returns true if their creature stats are valid (within range + budget)
  const statsAreNumbers =  Number.isInteger(health) &&
                      Number.isInteger(attack) &&
                      Number.isInteger(speed) &&
                      Number.isInteger(bits)
  if(statsAreNumbers){
    return bits <= (health + attack + speed)
  }
  return false;
}

// This will eventually live somewhere in plot_twist
const createMonster = player => {
    // do something
}

client.connect();