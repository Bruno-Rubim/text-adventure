import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { Lock } from "../../gameObjects/lock.js";
import { GameObject } from "../../gameObjects/gameObject.js";
import { AreaConnection } from "../areaConnection.js";
import { houseAttic } from "./houseAttic.js";
import { go } from "../../commands/commands.js";
import { houseOutside } from "./houseOutside.js";
import { gameState } from "../../gameState.js";

export const houseInside = new Area({name: 'house'});
houseInside.description = `You're in a small room, there's a makeshift bed against a wall, a door on the opposite side and a window in another wall over a wooden desk.`;

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Wood floorboards.`});
const ceiling = new Container({name: 'ceiling', references:['sky', 'up'], description:`There's a hatch on the ceiling`});

const houseKey = new Item({name: 'house key', references:['key'], description: 'A small metalic key.', color: 'yellow'});

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
drawer.startWith([houseKey]);

const door = new Lock({
    name: 'house door',
    key: houseKey, references: ['door'],
    description: `A heavy wooden door.`,
    unlockDescription: `Putting the key on the door lock and clicking it in place the door is now unlocked. You're able to go outside.`
});
door.opened = () => {
    return `You try pulling on the doornob but it won't move, it seems to be locked.`;
}
door.placed = (item) => {
    let resultDescription = `You try to fit the ` + item.name + ` but it doesn't quite work.`;
    let unlocked = false;
    if (item.name == door.key.name) {
        houseInside.neighbourAreas.push(
            new AreaConnection({
                areaObject: houseOutside,
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

const window = new GameObject({name: 'window', description: 'A window, covered by wooden shudders.'});
window.state = 'closed';
window.opened = () => {
    if (window.state == 'opened'){
        return `The window is already open.`;
    }
    window.state = 'opened';
    window.description = `An open window. Looking out of it you can see a grass patch of land, shortly blocked by a tall stone wall that seems to go from edge to edge outside of your view.`;
    return `You pull the shudders, opening the window. Looking out of it you can see a grass patch of land, shortly blocked by a tall stone wall that seems to go from edge to edge outside of your view.`
}
window.closed = () => {
    if (window.state == 'closed'){
        return `The window is already closed.`;
    }
    window.state = 'closed';
    window.description = `A window, covered by wooden shudders.`;
    return `You push the shuuders back, closing the window.`
}

const desk = new Container({name: 'desk', references: ['wooden desk'], description: `A wodden desk with a drawer, the rough boards seem worn with time.`});
desk.climbed = () => {
    desk.climbedOn = true;
    hatch.description = `A hatch in the ceiling, a small string hangs from it.`;
    let response = `You climbed on top of the desk.`;
    if (!hatch.everSeen){
        response += ` You can see a hatch in the ceiling with small string hanging from it.`;
        hatch.everSeen = true;
    }
    return response;
}

const hatch = new GameObject({name: 'ceiling hatch', references: ['hatch'], description: 'A hatch in the ceiling, a small string hangs from it but it seems to high to reach.'});
hatch.opened = () => {
    if (desk.climbedOn){
        houseInside.neighbourAreas.push(new AreaConnection({
            areaObject: houseAttic,
            distance: 2,
            description: `From atop the desk you climb through the hatch into the attic.`,
        }));
        hatch.climbed = () => {
            go.execute(['hatch']);
        }
        hatch.description = `A square hatch on the ceiling, leading to a barely lit space.`;
        return `You reach for the string and pull it down, opening the hatch on the ceiling.`;
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


houseInside.startWith([desk, drawer, ground, ceiling, door, hatch, bed, window]);