"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = exports.joinGame = exports.createMafiaGame = void 0;
require("dotenv").config();
const index_1 = require("./index");
class Player {
    constructor(interaction) {
        var _a;
        this.vote = -1;
        this.id = interaction.user.id;
        this.nickname = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.nickname;
        this.role = ROLE.unnassigned;
        interaction.user.createDM().then((dm) => {
            this.dm = dm;
        });
    }
}
var GAMESTATUS;
(function (GAMESTATUS) {
    GAMESTATUS[GAMESTATUS["none"] = 0] = "none";
    GAMESTATUS[GAMESTATUS["lobby"] = 1] = "lobby";
    GAMESTATUS[GAMESTATUS["mafia"] = 2] = "mafia";
    GAMESTATUS[GAMESTATUS["doctor"] = 3] = "doctor";
    GAMESTATUS[GAMESTATUS["sheriff"] = 4] = "sheriff";
    GAMESTATUS[GAMESTATUS["talking"] = 5] = "talking";
    GAMESTATUS[GAMESTATUS["voting"] = 6] = "voting";
})(GAMESTATUS || (GAMESTATUS = {}));
var ROLE;
(function (ROLE) {
    ROLE["unnassigned"] = "Unassigned";
    ROLE["townsfolk"] = "Townsfolk";
    ROLE["doctor"] = "Doctor";
    ROLE["sheriff"] = "Sheriff";
    ROLE["mafia"] = "Mafia";
})(ROLE || (ROLE = {}));
let players;
let gameStatus = GAMESTATUS.none;
let channel;
let mafia;
let townsfolk;
let mafiaChoice = -1;
function createMafiaGame(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (gameStatus === GAMESTATUS.none) {
            channel = interaction.channel;
            interaction.reply("A game of mafia has been created. Type /join to join");
            players = [];
            gameStatus = GAMESTATUS.lobby;
            return;
        }
        interaction.reply("A game of mafia is already in play. Please join that game or wait for it to end");
    });
}
exports.createMafiaGame = createMafiaGame;
function joinGame(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (gameStatus = GAMESTATUS.lobby) {
            players.push(new Player(interaction));
            interaction.reply(`${(_a = interaction.member) === null || _a === void 0 ? void 0 : _a.nickname} has joined the game! There are now ${players.length} players!`);
            return;
        }
        interaction.reply("There is no joinable game");
    });
}
exports.joinGame = joinGame;
function startGame(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (gameStatus === GAMESTATUS.lobby && players.length >= 4) {
            interaction.reply("Starting game...");
            assignRoles();
            return;
        }
        else if (gameStatus != GAMESTATUS.lobby) {
            interaction.reply("There is no game to start");
        }
        else {
            interaction.reply("There must be 4 or more people to play.\nGet more friends");
        }
    });
}
exports.startGame = startGame;
function assignRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        mafia = [];
        townsfolk = [];
        let mafioso = Math.floor(Math.random() * players.length);
        players[mafioso].role = ROLE.mafia;
        mafia.push(players[mafioso]);
        for (let i = 0; i < players.length; i++) {
            if (players[i].role == ROLE.unnassigned) {
                players[i].role = ROLE.townsfolk;
                townsfolk.push(players[i]);
            }
        }
        townsfolk.forEach((value) => {
            var _a;
            (_a = value.dm) === null || _a === void 0 ? void 0 : _a.send(`You are a ${value.role}`);
        });
        mafia.forEach((value) => {
            var _a;
            (_a = value.dm) === null || _a === void 0 ? void 0 : _a.send(`You are a ${value.role}`);
        });
        channel.send("Game starting in 10 seconds...");
        setTimeout(() => {
            nightTime();
        }, 10000);
        index_1.client.addListener("messageCreate", (msg) => {
            handleMessage(msg);
        });
    });
}
function nightTime() {
    channel.send("Night-time has come and everyone goes to their houses to rest for the night");
    promptMafia();
}
function promptMafia() {
    gameStatus = GAMESTATUS.mafia;
    mafia.forEach((value) => { var _a; return (_a = value.dm) === null || _a === void 0 ? void 0 : _a.send("Send the number of whom you wish to kill\n" + buildPlayerList()); });
}
function handleMafia(msg) {
    var _a, _b, _c;
    if (Number(msg.content) - 1 < players.length && Number(msg.content) - 1 >= 0 && msg.channelId == ((_a = mafia[0].dm) === null || _a === void 0 ? void 0 : _a.id)) {
        mafiaChoice = Number(msg.content) - 1;
        (_b = mafia[0].dm) === null || _b === void 0 ? void 0 : _b.send("Killing " + players[mafiaChoice].nickname);
        townAwakes();
        return;
    }
    if (msg.channelId == ((_c = mafia[0].dm) === null || _c === void 0 ? void 0 : _c.id))
        msg.reply("Please type a valid number");
}
function buildPlayerList() {
    let playerList = "";
    players.forEach((value, key) => {
        playerList += `${key + 1}: ${value.nickname}\n`;
    });
    return playerList;
}
const handleMessage = (msg) => {
    if (gameStatus === GAMESTATUS.mafia) {
        handleMafia(msg);
        setTimeout(() => {
            if (mafiaChoice === -1) {
                townAwakes();
            }
        }, 20000);
    }
    if (gameStatus === GAMESTATUS.voting) {
        handleVotingMessages(msg);
    }
};
function townAwakes() {
    gameStatus = GAMESTATUS.talking;
    handleTalking();
}
function handleTalking() {
    if (mafiaChoice != -1) {
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
function handleVoting() {
    gameStatus = GAMESTATUS.voting;
    channel.send("Begin voting");
    players.forEach((value) => { var _a; return (_a = value.dm) === null || _a === void 0 ? void 0 : _a.send("Send the number of whom must hang\n" + buildPlayerList()); });
}
function handleVotingMessages(msg) {
    players.forEach(value => {
        var _a;
        if (Number(msg.content) - 1 < players.length && Number(msg.content) - 1 >= 0 && msg.channelId == ((_a = value.dm) === null || _a === void 0 ? void 0 : _a.id)) {
            value.vote = Number(msg.content) - 1;
        }
    });
    setTimeout(() => {
        hang();
    }, 20000);
}
function hang() {
    let votes = [];
    for (let i = 0; i < players.length; i++) {
        votes.push(0);
    }
    players.forEach(value => {
        if (value.vote != -1) {
            votes[value.vote]++;
        }
    });
    let biggest = 0;
    for (let i = 0; i < votes.length; i++) {
        if (votes[i] > votes[biggest]) {
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
function checkWin() {
    if (mafia.length === 0) {
        channel.send("Town wins!!!");
        gameStatus = GAMESTATUS.none;
    }
    if (mafia.length >= townsfolk.length) {
        channel.send("Mafia wins!!!");
        gameStatus = GAMESTATUS.none;
    }
    ;
}
function killPlayer(index) {
    let dead = players[index];
    delete players[index];
    if (players[index].role == ROLE.townsfolk) {
        delete townsfolk[townsfolk.findIndex(value => value == dead)];
        return;
    }
    if (players[index].role == ROLE.mafia) {
        delete mafia[mafia.findIndex(value => value == dead)];
    }
}
