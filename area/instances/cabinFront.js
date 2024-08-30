import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { gameState, getCurrentLight } from "../../gameState.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const cabinFront = new Area();

cabinFront.name = `cabin front`;
cabinFront.references = ['light', 'cabin', 'cabin outside', 'outside'];
const ground = new Container({
    name: `ground`,
    references: ['floor', 'down'],
    description: `A mix between grass and dirt covers the front of the cabinOutside`,
});
ground.getContentDescription = () => {
    let contentDescription = '';
    if (getCurrentLight() != 'night'){
        if (ground.content.length > 0 ){
            let contents = '';
            for (let i = 0; i < ground.content.length; i++) {
                if (i == 0){
                    contents += 'a '  + (ground.content[i].referTo());
                } else {
                    if (i == ground.content.length -1) {
                        contents += ' and a '  + (ground.content[i].referTo());
                    } else {
                        contents += ', a '  + (ground.content[i].referTo());
                    }
                }
            }
            contentDescription = `, with ` + contents + ` resting on it.`;
        }
    }
    let response = contentDescription;
    return response;
}
ground.getDescription = () => {
    let contentDescription = ground.getContentDescription();
    let response = ground.description + contentDescription + '.';
    return response;
}
ground.lookedAt = (gameState) => {
    gameState.globalTime += 1;
}
cabinFront.content.push(ground);

const hook = new Container({
    name: 'hook',
    description: `A worn rusty metal hook, hanging above the cabin's door`,
    limit: 1,
})
hook.getContentDescription = () => {
    let contentDescription = '';
    if (hook.content.length > 0 ){
        contentDescription = ` holds up a ` + hook.content[0].referTo();
    }
    return contentDescription;
}
hook.getDescription = () => {
    let description = hook.description + hook.getContentDescription() + '.';
    return description;
}
cabinFront.content.push(hook);

const lantern = new Item({
    name: 'lantern',
    description: 'An old looking lantern, inside the glass a orange rock glows, illuminating your immediate surroundings. From it a faint warmth can be felt when touching its glass chaimber.',
    parent: hook.content,
    color: 'orange',
});
lantern.lightSource = true;
hook.content.push(lantern);

cabinFront.getDescription = () => {
    let dayVariables = {
        dusk: {
            '': ``,
        },
    };
    let lightVariable = '';
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `You're standing outside a wooden cabin. In front of it only a dirt trail that goes towards a hill in the distance. ` + hook.getDescription();
    return response;
}
cabinFront.lookedAt = (gameState) => {
    gameState.globalTime += 3;
}