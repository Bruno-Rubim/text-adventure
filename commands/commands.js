import { upView } from "../gameObjects/upView.js";
import { gameState } from "../gameState.js";
import * as terminal from "../screen/terminal.js";

class Command {
    constructor({ keywords, execute}){
        this.keywords = keywords;
        this.execute = execute;
    }
}

//general functions

export const compareArrays = (array1, array2) => {
    if (array1.length != array2.length){
        return false;
    }
    for (let i = 0; i < array1.length; i++){
        if (array1[i] != array2[i]){
            return false;
        }
    }
    return true;
}

export const findObjectContainer = (container, condition) => {
    if (container.content != null){
        for (let i = 0; i < container.content.length; i++) {
            if (condition(container.content[i])){
                return container.content[i];
            }
        }
        for (let i = 0; i < container.content.length; i++) {
            let innerContainer = findObjectContainer(container.content[i], condition);
            if (innerContainer){
                return innerContainer;
            }
        }
    }
    return false;
}

const findObjectInventory = (condition) => {
    for (let i = 0; i < gameState.inventory.length; i++) {
        if (condition(gameState.inventory[i])){
            let found = gameState.inventory[i];
            return found;
        }
    }
    return false;
}

export const findObjectGeneral = (condition) => {
    let found = findObjectContainer(gameState.currentArea, condition);
    if (!found) {
        found = findObjectInventory(condition);
    }
    if (!found) {
        found = findObjectContainer(upView, condition);
    }
    return found;
}

const findNeighbourArea = (condition) => {
    if (!gameState.currentArea.neighbourAreas.length > 0){
        return;
    }
    let neighbourAreas = gameState.currentArea.neighbourAreas;
    for (let i = 0; i < neighbourAreas.length; i++){
        if (!condition(neighbourAreas[i])) {
            continue;
        }
        return neighbourAreas[i];
    }
}

const solveWords = (originalWords, action) => {
    let words = [...originalWords]
    let target = words.shift();
    let result = [action((content) => content.references.includes(target))];
    let resultIndex = 0;
    while (words.length > 0){
        if (result[resultIndex]){
            resultIndex++;
            target = words.shift();
        } else {
            target += ' ' + words.shift();
        }
        result[resultIndex] = action((content) => content.references.includes(target));
    }
    return result;
}

//player commands

export const help = new Command({
    keywords: ['help', 'h'],
    execute: (words) => {
        if (!words.length || (words[0] == "commands" || words[0] == "command")){
            terminal.addTextToScreenQueue(`Here is a list of basic commands:\nLook\nTake\nPlace\nInventory\nGo\nHit\nClear\n<b class="red">Start</b>\n\nType: HELP [COMMAND] to get a description of a command`);
            return
        }
        if (words[0] == "[command]"){
            terminal.writeInWarning("So funny aren't you");
            return
        }
        let command = commandList.find(command => command.keywords.includes(words[0]));
        if (!command){
            terminal.writeInWarning("That command does not exist");
            return;
        }
        command.execute(['help']);
    }
})

export const look = new Command({
    keywords: ['look', 'inspect', 'check', 'examine', 'describe', 'l', 'x'],
    execute: (words) => {
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Look\nGives you the description of your current area.\n\nLook [subject]\nGives you the description of an object.");
            return 
        }
        if (words[0] == 'inventory') {
            inventory.execute([]);
            return;
        }
        let target;
        let solvedWords = [];
        if (words.length == 0 ||
            words[0] == 'left' ||
            words[0] == 'right') {
            target = gameState.currentArea;
        } else {
            solvedWords = solveWords(words, findObjectGeneral);
            target = solvedWords[0];
        }
        if (!target) {
            solvedWords = solveWords(words, findNeighbourArea);
            target = solvedWords[0];
            if (!target) {
                terminal.writeInWarning('No ' + words[0] + ' was found');
                return;
            }
            go.execute(words);
            return;
        }
        if (solvedWords.length > 1) {
            terminal.writeInWarning('Look at one thing at a time');
            return;
        }
        if (target.lookedAt) {
            target.lookedAt(gameState);
        } else {
            terminal.writeInWarning(words + ' has no lookedAt');
        };
        target.everSeen = true;
        terminal.addTextToScreenQueue(target.getDescription());
        return;
    }
});

export const take = new Command({
    keywords: ['take', 'get', 'pick', 'colect', 't'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning("Take what?");
            return;
        }
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Take [subject]\nPlaces an item from the area in your inventory.");
            return 
        }
       let solvedWords = solveWords(words, findObjectGeneral);
        let target = solvedWords[0];
        if (!target) {
            terminal.writeInWarning('No ' + words + ' was found');
            return;
        }
        if (!target.taken){
            terminal.writeInWarning(`You can't take that`);
            return;
        }
        let allowed = target.moveTo(gameState.inventory);
        if (!allowed) {
            terminal.writeInWarning(`You already have that`);
            return;
        }
        terminal.addTextToScreenQueue(target.taken());
        if (!target.everSeen){
            look.execute([target.name]);
        }
        return;
    }
});

export const place = new Command({
    keywords: ['place', 'put', 'p'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning("Place what?");
            return;
        }
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Place [subject] [target]\nPlaces an item from your inventory in a container.");
            return 
        }
        if (words.length == 1) {
            terminal.writeInWarning("Place " + words + " where?");
            return;
        }
        let solvedWords = solveWords(words, findObjectGeneral);
        let target = solvedWords[1];
        if (!target) {
            terminal.writeInWarning(`No matching target`);
            return;
        }
        let targetName = target.name[0].toUpperCase() + target.name.substring(1);
        if (!target.placed) {
            terminal.writeInWarning(targetName + ` can't contain items`);
            return;
        }
        if (!target.content.length > target.limit) {
            terminal.writeInWarning(targetName + ` can't hold more items`);
            return;
        }
        let subject = solvedWords[0];
        if (!subject) {
            terminal.writeInWarning(`No matching subject`);
            return;
        }
        if (subject == target){
            terminal.writeInWarning(`You can't place something on itself`);
            return;
        }
        let subjectName = subject.name[0].toUpperCase() + subject.name.substring(1);
        if (!subject.taken){
            console.log(subject);
            terminal.writeInWarning(`You can't take ` + subjectName);
            return;
        }
        let result = target.placed(subject);
        if (target.key){
            if (result[0]){
                subject.delete();
            }
            result = result[1];
        } else {
            subject.moveTo(target.content);
        }
        terminal.addTextToScreenQueue(result);
        return;
    }
});

export const inventory = new Command({
    keywords: ['inventory', 'inventry', 'i'],
    execute: (words) => {
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Inventory\nShows you what items you are carrying.");
            return 
        }
        if (gameState.inventory.length == 0){
            terminal.addTextToScreenQueue('Your inventory is empty.');
            return
        }
        let text = 'You have:';
        for(let i = 0; i < gameState.inventory.length; i++){
            text += '\n' + gameState.inventory[i].referTo();
        }
        terminal.addTextToScreenQueue(text);
        gameState.globalTime += 1;
    }
});

export const drop = new Command({
    keywords: ['drop', 'd'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning("Drop what?");
            return;
        }
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Drop [subject]\nPlaces an item from your inventory on the ground.");
            return 
        }
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++){
                words[0] += ' ' + words[i];
            }
        }
        let solvedWords = solveWords(words, findObjectInventory)
        let target = solvedWords[0];
        if (target){
            let ground = solveWords(['ground'], findObjectGeneral)[0];
            target.moveTo(ground.content);
            terminal.addTextToScreenQueue('You placed the ' + words[0] + ' is on the ground.');
            return;
        }
        terminal.writeInWarning('You have no ' + words + '.');
    }
});

export const go = new Command({
    keywords: ['go', 'move', 'walk', 'travel', 'g'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Go where?');
            return;
        }
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Go [area]\nMoves you to an accessible area.");
            return 
        }
        /*
        if (!gameState.currentArea.neighbourAreas.length > 0){
            terminal.writeInWarning('There is nowhere to go');
            return;
        }
        */
        const solvedWords = solveWords(words, findNeighbourArea);
        const target = solvedWords[0];
        if (!target){
            terminal.writeInWarning('No ' + words + ' was found');
            return;
        }
        terminal.addTextToScreenQueue(target.description);
        gameState.currentArea = target.areaObject;
        gameState.globalTime += target.distance;
        gameState.playerPosition = 'standing';
        if (!gameState.currentArea.everSeen){
            look.execute([]);
        }
    }
});

export const leave = new Command({
    keywords: ['leave'],
    execute: (words) => {
        if (words.length == 0) {
            go.execute(['outside']);
        }
        return
    }
})

export const enter = new Command({
    keywords: ['enter'],
    execute: (words) => {
        if (words.length == 0) {
            go.execute(['inside']);
        } else {
            go.execute(words);
        }
        return;
    }
})

export const hit = new Command({
    keywords: ['hit', 'smash', 'attack', 'break', 'h'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Hit what?');
            return;
        }
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue("Hit [subject] [subject]\nHits two objects together.");
            return 
        }
        let solvedWords = solveWords(words, findObjectGeneral);
        let object1 = solvedWords[0];
        if (!object1){
            terminal.writeInWarning('No ' + words[0] + ' was found');
            return;
        }
        if (solvedWords.length == 2){
            let object2 = solvedWords[1];
            if (!object2){
                terminal.writeInWarning(`No ` + words[1] + ` was found`);
                return;
            }
            let response = '';
            let hit = false;
            if (object2.hit){
                response = object2.hit(object1);
                hit = true;
            }
            if (object1.hit) {
                response += object1.hit(object2);
                object1.hit(object2);
                hit = true;
            }
            if (hit) {
                terminal.addTextToScreenQueue(response);
                return ;
            }
            terminal.writeInWarning(`You can't hit either.`);
            return;
        }
        if (!object1.hit) {
            terminal.writeInWarning(`You can't hit ` + object1.name);
            return;
        }
        terminal.addTextToScreenQueue(object1.hit('nothing'));
        return;
    }
});

export const read = new Command({
    keywords: ['read', 'r'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Read what?');
            return;
        }
        let solvedWords = solveWords(words, findObjectGeneral);
        let target = solvedWords[0];
        if (!target){
            terminal.writeInWarning(`No ` + words + ` was found`);
            return;
        }
        if (!target.read){
            terminal.writeInWarning(`You can't read ` + words);
            return;
        }
        terminal.addTextToScreenQueue(target.read());
        return
    }
})

export const blow = new Command({
    keywords: ['blow', 'r'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Blow what?');
            return;
        }
        let solvedWords = solveWords(words, findObjectGeneral);
        let target = solvedWords[0];
        if (!target){
            terminal.writeInWarning(`No ` + words + ` was found`);
            return;
        }
        if (!target.blown){
            terminal.writeInWarning(`You can't blow ` + words);
            return;
        }
        terminal.addTextToScreenQueue(target.blown());
        return
    }
})

export const climb = new Command({
    keywords: ['climb',],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Climb what?');
            return;
        }
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++){
                words[0] += ' ' + words[i];
            }
        }
        let objects = solveWords(words, findObjectGeneral);
        let target = objects[0];
        if (!target){
            terminal.writeInWarning(`No object was found`);
            return;
        }
        if (!target.climbed){
            terminal.writeInWarning(`You can't climb the ` + target.name);
            return;
        }
        let answer = target.climbed();
        if (answer) {
            terminal.addTextToScreenQueue(answer);
        }
        return
    }
})

export const open = new Command({
    keywords: ['open'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Open what?');
            return;
        }
        let objects = solveWords(words, findObjectGeneral);
        let lock = objects[0];
        let key = objects[1];
        if (key && lock) {
            place.execute([key.name, lock.name]);
            return
        }
        if (!lock){
            terminal.writeInWarning(`No object was found`);
            return;
        }
        if (!lock.opened){
            terminal.writeInWarning(`You can't open the ` + lock.name);
            return;
        }
        terminal.addTextToScreenQueue(lock.opened());
    }
})

export const close = new Command({
    keywords: ['close'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Open what?');
            return;
        }
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++){
                words[0] += ' ' + words[i];
            }
        }
        let objects = solveWords(words, findObjectGeneral);
        let target = objects[0];
        if (!target){
            terminal.writeInWarning(`No object was found`);
            return;
        }
        if (!target.closed){
            terminal.writeInWarning(`You can't close the ` + target.name);
            return;
        }
        terminal.addTextToScreenQueue(target.closed());
        return
    }
})

export const lay = new Command({
    keywords: ['lay', 'sleep'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Lay where?');
            return;
        }
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++){
                words[0] += ' ' + words[i];
            }
        }
        let objects = solveWords(words, findObjectGeneral);
        let target = objects[0];
        if (!target){
            terminal.writeInWarning(`No object was found`);
            return;
        }
        if (!target.layedOn){
            terminal.writeInWarning(`You can't lay on the ` + target.name);
            return;
        }
        terminal.addTextToScreenQueue(target.layedOn());
        return
    }
})

// meta

export const use = new Command({
    keywords: ['use', 'u'],
    execute: (words) => {
        terminal.writeInWarning(`What do you mean by 'use'?`);
        return
    }
})

export const clear = new Command({
    keywords: ['clear', 'c'],
    execute: (words) => {
        if (words.length == 0){
            terminal.screenText.innerHTML = '';
            terminal.writeInWarning("&nbsp;");
            return;
        }
        if (words[0] = 'help') {
            terminal.addTextToScreenQueue("Clear\nClears the screen text.");
        }
    }
});

export const time = new Command({
    keywords: ['time', 'hours', 'hour', '5'],
    execute: (words) => {
        if (words.length == 0){
            terminal.addTextToScreenQueue('It is ' + gameState.getHours(gameState.globalTime));
        }
    }
});

export const timeSkip = new Command({
    keywords: ['timeskip', 'ts'],
    execute: (words) => {
        const ammount = Number(words);
        if (ammount){
            gameState.globalTime += ammount;
            terminal.addTextToScreenQueue(`You went forward ` + ammount + ` minutes in time.`);
            time.execute([]);
        }
        return;
    }
})

export const skip = new Command({
    keywords: ['skip'],
    execute: () => {
        if (gameState.currentArea.name == 'void-room'){
            gameState.inventory = [];
            gameState.currentArea = tallStonesHill;
            clear.execute('');
            terminal.addTextToScreenQueue('You skipped the tutorial.');
            look.execute('');
            return;
        }
        terminal.writeInWarning(`You're not in the tutorial`);
        return;
    }
})

export const speed = new Command({
    keywords: ['speed'],
    execute: (words) => {
        let ammount = Number(words);
        if (ammount){
            terminal.setWritingDelay(ammount);
        }
        terminal.addTextToScreenQueue("Writing delay was set to " + ammount + ".");
        return;
    }
})

export const start = new Command({
    keywords: ['start', 'st'],
    execute: (words) => {
        if (!words.length) {
            terminal.writeInWarning("Start what?");
            return
        }
        if (words[0] == 'help') {
            terminal.addTextToScreenQueue(`Type START GAME to start the game\n<b class="black">The menu is currently being worked on, to start game just clear the screen and look around.\nYou can still use the help function.</b>`);
            return
        }
        if (words[0] == 'game') {
            terminal.addTextToScreenQueue("Starting game...");
            gameState.currentArea = gameState.pausedFrom;
            look.execute();
            return
        }
    }
})

export const pause = new Command({
    keywords: ['pause', 'menu'],
    execute: (words) => {
        if (words.length && words[0] == 'help'){
            terminal.addTextToScreenQueue("Takes you to the menu screen.");
            return;
        }
        if (gameState.currentArea != menu){
            gameState.pausedFrom = gameState.currentArea;
            gameState.currentArea = menu;
            clear.execute();
        } else {
            terminal.writeInWarning("You're on the menu");
        }
    }
})

export const commandList = [
    help, look, take, clear, inventory, drop, time, go, hit, place, read, climb, use, leave, enter, timeSkip, blow, speed, start, open, close, lay
]
//skip is temporarily removed