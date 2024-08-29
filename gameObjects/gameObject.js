export class GameObject {
    constructor({name = '', description = '', references = [], parent = null, wisdomKey = name, color = 'white'}){
        this.name = name;
        this.content = null;
        this.description = description;
        this.references = references;
        this.parent = parent;
        this.wisdomKey = wisdomKey;
        this.references.push(this.name);
        this.cathergories = [color];
    }
    referTo = () => {
        let cathergories = '';
        for (let i in this.cathergories){
            cathergories += this.cathergories[i] + " ";
        } 
        return `<b class="` + cathergories + `">` + this.name + `</b>`;
    }
    getDescription = () => {
        return this.description;
    }
    lookedAt = (gameState) => {
        gameState.gainWisdom(this.wisdomKey);
    }
    delete = () => {
        for (let i = 0; i < this.parent.length; i++) {
            if (this.parent[i].name == this.name){
                this.parent.splice(i, 1);
            }
        }
    }
    moveTo = (location) => {
        if (location == this.parent) {
            return false;
        }
        this.delete();
        location.push(this);
        this.parent = location;
        return true;
    }
};