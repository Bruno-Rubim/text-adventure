import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const houseOutside = new Area({
    name: 'house',
});
houseOutside.description = `You've seen all there is for now. More is to come, hopefully soon`;

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Why are you looking down? I said there is nothing more.`});

houseOutside.startWith([ground]);