export class Area {
    constructor({name = '', references = [], content = [], neighbourAreas = [], description = ''}){
        this.name = name;
        this.references = references;
        this.content = content;
        this.neighbourAreas = neighbourAreas;
        this.description = description;
        this.references.push(name);
        this.everSeen = false;
    }
    getDescription = () => {
        return this.description;
    }
    startWith = (objectArray) => {
        for (const object of objectArray){
            object.parent = this.content;
            this.content.push(object);
        }
    }
    lookedAt = (gameState) => {
        this.everSeen = true;
        gameState.gainWisdom(this.wisdomKey);
        gameState.globalTime++;
    }
}