import { GameObject } from "./gameObject.js";

export class Container extends GameObject {
    constructor({name = '', references = [], description = 'a ' + name, content = [], limit = 6}){
        super({
            name: name,
            references: references,
            description: description
        })
        this.content = content;
        this.limit = limit;
        this.references.push(name);
    }
    getDescription = () => {
        let response = this.description;
        if (this.content.length == 0){
            return response;
        }
        response += ' You see'
        for (let i = 0; i < this.content.length; i++) {
            if (i == 0){
                response += ' a '  + (this.content[i].referTo());
            } else {
                if (i == this.content.length -1) {
                    response += ' and a '  + (this.content[i].references);
                } else {
                    response += ', a '  + (this.content[i].references);
                }
            }
        }
        response += ' on it.'
        return response;
    }
    placed = (object) => {
        return "You have placed the " + object.name + " on the " + this.name;
    }
    startWith = (objectArray) => {
        for (const object of objectArray){
            object.parent = this.content;
            this.content.push(object);
        }
    }
}
