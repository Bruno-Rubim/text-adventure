import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const townCenter = new Area({
    name: 'town center',
});
townCenter.description = `A tall stone obelisk stands in the very middle of the area, surrounded by a short wall. Various paths surround it, one going downhill to a wooden cabin, another to a small group of houses and another far uphill to a stone church`;

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Ground description.`});

townCenter.startWith([ground]);