import { AreaConnection } from "./areaConnection.js";
import { cabinAttic } from "./instances/cabinAttic.js";
import { cabinInside } from "./instances/cabinInside.js";
import { cabinOutside } from "./instances/cabinOutside.js";
import { sampleEnd } from "./instances/sampleEnd.js";
import { townCenter } from "./instances/townCenter.js";

cabinAttic.neighbourAreas = [
    new AreaConnection({
        areaObject: cabinInside,
        references: ['outside'],
        distance: 2,
        description: `You climb back down, dropping on the floor of the cabin.`,
    }),
]

// sampleEnd.neighbourAreas = [
//     new AreaConnection({
//         areaObject: cabinInside,
//         references: ['inside', 'cabin'],
//         distance: 1,
//         description: `You walk back into the cabin.`,
//     }),
// ]

cabinOutside.neighbourAreas = [
    new AreaConnection({
        areaObject: cabinInside,
        references: ['inside', 'cabin'],
        distance: 1,
        description: `You walk back into the cabin.`,
    }),
    new AreaConnection({
        areaObject: townCenter,
        references: ['obelisk', 'uphill', 'hill', 'up', 'path'],
        distance: 10,
        description: `You walk through the path, going up the hill you find yourself in the town center.`,
    }),
]

townCenter.neighbourAreas = [
    new AreaConnection({
        areaObject: cabinOutside,
        references: ['cabin', 'downhill', 'down'],
        distance: 9,
        description: `You walk down the path, walking back to the small wooden cabin.`,
    }),
]
