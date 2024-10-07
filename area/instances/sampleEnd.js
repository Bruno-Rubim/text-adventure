import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const sampleEnd = new Area({
    name: 'end',
});
sampleEnd.description = `You've seen all there is for now. More is to come, hopefully soon.`;

sampleEnd.getDescription = () => {
    return sampleEnd.description;
}

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Why are you looking down? I said there is nothing more.`});

sampleEnd.startWith([ground]);