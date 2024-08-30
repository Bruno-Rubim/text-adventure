import { findObjectGeneral } from "./commands/commands.js";
import { Item } from "./gameObjects/item.js";

export const gameState = {
    currentArea: null,
    inventory: [],
    globalTime: 239,
    lookedAt: [],
    timedEvents: [],
    weather: 'windy',
}

gameState.gainWisdom = (word) => {
    if (!gameState.lookedAt.includes(word)){
        gameState.lookedAt.push(word);
    }
}

gameState.getWisdom = () => {
    return gameState.lookedAt.length;
}

gameState.getHours = () => {
    let time = gameState.globalTime%1440;
    let hours = Math.floor(time/60);
    let minutes = (time%60);
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return(hours + ':' + minutes);
}

gameState.getDayStateBasic = () => {
    let time = gameState.globalTime%1440;
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
    let time = gameState.globalTime%1440;
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
    let time = gameState.globalTime%1440;
    if(time > 390 && time <= 1110){
        return 'day';
    }
    if(time > 1110 || time <= 390){
        return 'night';
    }
}

export const getCurrentLight = () => {
    const source = findObjectGeneral((content) => content.lightSource);
    if (source) {
        return source;
    }
    console.log(gameState.getDayStateSimple());
    return gameState.getDayStateSimple();
}

export const addTimedEvent = (event) => {
    gameState.timedEvents.push({
        triggerTime: event.time,
        eventAction: event.action
    })
    gameState.timedEvents.sort((a, b) => a.triggerTime - b.triggerTime);
}

export const checkTimedEvents = () => {
    let i = 0;
    for (let event of gameState.timedEvents){
        if (gameState.globalTime < event.triggerTime){
            break;
        }
        event.eventAction();
        i++;
    }
    gameState.timedEvents.splice(0, i);
}

const realTimeAdd = () => {
    gameState.globalTime += 1;
    checkTimedEvents();
    setTimeout(realTimeAdd, 15000);
}
realTimeAdd();