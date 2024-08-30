import { GameObject } from "./gameObject.js";

export class Item extends GameObject {
    constructor({name = '', references = [name], description = '', parent = null, color = "white"}){
        super({
            name: name,
            references: references,
            description: description,
            parent: parent,
            color: color,
        })
        this.everTaken = false;
        this.cathergories['type'] = 'item';
        this.taken = () => {
            let response = `You have taken the ` + this.referTo() + `.`;
            return response;
        }
    }
}