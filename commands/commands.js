import { tallStonesHill } from "../area/instances/tallStonesHill.js";
import { voidRoom } from "../area/instances/voidRoom.js";
import { sky } from "../gameObjects/sky.js";
import { gameState } from "../gameState.js";
import * as terminal from "../screen/terminal.js";

class Command {
    constructor({ keywords, execute}){
        this.keywords = keywords;
        this.execute = execute;
    }
}

const findObjectArea = (container, condition) => {
    if (container.content != null){
        for (let i = 0; i < container.content.length; i++) {
            if (condition(container.content[i])){
                return container.content[i];
            }
        }
        for (let i = 0; i < container.content.length; i++) {
            let innerContainer = findObjectArea(container.content[i], condition);
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
    let found = findObjectArea(gameState.currentArea, condition);
    if (!found) {
        found = findObjectInventory(condition);
    }
    if (!found) {
    }
    return found;
}

const findNeighbourtArea = (condition) => {
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
    let words = [...originalWords];
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

export const look = new Command({
    keywords: ['look', 'inspect', 'check', 'examine', 'l', 'x'],
    execute: (words) => {
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
            if (words[0] == 'sky'){
                target = sky;
            } else {
                solvedWords = solveWords(words, findObjectArea);
                target = solveWords[0];
                if (!target) {
                    terminal.writeInWarning('No ' + words[0] + ' was found');
                    return;
                }
                go.execute(words);
                look.execute(words);
                return;
            }
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
        terminal.writeInScreen(target.getDescription());
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
        terminal.writeInScreen(target.taken());
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
        let name = target.name[0].toUpperCase() + target.name.substring(1);
        if (!target.placed) {
            terminal.writeInWarning(name + ` can't contain items`);
            return;
        }
        if (!target.content.length > target.limit) {
            terminal.writeInWarning(name + ` can't hold more items`);
            return;
        }
        let subject = solvedWords[0];
        if (!subject) {
            terminal.writeInWarning(`No matching subject`);
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
        terminal.writeInScreen(result);
        return;
    }
});

export const inventory = new Command({
    keywords: ['inventory', 'inventry', 'i'],
    execute: (words) => {
        if (gameState.inventory.length == 0){
            terminal.writeInScreen('Your inventory is empty.');
            return
        }
        let text = 'You have:';
        for(let i = 0; i < gameState.inventory.length; i++){
            let itemName = gameState.inventory[i].name;
            itemName = itemName[0].toUpperCase() + itemName.substring(1);
            text += '\n' + (itemName)
        }
        terminal.writeInScreen(text);
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
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++){
                words[0] += ' ' + words[i];
            }
        }
        let target = findObjectInventory(words[0]);
        if (target){
            let ground = findObjectGeneral('ground');
            target.moveTo(ground.content);
            terminal.writeInScreen('You placed the ' + words[0] + ' is on the ground.');
            return;
        }
        terminal.writeInWarning('You have no ' + words + '.');
    }
});

export const clear = new Command({
    keywords: ['clear', 'c'],
    execute: (words) => {
        if (words.length == 0){
            terminal.screenText.value = '';
        }
    }
});

export const time = new Command({
    keywords: ['time', 'hours', '5'],
    execute: (words) => {
        if (words.length == 0){
            terminal.writeInScreen('It is ' + gameState.getHours(gameState.globalTime));
        }
    }
});

export const go = new Command({
    keywords: ['go', 'enter', 'move', 'walk', 'travel', 'g'],
    execute: (words) => {
        const reference = words.toString().replace(",", " ");
        if (words.length == 0) {
            terminal.writeInWarning('Go where?');
            return;
        }
        if (!gameState.currentArea.neighbourAreas.length > 0){
            terminal.writeInWarning('There is nowhere to go');
            return;
        }
        const solvedWords = solveWords(words, findNeighbourtArea);
        const target = solvedWords[0];
        if (!target){
            terminal.writeInWarning('No ' + reference + ' was found');
            return;
        }
        terminal.writeInScreen(target.description);
        gameState.currentArea = target.areaObject;
        gameState.globalTime += target.distance;
        if (!target.everSeen){
            look.execute([]);
        }
    }
});

export const hit = new Command({
    keywords: ['hit', 'smash', 'attack', 'break', 'h'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Hit what?');
            return;
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
                terminal.writeInScreen(response);
                return ;
            }
            terminal.writeInWarning(`You can't hit either.`);
            return;
        }
        if (!object1.hit) {
            terminal.writeInWarning(`You can't hit ` + object1.name);
            return;
        }
        findObjectGeneral(words[0]);
        terminal.writeInScreen(object1.hit('nothing'));
        return;
    }
});

export const skip = new Command({
    keywords: ['skip'],
    execute: () => {
        if (gameState.currentArea == voidRoom){
            gameState.inventory = [];
            gameState.currentArea = tallStonesHill;
            terminal.writeInWarning('You skipped the tutorial');
            clear.execute('');
            look.execute('');
            return;
        }
        terminal.writeInWarning(`You're not in the tutorial`);
        return;
    }
})

export const read = new Command({
    keywords: ['read', 'r'],
    execute: (words) => {
        if (words.length == 0) {
            terminal.writeInWarning('Read what?');
            return;
        }
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++){
                words[0] += ' ' + words[i];
            }
        }
        let target = findObjectGeneral(words);
        if (!target){
            terminal.writeInWarning(`No ` + words[0] + ` was found`);
            return;
        }
        if (!target.read){
            terminal.writeInWarning(`You can't read ` + words);
            return;
        }
        terminal.writeInScreen(target.read());
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
            terminal.writeInWarning(`You can't climb the` + target.name);
            return;
        }
        terminal.writeInScreen(target.climbed());
        return
    }
})

export const leave = new Command({
    keywords: ['leave'],
    execute: (words) => {
        if (words.length == 0) {
            go.execute('outside');
        }
        return
    }
})

export const use = new Command({
    keywords: ['use', 'u'],
    execute: (words) => {
        terminal.writeInWarning(`What do you mean by 'use'?`);
        return
    }
})

export const commandList = [
    look, take, clear, inventory, drop, time, go, hit, place, skip, read, climb, use, leave
]