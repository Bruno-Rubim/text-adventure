import { Area } from "../area.js";
import { GameObject } from "../../gameObjects/gameObject.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { gameState, getCurrentLight } from "../../gameState.js";

export const wellLocation = new Area();

wellLocation.name = `trail`;
wellLocation.references = ['path', 'crossroad'];

const ground = new Container({
    name: `ground`,
    references: ['floor', 'down'],
    description: `tbw.`,
});
ground.getContentDescription = () => {
    let contentDescription = '';
    let response = contentDescription;
    let light = getCurrentLight();
    if (light == 'night') {
        return response;
    }
    if (ground.content.length > 0 ){
        let contents = '';
        for (let i = 0; i < ground.content.length; i++) {
            if (i == 0) {
                contents += 'a '  + (ground.content[i].referTo());
            } else {
                if (i == ground.content.length -1) {
                    contents += ' and a '  + (ground.content[i].referTo());
                } else {
                    contents += ', a '  + (ground.content[i].referTo());
                }
            }
        }
        if (gameState.getDayStateSimple() != 'day'){
            contents += ', iluminated by the ' + light.referTo();
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
wellLocation.content.push(ground);

wellLocation.getDescription = () => {
    let dayVariables = {
        night: {
            '': ``,
        },
    };
    let response = `tbw`;
    return response;
}
wellLocation.lookedAt = (gameState) => {
    gameState.globalTime += 1;
}