import { GameObject } from "./gameObject.js";

export class Container extends GameObject {
    constructor({name = '', references = [name], description = '', content = [], limit = 6}){
        super({
            name: name,
            references: references,
            description: description
        })
        this.content = content;
        this.limit = limit;
    }
    getDescription = () => {
        let response = this.description;
        if (this.content.length == 0){
            return response;
        }
        response += ' You see'
        for (let i = 0; i < this.content.length; i++) {
            if (i == 0){
                response += ' a '  + (this.content[i].references);
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
}