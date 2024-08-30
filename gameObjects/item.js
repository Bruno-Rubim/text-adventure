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
        this.cathergories.push['item'];
        this.taken = () => {
            let response = `You have taken the ` + this.referTo() + `.`;
            console.log(response);
            return response;
        }
    }
}