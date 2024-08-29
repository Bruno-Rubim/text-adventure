import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { addTimedEvent, gameState } from "../../gameState.js";
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
            'sky': `bright blue sky.`,
        },
        evening: {
            '': ``,
            'sky': `fading dark sky.`,
        },
    };
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `Walking up to the stones you feel their dimensions, thick dark pillars starting the hill's surface and shooting up at the `  + dayState['sky'] + ` in a steep diagonal, each with a strange symbol, none you can comprehend.`;
    return response;
}
tallStonesHill.content.push(stones);

const dandelion = new Item({
    name: 'sprout',
    references: ['plant', 'stem', 'flower', 'dandelion',],
    parent: ground.content,
});
delete dandelion.taken;
dandelion.growthState = 0;
dandelion.maxGrowthState = 4;
dandelion.getDescription = () => {
    let responses = [
        'Hidden between the blades of grass you notice a small single sprout.',
        'A group of leaves, all spreading from a single point on the dirt.',
        'Standing from a few leaves on the grass is a short stem.',
        'A yellow flower at the end of a stem pointing upwards.',
        'A dandelion, its fragile softness standing at the end of a tall stem, awaiting for the wind to take it away.',
    ];
    return responses[dandelion.growthState];
}
let dandelionGrowth = {
    time: gameState.globalTime + 60,
    action: () => {
        dandelionGrowth.time += 60;
        dandelion.name = dandelion.references[dandelion.growthState];
        dandelion.growthState++;
        if (dandelion.growthState < dandelion.maxGrowthState){
            addTimedEvent(dandelionGrowth);
        }
        if (dandelion.growthState == 4){
            dandelion.taken = () => {
                return "You have taken the " + dandelion.name + '.';
            };
            dandelion.blown = () => {
                addTimedEvent({time: gameState.globalTime + 1440, action: () => gameState.dandelionField = true});
                dandelion.delete();
                return "You hold the dandelion with one hand, before blowing it. Quickly becoming a small group of white particles in the air, which are soon taken by the wind.";
            }
        }
    }
}
addTimedEvent(dandelionGrowth);
ground.content.push(dandelion);

tallStonesHill.getDescription = () => {
    let dayVariables = {
        dusk: {
            '': ``,
            'windy': `The howling wind echoes in the distance, `,
            'light': `as the twin moons slowly reach closer to the horizon.`,
            'dandelion': ``,
            'stones': `Around you are 4 tall stones, multiple times your size, each with a strange symbol on them.`,
            'areas': `Not far from where you stand, halfway downhill you see the silluette of a tree.`,
        },
        morning: {
            '': ``,
            'windy': `A light breeze flows around you `,
            'light': `and the sun is up, bright and calm.`,
            'dandelion': ` All over the hill tiny puffy white balls are splattered between the grass.`,
            'stones': `Around you are 4 tall stones, multiple times your size, each with a strange symbol on them.`,
            'areas': `Not far from where you stand you can see a bent tree, its round crown bathed in sunlight.`,
        },
        afternoon: {
            '': ``,
            'windy': `The fresh wind surrounds you,`,
            'light': ` while the sun shines in the bright sky.`,
            'dandelion': ` The hill down is splattered with tiny puffy white balls.`,
            'stones': `Around you are 4 tall stones, multiple times your size, each with a strange symbol on them.`,
            'areas': `Not far from where you stand you can see a tree, casting a small shadow around itself.`,
        },
        evening: {
            '': ``,
            'windy': `not yet written.`,
            'light': `not yet written.`,
            'dandelion': ``,
            'stones': `Around you are 4 tall stones, multiple times your size, each with a strange symbol on them.`,
            'areas': `Not far from where you stand you can see a tree, a big round crown on top of its twisted trunk.`,
        },
    };
    let fieldState = '';
    if (gameState.dandelionField){
        fieldState = 'dandelion';
    }
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `You find yourself in a grassy hill. ` + dayState[gameState.weather] + ` ` + dayState['light'] + ` ` + dayState[fieldState] + ` ` + dayState['stones'] + ` ` + dayState['areas'] + '\n' +ground.getDescription();
    return response;
}
tallStonesHill.lookedAt = (gameState) => {
    gameState.globalTime += 10;
}