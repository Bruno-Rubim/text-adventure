import { GameObject } from "./gameObject.js";

export class Item extends GameObject {
    constructor({name = '', references = [name], description = '', parent = null}){
        super({
            name: name,
            references: references,
            description: description,
            parent: parent,
        })
        this.everTaken = false;
        this.taken = () => {
            return "You have taken the " + this.name + '.';
        }
    }
}