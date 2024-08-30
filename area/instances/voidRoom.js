import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { Lock } from "../../gameObjects/lock.js";
import { GameObject } from "../../gameObjects/gameObject.js";
import { tallStonesHill } from "./tallStonesHill.js";
import * as terminal from "../../screen/terminal.js"
import { gameState } from "../../gameState.js";

export const voidRoom = new Area();
voidRoom.name = `void-room`;

terminal.addTextToScreenQueue(`When unsure where you are, <b class=" command">look around</b>.`);

const tutorial = {
    stepsDone: [],
    lookAround: ' Your eyes struggle to focus on anything until a black <b class="white">table</b> comes into view.\nYou can <b class="command">look</b> at <b class="white">table</b>.',
    hitGem: '\nYou can <b class="command">check</b> your <b class="command">inventory</b> to see if you have anything useful.',
};
const advanceTutorial = (step) => {
    if (!tutorial.stepsDone.includes(step)) {
        tutorial.stepsDone.push(step);
        return tutorial[step];
    }
    return '';
}

const ground = new Container({
    name: 'ground',
    references: ['floor', 'down'],
    description: `Looking down at your feet you can barely make out any phisical substance that holds you standing, just more empty space.`,
    parent: voidRoom.content
});
ground.getDescription = () => {
    let response = ground.description;
    if (ground.content.length == 0){
        return response;
    }
    response += ' You see'
    for (let i = 0; i < ground.content.length; i++) {
        if (i == 0){
            response += ' a '  + (ground.content[i].referTo());
        } else {
            if (i == ground.content.length -1) {
                response += ' and a '  + (ground.content[i].referTo());
            } else {
                response += ', a '  + (ground.content[i].referTo());
            }
        }
    }
    response += ' in place.'
    return response;
}
voidRoom.content.push(ground);

const above = new Container({
    name: 'sky',
    references: [`sky`, 'up', 'moon', 'moons', 'sun', 'above'],
    description: `Looking up above you a feeling of disorientation immediately starts washing over you, seeing nothing but the lack of things makes you feel like you're about to fall at any second.\nYou look back around you to realize you're not falling, at least not yet.`,
});
voidRoom.content.push(above);

const abyss = new GameObject({
    name: 'abyss',
    references: [`abyss`, 'doorway'],
    description: `A black rectangular shape stares back at you, the apparent lack of anything seems to pull you, inviting you to <b class="white">go</b> into it.`,
    color: 'black',
});

const hole = new Lock({
    name: `hole`,
    references: ['slot', 'floor'],
    description: `An oddly shapped hole, a little smaller than your hand, half as deep as it is wide. You could probably <b class="white">place</b> something in it`, 
    key: 'rock', 
    failedUnlockDescription: `It doesn't fit`,
    parent: voidRoom.content,
});
hole.placed = (item) => {
    let resultDescription = hole.failedUnlockDescription;
    let unlocked = false;
    if (item.name == hole.key){
        unlocked = true;
        resultDescription = hole.unlockDescription;
        voidRoom.content.push(abyss);
        voidRoom.neighbourAreas = [{
            areaObject: tallStonesHill,
            distance: 0,
            references: [`outside`, `abyss`, 'doorway', 'out'],
            description: `You step into the abyss, where your feet expected to find some ground instead it meets nothing. Your body falls helplessly into the darkness. No light meets your eye but you feel the force of falling pushing you down, faster and faster, like the abyss is hungry for your being.`
        }];
    }
    return [unlocked, resultDescription];
}
const outline = new GameObject({
    name: 'outline',
    references: ['outline'],
    description: `A black rectangular outline standing on nothing, like a series of slits on space itself. Listening close, quiet drowning whispers can be heard coming from its gaps. In the very middle you notice a small ` + hole.referTo() + `.`,
    color: 'white',
    parent: hole.content,
})
const gaps = new GameObject({
    name: 'gaps',
    description: `You try looking through the gaps, but all you see is pitch black.`,
    parent: hole.content,
})
hole.content.push(outline, gaps);
hole.unlockDescription = `You pick up the rock again and put it on the hole. Right before it touches the cavity, a strange force pulls it from your hand, clicking it in place. The dark ` + outline.referTo() + ` fills with an empty black void, swallowing the hole and becoming a doorway to the ` + abyss.referTo() + `.`;

const table = new Container({
    name: `table`,
    description: `A table made of smooth dark limestone, its dimensions are thick and its surface perfectly cut.`,
    content: [],
    parent: voidRoom.content,
});
table.getDescription = () => {
    let response = table.description;
    if (table.content.length == 0){
        return response;
    }
    response += ' You see'
    for (let i = 0; i < table.content.length; i++) {
        if (i == 0){
            response += ' a '  + (table.content[i].referTo());
        } else {
            if (i == table.content.length -1) {
                response += ' and a '  + (table.content[i].referTo());
            } else {
                response += ', a '  + (table.content[i].referTo());
            }
        }
    }
    response += ' on it.'
    return response;
}

const rock = new Item({
    name: 'rock',
    description: `An oddly shaped sturdy grey rock, like a large pebble, almost taking up your entire palm. Holding it you feel like you could <b class="white">hit</b> something <b class="white">with</b> it.`,
    references: ['pebble']
});
rock.canBreak = true;
rock.parent = gameState.inventory;
gameState.inventory.push(rock);

const gem = new Item({
    name: 'gem',
    references: ['gem', 'crystal'],
    description: `A gem made of clear crystal. Looking through it, light waves are refracted in colorful bright shades within its inside. It looks fragile, like it might shatter if you <b class="white">hit</b> it.`,
    parent: table.content,
});
gem.hitDescription = `You try hitting it with your hands but nothing happens to it. Maybe if it's hit with something sturdier and less afraid of pain something different would happen.`
gem.broken = () => {
    voidRoom.content.push(hole);
    rock.cathergories['color'] = 'cyan';
    rock.description = `An oddly shaped sturdy gray rock with a <b class="cyan">sprial symbol</b>. It doesn't move but you can feel its silent pleas to perish.`
    gem.delete();
    return `You pick the gem up with one hand and the rock with the other. Without hesitation you smash both together. \nThe noise of the crystal shattering pierces within your head, what was once shining safely in your hands is now a scattered dozen fragments that quickly evaporate out of view. Something was etched on the ` + rock.referTo()+ `.\n\nOn the opposite side of the table, a rectangular ` + outline.referTo() + ` forms seemingly standing on thin air, with a ` + hole.referTo() + ` in the middle of it.`;
};
gem.hit = (weapon) => {
    let result = gem.hitDescription;
    result += advanceTutorial('hitGem');
    if (weapon.canBreak){
        result = gem.broken();
    }
    return result;
}
table.content.push(gem);

voidRoom.content.push(table);
let firstLook = true;
voidRoom.description = `You're in an empty space.`;
voidRoom.getDescription = () =>{
    let response = voidRoom.description;
    response += advanceTutorial('lookAround');
    if (firstLook){
        firstLook = false;
        return response;
    }
    response += ` There's a black ` + table.referTo() +` in front of you`
    if (voidRoom.content.includes(hole)){
        response += `, and behind it a black ` + outline.referTo() +``;
    }
    response += `.`
    return response;
}

gameState.currentArea = voidRoom;