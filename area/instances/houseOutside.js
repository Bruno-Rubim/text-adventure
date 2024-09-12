import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const houseOutside = new Area();
houseOutside.description = `Description.`;

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Ground description.`});

houseOutside.startWith([ground]);