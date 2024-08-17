import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { gameState } from "../../gameState.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const tallStonesHill = new Area();

tallStonesHill.name = `tall-stones-hill`;
tallStonesHill.references = ['stones', 'hill', 'stones hill', 'stone hill'];

const ground = new Container({
    name: `ground`,
    references: ['floor', 'down'],
});
ground.getDescription = () => {
    let contentDescription = '';
    if (ground.content.length > 0 ){
        let contents = '';
        for (let i = 0; i < ground.content.length; i++) {
            if (i == 0){
                contents += 'a '  + (ground.content[i].name);
            } else {
                if (i == ground.content.length -1) {
                    contents += ' and a '  + (ground.content[i].name);
                } else {
                    contents += ', a '  + (ground.content[i].name);
                }
            }
        }
        contentDescription = ` Looking down around your feet, you notice ` + contents + `, forming a gap on the natural carpet.`;
    }
    let response = `Grass reaches up to your ankles that flow along the night.` + contentDescription;
    return response;
}
ground.lookedAt = (gameState) => {
    gameState.globalTime += 3;
}
tallStonesHill.content.push(ground);

const stones = new GameObject({
    name: 'stones',
    description: ``,
    parent: tallStonesHill.content,
    wisdomKey: 'hill stones',
})
stones.getDescription = () => {
    let dayVariables = {
        dusk: {
            '': ``,
            'sky': `dark deep sky`,
        },
        morning: {
            '': ``,
            'sky': `not yet written.`,
        },
        afternoon: {
            '': ``,
            'sky': `not yet written.`,
        },
        evening: {
            '': ``,
            'sky': `not yet written.`,
        },
    };
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `Walking up to the stones you feel their dimensions, thick dark pillars starting the hill's surface and shooting up at the `  + dayState['sky'] + ` in a steep diagonal, each with a strange symbol, none you can comprehend.`;
    return response;
}
tallStonesHill.content.push(stones);

tallStonesHill.getDescription = () => {
    let dayVariables = {
        dusk: {
            '': ``,
            'areas': `Not far from where you stand, halfway downhill you see the silluette of a tree.`,
            'wind': `A light cold breeze flows around you`,
            'light': `as the twin moons slowly reach closer to the horizon.`,
            'stones': `Around you are 4 tall stones, multiple times your size, each with a strange symbol on them.`,
        },
        morning: {
            '': ``,
            'areas': `not yet written.`,
            'wind': `not yet written.`,
            'light': `not yet written.`,
        },
        afternoon: {
            '': ``,
            'areas': `not yet written.`,
            'wind': `not yet written.`,
            'light': `not yet written.`,
        },
        evening: {
            '': ``,
            'areas': `not yet written.`,
            'wind': `not yet written.`,
            'light': `not yet written.`,
        },
    };
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `You find yourself in a grassy hill. ` + dayState['wind'] + ` ` + dayState['light'] + ` ` + dayState['stones'] + ` ` + dayState['areas'] + '\n' +ground.getDescription();
    return response;
}
tallStonesHill.lookedAt = (gameState) => {
    gameState.globalTime += 10;
}