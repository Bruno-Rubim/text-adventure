import { voidRoom } from "./area/instances/voidRoom.js";
import { findObjectGeneral } from "./commands/commands.js";
import { Item } from "./gameObjects/item.js";

const rock = new Item({
    name: 'rock',
    description: `An oddly shaped sturdy grey rock, like a large pebble, almost taking up your entire palm. Holding it you feel like you could HIT something WITH it.`,
});
rock.canBreak = true;

export const gameState = {
    currentArea: voidRoom,
    inventory: [rock],
    globalTime: 240,
    lookedAt: [],
}
rock.parent = gameState.inventory;

gameState.gainWisdom = (word) => {
    if (!gameState.lookedAt.includes(word)){
        console.log(word + " added to wisdom");
        gameState.lookedAt.push(word);
    }
}

gameState.getWisdom = () => {
    return gameState.lookedAt.length;
}

gameState.getHours = () => {
    let time = gameState.globalTime%2400;
    let hours = (time/60).toFixed(0);
    let minutes = (time%60);
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return(hours + ':' + minutes);
}

gameState.getDayStateBasic = () => {
    let time = gameState.globalTime%2400;
    if(time > 0 && time <= 390){
        return 'dusk';
    }
    if(time > 390 && time <= 750){
        return 'morning';
    }
    if(time > 750 && time <= 1110){
        return 'afternoon';
    }
    if(time > 1110 && time <= 1440){
        return 'evening';
    }
}

gameState.getDayStateComplex = () => {
    let time = gameState.globalTime%2400;
    if(time > 60 && time <= 300){
        return 'dusk';
    }
    if(time > 300 && time <= 420){
        return 'sunrise';
    }
    if(time > 420 && time <= 660){
        return 'morning';
    }
    if(time > 660 && time <= 780){
        return 'noon';
    }
    if(time > 780 && time <= 1020){
        return 'afternoon';
    }
    if(time > 1020 && time <= 1140){
        return 'sunset';
    }
    if(time > 1140 && time <= 1380){
        return 'evening';
    }
    if(time > 1380 && time <= 60){
        return 'midnight';
    }
}

gameState.getDayStateSimple = () => {
    let time = gameState.globalTime%2400;
    if(time > 390 && time <= 1110){
        return 'day';
    }
    if(time > 1110 || time <= 390){
        return 'night';
    }
}

const realTimeAdd = () => {
    gameState.globalTime += 1;
    setTimeout(realTimeAdd, 15000);
}

export const getCurrentLight = () => {
    const source = findObjectGeneral((content) => content.lightSource);
    if (source) {
        return source;
    }
    console.log(gameState.getDayStateSimple());
    return gameState.getDayStateSimple();
}

realTimeAdd();