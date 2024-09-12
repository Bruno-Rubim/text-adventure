export class Area {
    constructor(){
        this.name = ''
        this.content = [];
        this.neighbourAreas = [];
        this.description = '';
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
}