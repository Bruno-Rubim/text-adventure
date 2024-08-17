export class Area {
    constructor(){
        this.name = ''
        this.content = [];
        this.neighbourAreas = [];
        this.description = '';
        this.position = [];
    }
    getDescription = () => {
        return this.description;
    }
}