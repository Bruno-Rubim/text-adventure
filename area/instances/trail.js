import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { gameState, getCurrentLight } from "../../gameState.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const trail = new Area();

trail.name = `trail`;
trail.references = ['path', 'crossroad'];

const ground = new Container({
    name: `ground`,
    references: ['floor', 'down'],
    description: `A slender path of dirt.`,
});
ground.getContentDescription = () => {
    let contentDescription = '';
    let response = contentDescription;
    if (getCurrentLight() == 'night') {
        return response;
    }
    if (ground.content.length > 0 ){
        let contents = '';
        for (let i = 0; i < ground.content.length; i++) {
            if (i == 0) {
                contents += 'a '  + (ground.content[i].name);
            } else {
                if (i == ground.content.length -1) {
                    contents += ' and a '  + (ground.content[i].name);
                } else {
                    contents += ', a '  + (ground.content[i].name);
                }
            }
        }
        contentDescription = ` Off to the side of the path you can make out ` + contents + `.`;
    }
    response = contentDescription;
    return response;
}
ground.getDescription = () => {
    let response = ground.description + ground.getContentDescription();
    return response;
}
ground.lookedAt = (gameState) => {
    gameState.globalTime += 1;
}
trail.content.push(ground);

trail.getDescription = () => {
    let dayVariables = {
        night: {
            '': ``,
            'light': `walking in the darkness.`,
            'cabin': `goes into the darkness, where not too far off a small smudge of light can be seen.`,
        },
    };
    let wellPath = '';
    let dayState = dayVariables[gameState.getDayStateSimple()];
    if (getCurrentLight() != 'night'){
        wellPath = '\nOff to another side you can make out a faded diversion on the path, where grass has grown over its markings'
        if (getCurrentLight == 'day'){
            wellPath += ' pointing to a near well'
        }
        wellPath += '.'
    }
    let response = `You're on a trail in the grass, ` + dayState['light'] + ground.getContentDescription() + ` One side leads up to a tree on a small hill, the other ` + dayState['cabin'] + wellPath;
    return response;
}
trail.lookedAt = (gameState) => {
    gameState.globalTime += 1;
}