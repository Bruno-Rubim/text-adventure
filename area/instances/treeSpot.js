import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { gameState, getCurrentLight } from "../../gameState.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const treeSpot = new Area();

treeSpot.name = `tree-spot`;
treeSpot.references = ['tree'];
const ground = new Container({
    name: `ground`,
    references: ['floor', 'down'],
    description: `Stepping around you feel the serene grass sucumbing to your feet.`,
});
ground.getContentDescription = () => {
    let contentDescription = '';
    let response = contentDescription;
    if (getCurrentLight() == 'night'){
        return response;
    }
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
        contentDescription = `Looking at the ground, you can see ` + contents + `.`;
    }
    response = contentDescription;
    return response;
}
ground.getDescription = () => {
    let response = ground.description + ' ' + ground.getContentDescription();
    return response;
}
ground.lookedAt = (gameState) => {
    gameState.globalTime += 1;
}
treeSpot.content.push(ground);

const oldBook = new Item({
    name: 'old book',
    description: `An old looking book, the cover seems to be made of bark with a rough texture. The pages are thick, worn and dirty.`,
    references: ['book'],
    color: 'red',
    parent: ground.content,
});
oldBook.read = () => {
    let timeToRead = 0;
    let readResult = `Its pages are filled mostly with strange symbols, but none of which you can comprehend.`;
    if (gameState.getWisdom() >= 5){
        readResult = `From the large collection of symbols that fills its pages, you can barely make out the words "think" and "breathe"\nWisdom level at: ` + gameState.getWisdom();
        timeToRead = 3;
    }
    gameState.globalTime += timeToRead;
    return readResult;
}
ground.content.push(oldBook);

const tree = new GameObject({
    name: `tree`,
    description: `A large tree, held up by a thick trunk that bends from one side to another before going up, where its branches and leaves expand out and upwards, forming its wide round crown.`,
    wisdomKey: 'round-tree',
});
tree.climbed = () => {
    return 'You try to climb the tree, but the trunk has little to no places to hold onto, and its branches are too high for you to grab on.';
}
tree.lookedAt = (gameState) => {
    gameState.globalTime += 2;
}
treeSpot.content.push(tree);

treeSpot.getDescription = () => {
    let dayVariables = {
        dusk: {
            '': ``,
            'light': `even with the faint lunar light you can still make out its shadow tainting the ground.`,
            'trail': `mostly swallowed by darkness`,
        },
    };
    let dayState = dayVariables[gameState.getDayStateBasic()];
    let response = `You're under a big tree, ` + dayState['light'] + ` ` + ground.getContentDescription() + `\nFrom behind the tree you can make out a trail going downhill, ` + dayState['trail'];
    return response;
}
treeSpot.lookedAt = (gameState) => {
    gameState.globalTime += 3;
}