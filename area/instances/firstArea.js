import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { Lock } from "../../gameObjects/lock.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const startingRoom = new Area();
startingRoom.description = `You're in a small room, there's a makeshift bed against a wall, a door on the opposite side and a window in another wall over a wooden desk.`;

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

const door = new Lock({name: 'house door', key: houseKey, references: ['door'], unlockDescription: `Putting the key on the door lock and clicking it in place the door is now unlocked. You're able to go outside.`});

const hatch = new GameObject({name: 'ceiling hatch', references: ['hatch'], description: 'A hatch in the ceiling, a small string hangs from it but it seems to high to reach.'});

const desk = new Container({name: 'desk', references: ['wooden desk'], description: `A wodden desk with a drawer, the rough boards seem worn with time.`});

startingRoom.startWith([desk, drawer, ground, ceiling, door, hatch]);