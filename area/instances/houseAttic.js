import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { GameObject } from "../../gameObjects/gameObject.js";
import { Item } from "../../gameObjects/item.js";
import { gameState } from "../../gameState.js";

export const houseAttic = new Area({
    name: 'attic',
    references: ['hatch', 'ceiling', 'ceiling hatch', 'inside']
});
houseAttic.getDescription = () => {
    let currentLight = gameState.getCurrentLight();
    const descriptionVariables = {
        'light' : {
            'day' : `From between the wooden boards the sunlight reveals the little it can of the confined space.`,
            'night' : `The moonlight smears around the barely visible are from within the wooden boards above.`,
            'lantern' : `The small space is illuminated by an orange glow.`,
        }
    }
    let description = `You're inside the attic, a low ceiling keeps your back bent. ` + descriptionVariables['light'][currentLight] + ' ' + floor.getContentDescription();
    return description;
}

const ceiling = new Container({name: 'ceiling', references:['sky', 'up'], description:`There's a hatch on the ceiling`});

const floor = new Container({name: 'floor', references:['ground', 'down'], description:`The boards that were the ceiling now hold your weight.`});
floor.getContentDescription = () => {
    let response = '';
    if (floor.content.length == 0){
        return response;
    }
    response += `There's`
    for (let i = 0; i < floor.content.length; i++) {
        if (i == 0){
            response += ' a '  + (floor.content[i].referTo());
        } else {
            if (i == floor.content.length -1) {
                response += ' and a '  + (floor.content[i].references);
            } else {
                response += ', a '  + (floor.content[i].references);
            }
        }
    }
    response += ' on the floor.';
    return response;
}
floor.getDescription = () => {
    return floor.description + ' ' + floor.getContentDescription();
}

const lantern = new Item({
    name: 'lantern',
    description: 'An old looking lantern, inside the glass a orange rock glows, illuminating your immediate surroundings. From it a faint warmth can be felt when touching its glass chaimber.',
    parent: floor.content,
    color: 'orange',
});    
lantern.lightSource = true;

floor.content.push(lantern);

const hatch = new GameObject({name: 'hatch', references: ['ceiling hatch'], description: 'Looking through the hatch you can see the inside of the house.'});

houseAttic.startWith([floor, ceiling, hatch]);