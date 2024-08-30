import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { gameState, getCurrentLight } from "../../gameState.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const cabinInside = new Area();

cabinInside.name = `cabin inside`;
cabinInside.references = ['inside', 'cabin', 'inside cabin'];
const ground = new Container({
    name: `ground`,
    references: ['floor', 'down'],
    description: `Creaking floorboards worn with time`,
});
ground.getContentDescription = () => {
    let contentDescription = '';
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
        contentDescription = `, with ` + contents + ` laying on them.`;
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
cabinInside.content.push(ground);

const ceiling = new GameObject({
    name: 'ceiling',
    description: 'tbw',
    references: ['up', 'above', 'ceiling', 'moon', 'moons', 'sun'],
})
ceiling.getDescription = () => {
    return response;
}

cabinInside.getDescription = () => {
    let dayVariables = {
        dusk: {
            '': ``,
        },
    };
    let lightVariable = '';
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `Inside the cabin`;
    return response;
}
cabinInside.lookedAt = (gameState) => {
    gameState.globalTime += 3;
}