export class AreaConnection {
    constructor({areaObject = null, distance = 0, references = [], description = ''}){
        this.areaObject = areaObject;
        this.distance = distance;
        this.references = references;
        this.description = description;
        for (const reference of areaObject.references) {
            this.references.push(reference);
        }
        this.references.push(areaObject.name);
    }
}