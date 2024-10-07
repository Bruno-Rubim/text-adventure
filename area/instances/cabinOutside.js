import { Area } from "../area.js";
import { Container } from "../../gameObjects/container.js";
import { Item } from "../../gameObjects/item.js";
import { GameObject } from "../../gameObjects/gameObject.js";

export const cabinOutside = new Area({
    name: 'cabin',
});
cabinOutside.description = `You're standing outside of a simple wooden cabin. Going out from it is a path that leads uphill to a tall obelisk not too far.`;

cabinOutside.getDescription = () => {
    return cabinOutside.description;
}

const ground = new Container({name: 'ground', references:['floor', 'down'], description:`Ground description.`});

cabinOutside.startWith([ground]);