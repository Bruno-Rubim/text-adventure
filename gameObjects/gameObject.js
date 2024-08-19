export class GameObject {
    constructor({name = '', description = '', references = [], parent = null, wisdomKey = name}){
        this.name = name;
        this.content = null;
        this.description = description;
        this.references = references;
        this.parent = parent;
        this.wisdomKey = wisdomKey;
        this.references.push(this.name);
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

