import { Area } from "./area.js";
import { tallStonesHill } from "./instances/tallStonesHill.js";
import { trail } from "./instances/trail.js";
import { treeSpot } from "./instances/treeSpot.js";
import { cabinFront } from "./instances/cabinFront.js";
import { cabinInside } from "./instances/cabinInside.js";

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

tallStonesHill.neighbourAreas = [ new AreaConnection({
    areaObject: treeSpot,
    distance: 2,
    description: `You walk down the grassy slope towards the tree.`,
}), new AreaConnection({
    areaObject: trail,
    distance: 9,
    description: `You walk past the tree and follow the trail down towards the base of the hill.`
}), new AreaConnection ({
    areaObject: cabinFront,
    distance: 13,
    description: `You walk past the tree and follow the trail down to the a wooden cabin.`})];

treeSpot.neighbourAreas = [ new AreaConnection({
    areaObject: tallStonesHill,
    distance: 3,
    description: `You walk back up to the hill top surrounded by stones.`
}), new AreaConnection ({
    areaObject: trail,
    distance: 7,
    description: `You follow the trail down towards the base of the hill.`
}), new AreaConnection ({
    areaObject: cabinFront,
    distance: 9,
    description: `You walk down the trail to a lonely wooden cabin at its end.`})];

trail.neighbourAreas = [ new AreaConnection({
    areaObject: tallStonesHill,
    distance: 11,
    description: `You walk past the tree, back up to the hill top surrounded by stones.`
}), new AreaConnection ({
    areaObject: cabinFront,
    distance: 2,
    description: `You walk down the dirt to a lonely wooden cabin.`
}), new AreaConnection ({
    areaObject: treeSpot,
    distance: 8,
    description: `You follow the trail up back towards the tree on the hill.`
})];

cabinFront.neighbourAreas = [ new AreaConnection({
    areaObject: tallStonesHill,
    distance: 13,
    description: `You follow the trail, going past the tree, back up to the hill top surrounded by stones.`
}), new AreaConnection ({
    areaObject: trail,
    distance: 2,
    description: `You walk out into the dirt path.`
}), new AreaConnection ({
    areaObject: treeSpot,
    distance: 9,
    description: `You follow the trail up back towards the tree on the hill.`
}), new AreaConnection ({
    areaObject: cabinInside,
    distance: 0,
    description: `You enter the cabin.`
})];
