import { GameObject } from "./gameObject.js";

export class Lock extends GameObject {
    constructor({name = '', description = '', key = '', unlockDescription = '', failedUnlockDescription = '', content = []}){
        super({
            name: name,
            description: description,
        })
        this.key = key;
        this.content = content;
        this.unlockDescription = unlockDescription;
        this.failedUnlockDescription = failedUnlockDescription;
    }
    placed = (item) => {
        let resultDescription = this.failedUnlockDescription;
        let unlocked = false;
        if (item.name == this.key){
            unlocked = true;
            resultDescription = this.unlockDescription;
        }
        return [unlocked, resultDescription];
    }
    getDescription = () => {
        return this.description;
    }
}