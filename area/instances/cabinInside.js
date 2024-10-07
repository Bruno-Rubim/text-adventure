import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { Lock } from "../../gameObjects/lock.js";
import { GameObject } from "../../gameObjects/gameObject.js";
import { AreaConnection } from "../areaConnection.js";
import { cabinAttic } from "./cabinAttic.js";
import { go } from "../../commands/commands.js";
import { cabinOutside } from "./cabinOutside.js";
import { gameState } from "../../gameState.js";
import { sampleEnd } from "./sampleEnd.js";

export const cabinInside = new Area({
    name: 'cabin'
});
cabinInside.description = `You're in a small room, there's a makeshift bed against a wall, a door on the opposite side and a window in another wall over a wooden desk.`;

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Wood floorboards.`});
const ceiling = new Container({name: 'ceiling', references:['sky', 'up'], description:`There's a hatch on the ceiling`});

const cabinKey = new Item({name: 'cabin key', references:['key'], description: 'A small metalic key.', color: 'yellow'});

const drawer = new Container({name: 'drawer', description: 'A small drawer with a simple handle.'});
drawer.getDescription = () => {
    let response = drawer.description;
    if (drawer.content.length == 0){
        return response;
    }
    response += ' Inside it there is'
    for (let i = 0; i < drawer.content.length; i++) {
        if (i == 0){
            response += ' a '  + (drawer.content[i].referTo());
        } else {
            if (i == drawer.content.length -1) {
                response += ' and a '  + (drawer.content[i].references);
            } else {
                response += ', a '  + (drawer.content[i].references);
            }
        }
    }
    response += '.';
    return response;
}
drawer.startWith([cabinKey]);

const door = new Lock({
    name: 'cabin door',
    key: cabinKey, references: ['door'],
    description: `A heavy wooden door, a faded pale hue forming a jagged shape that fits well enough on its frame.`,
    unlockDescription: `Putting the key on the door lock and clicking it in place the door is now unlocked. You're able to go outside.`
});
door.opened = (key) => {
    if (key) {
        return door.placed(key);
    }
    return `You try pulling on the doornob but it won't move, it seems to be locked.`;
}
door.placed = (item) => {
    let resultDescription = `You try to fit the ` + item.name + ` but it doesn't quite work.`;
    let unlocked = false;
    if (item.name == door.key.name) {
        cabinInside.neighbourAreas.push(
            new AreaConnection({
                areaObject: sampleEnd,
                distance: 2,
                references: ['outside', 'door'],
                description: `You open the door and step outside.`
            })
        )
        unlocked = true;
        resultDescription = door.unlockDescription;
        door.placed = null;
        door.opened = null;
    }
    return [unlocked, resultDescription];
}

const window = new GameObject({name: 'window', references: ['shudders'], description: 'A window, covered by wooden shudders.'});
window.state = 'closed';
window.opened = () => {
    if (window.state == 'opened'){
        return `The window is already open.`;
    }
    window.state = 'opened';
    window.description = `An open window. Looking out of it you can see a grass patch of land, shortly blocked by a tall stone wall that seems to go from edge to edge outside of your view.`;
    return window.getDescription();
}
window.closed = () => {
    if (window.state == 'closed'){
        return `The window is already closed.`;
    }
    window.state = 'closed';
    window.description = `A window, covered by wooden shudders.`;
    return `You push the shuuders back, closing the window.`
}
window.getDescription = () => {
    let response = window.description;
    let dayState = gameState.getDayStateSimple();
    const descriptionVariables = {
        'closed' : {
            'light' : {
                'day' : `From within the planks small rays of sunlight are visible.`,
                'night' : `You can feel it shake slightly from the wind.`,
            }
        },
        'opened' : {
            'light' : {
                'day' : `You can hear the distand sound of nature, trees and birds.`,
                'night' : `All bathed in moonlight, while the wind howls through all if it.`,
            }
        },
    }
    return response + ' ' + descriptionVariables[window.state]['light'][dayState];
}
const desk = new Container({name: 'desk', references: ['wooden desk'], description: `A wooden desk with a drawer, the rough boards seem worn with time.`});
desk.climbed = () => {
    desk.climbedOn = true;
    hatch.description = `A hatch in the ceiling, a small string hangs from it.`;
    let response = `You climbed on top of the desk.`;
    gameState.playerPosition = 'climbed desk';
    cabinInside.neighbourAreas.push(new AreaConnection({
        areaObject: cabinAttic,
        references: ['hatch', 'ceiling', 'ceiling hatch', 'inside'],
        distance: 2,
        description: `From atop the desk you climb through the hatch into the attic.`,
    }));
    hatch.description = `A square hatch on the ceiling, leading to a barely lit space.`;
    if (!hatch.everSeen){
        response += ` You can see a hatch in the ceiling with small string hanging from it.`;
        hatch.everSeen = true;
    }
    return response;
}

const hatch = new GameObject({name: 'ceiling hatch', references: ['hatch'], description: 'A hatch in the ceiling, a small string hangs from it but it seems to high to reach.'});
hatch.opened = () => {
    if (desk.climbedOn){
        return `You reach for the string and pull it down, opening the hatch on the ceiling.`;
    } else {
        return `It's too high to reach.`;
    }
}
hatch.climbed = () => {
    if (desk.climbedOn){
        cabinInside.neighbourAreas.push(new AreaConnection({
            areaObject: cabinAttic,
            references: ['hatch', 'ceiling', 'ceiling hatch', 'inside'],
            distance: 2,
            description: `From atop the desk you climb through the hatch into the attic.`,
        }));
        hatch.description = `A square hatch on the ceiling, leading to a barely lit space.`;
        go.execute(['hatch']);
    } else {
        return `It's too high to reach.`;
    }
}

const bed = new Container({name: 'makeshift bed', references: ['bed'], description: `A big cloth covering a bundle of whool and hay and other fabrics. You feel a warm comfort from its messy arrangement.`})
bed.layedOn = () => {
    gameState.globalTime += 150;
    let response = `You lay down in the makeshift bed.\n\n_Your eyes dart around the room.\n\n__You stare at the ceiling boards`;
    if (!hatch.everSeen){
        response += `, and notice the hatch on it`;
    }
    return response + '.';
}

const wall = new GameObject({name: 'wall', description: 'A wooden wall, just as most things around. Its planks run from side to side, each with its own deformities, cracks and imperfections.'});

cabinInside.startWith([desk, drawer, ground, ceiling, door, hatch, bed, window, wall]);