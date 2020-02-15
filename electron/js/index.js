const { BrowserWindow } = require('electron').remote
const { remote } =require('electron');
const electron= require('electron');
const path = require('path');
const url =  require('url');
const ipc = electron.ipcRenderer;
let parentWindow = remote.getCurrentWindow() //parentWindow
let win=remote.getGlobal('win') //Global Window
window.$ = window.jQuery = require('jquery');
var allplayers = remote.getGlobal('sharedObj').allplayers; //All players in DB
var remainingPlayers = remote.getGlobal('sharedObj').players; //Players who are not in any game
var currentPlayers = remote.getGlobal('sharedObj').currentPlayers; //Players who are currently in game
if(!indexListener)
{
var indexListener=ipc.on('Reload', (event, message) => {
  console.log("Hello from index") // Prints 'whoooooooh!'
  allplayers = remote.getGlobal('sharedObj').allplayers; //All players in DB
  remainingPlayers = remote.getGlobal('sharedObj').players; //Players who are not in any game
  currentPlayers = remote.getGlobal('sharedObj').currentPlayers; //Players who are currently in game
})
}
function backup()
{
  ipc.send('backup')
}

