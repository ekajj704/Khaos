require("dotenv").config();
import Discord, { Collection, Guild, managerToFetchingStrategyOptions, range, Role, TextBasedChannel } from "discord.js";
import {client} from "./index";

class Player{
    id: string;
    nickname: string;
    role: string;
    dm?: Discord.DMChannel;
    vote: number = -1;
    
    constructor(interaction: Discord.Interaction){
        this.id = interaction.user.id;
        this.nickname = interaction.member?.nickname;
        this.role = ROLE.unnassigned;
        interaction.user.createDM().then((dm) => {
            this.dm = dm;
        });

    }
}

enum GAMESTATUS{
    none,
    lobby,
    mafia,
    doctor,
    sheriff,
    talking,
    voting,
}

enum ROLE{
    unnassigned = "Unassigned",
    townsfolk = "Townsfolk",
    doctor = "Doctor",
    sheriff = "Sheriff",
    mafia = "Mafia",
}

let players: Player[];
let gameStatus:number = GAMESTATUS.none;
let channel: Discord.TextBasedChannel;
let mafia: Player[];
let townsfolk: Player[];
let mafiaChoice: number = -1;

export async function createMafiaGame(interaction: Discord.ChatInputCommandInteraction){
    if(gameStatus === GAMESTATUS.none){
        channel = interaction.channel as TextBasedChannel;
        interaction.reply("A game of mafia has been created. Type /join to join");
        players = [];
        gameStatus = GAMESTATUS.lobby;
        return;
    }
    interaction.reply("A game of mafia is already in play. Please join that game or wait for it to end");
}

export async function joinGame(interaction: Discord.ChatInputCommandInteraction) {
    if(gameStatus = GAMESTATUS.lobby){
        players.push(new Player(interaction));
        interaction.reply(`${interaction.member?.nickname} has joined the game! There are now ${players.length} players!`);
        return;
    }
    interaction.reply("There is no joinable game");
}

export async function startGame(interaction: Discord.ChatInputCommandInteraction){
    if(gameStatus === GAMESTATUS.lobby && players.length >= 4){
        interaction.reply("Starting game...");
        assignRoles();
        return;
    }else if(gameStatus != GAMESTATUS.lobby){
        interaction.reply("There is no game to start");
    }else{
        interaction.reply("There must be 4 or more people to play.\nGet more friends");
    }
}

async function assignRoles() {
    mafia = [];
    townsfolk = [];
    
    let mafioso = Math.floor(Math.random() * players.length);
    players[mafioso].role = ROLE.mafia;
    mafia.push(players[mafioso]);

    for(let i: number = 0; i < players.length; i++){
        if(players[i].role == ROLE.unnassigned){
            players[i].role = ROLE.townsfolk;
            townsfolk.push(players[i]);
        }
    }
    townsfolk.forEach((value) => {
        value.dm?.send(`You are a ${value.role}`);
    });
    mafia.forEach((value) => {
        value.dm?.send(`You are a ${value.role}`);
    });
    channel.send("Game starting in 10 seconds...");
    setTimeout(() => {
        nightTime();
    }, 10000);
    client.addListener("messageCreate", (msg) => {
        handleMessage(msg);
    })
}

function nightTime(){
    channel.send("Night-time has come and everyone goes to their houses to rest for the night");
    promptMafia();
}

function promptMafia(){
    gameStatus = GAMESTATUS.mafia;
    mafia.forEach((value) => value.dm?.send("Send the number of whom you wish to kill\n" + buildPlayerList()));   
}

function handleMafia(msg: Discord.Message){
    if(Number(msg.content)-1 < players.length && Number(msg.content)-1 >= 0 && msg.channelId == mafia[0].dm?.id){
        mafiaChoice = Number(msg.content)-1;
        mafia[0].dm?.send("Killing " + players[mafiaChoice].nickname);
        townAwakes();
        return;
    }
    if(msg.channelId == mafia[0].dm?.id) msg.reply("Please type a valid number");
}

function buildPlayerList(): string{
    let playerList: string = "";
    players.forEach((value, key) => {
        playerList += `${key+1}: ${value.nickname}\n`;
    })
    return playerList;
}

const handleMessage = (msg: Discord.Message) =>{
    if(gameStatus === GAMESTATUS.mafia){
        handleMafia(msg);
        setTimeout(() => {
            if(mafiaChoice === -1){
                townAwakes();
            }
        }, 20000);
    }
    if(gameStatus === GAMESTATUS.voting){
        handleVotingMessages(msg);
    }
}

function townAwakes(){
    gameStatus = GAMESTATUS.talking;
    
    handleTalking();

}

function handleTalking(){
    if(mafiaChoice != -1){
        channel.send(`${players[mafiaChoice].nickname} died last night`);
        killPlayer(mafiaChoice);
        channel.send("Begin discussion");
        setTimeout(() => {
            handleVoting();
        }, 20000);
        return;
    }
    channel.send("All was silent last night...");
    channel.send("Begin discussion");
        setTimeout(() => {
            handleVoting();
        }, 20000);
    checkWin();
}

function handleVoting(){
    gameStatus = GAMESTATUS.voting;
    channel.send("Begin voting")
    players.forEach((value) => value.dm?.send("Send the number of whom must hang\n" + buildPlayerList()));
}

function handleVotingMessages(msg: Discord.Message){
    players.forEach(value => {
        if(Number(msg.content)-1 < players.length && Number(msg.content)-1 >= 0 && msg.channelId == value.dm?.id){
            value.vote = Number(msg.content)-1;
        }
    });
    setTimeout(() => {
        hang();
    }, 20000)
}

function hang(){
    let votes: number[] = [];
    for(let i = 0; i < players.length; i++){
        votes.push(0);
    }
    players.forEach(value => {
        if(value.vote != -1){
            votes[value.vote]++;
        }
    });
    let biggest = 0;
    for(let i = 0; i < votes.length; i++){
        if(votes[i] > votes[biggest]){
            biggest = i;
        }
    }
    channel.send(`${players[biggest].nickname} was sentenced to hang by ${votes[biggest]} votes`);
    channel.send(`${players[biggest].nickname} was a ${players[biggest].role}`);
    killPlayer(biggest);
    setTimeout(() => {
        checkWin();
        nightTime();
    }, 5000);
}

function checkWin(){
    if(mafia.length === 0){
        channel.send("Town wins!!!");
        gameStatus = GAMESTATUS.none;
    }
    if(mafia.length >= townsfolk.length){
        channel.send("Mafia wins!!!");
        gameStatus = GAMESTATUS.none;
    };
}

function killPlayer(index: number){
    let dead = players[index];
    delete players[index];
    if(players[index].role == ROLE.townsfolk){
        delete townsfolk[townsfolk.findIndex(value => value == dead)];
        return
    }
    if(players[index].role == ROLE.mafia){
        delete mafia[mafia.findIndex(value => value == dead)];
    }
}
