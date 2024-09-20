import { AreaConnection } from "./areaConnection.js";
import { houseAttic } from "./instances/houseAttic.js";
import { houseInside } from "./instances/houseInside.js";
import { houseOutside } from "./instances/houseOutside.js";

houseAttic.neighbourAreas = [
    new AreaConnection({
        areaObject: houseInside,
        references: ['outside'],
        distance: 2,
        description: `You climb back down, dropping on the floor of the house.`,
    }),
]

houseOutside.neighbourAreas = [
    new AreaConnection({
        areaObject: houseInside,
        references: ['inside', 'house'],
        distance: 1,
        description: `You walk back into the house.`,
    }),
]