import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const areaName = new Area();
areaName.description = `Description.`;

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Ground description.`});

areaName.startWith([ground]);