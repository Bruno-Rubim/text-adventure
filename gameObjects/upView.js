import { gameState } from "../gameState.js";
import { Container } from "./container.js";
import { GameObject } from "./gameObject.js";

const sky = new GameObject({
    name: 'sky',
    wisdomKey: 'sky',
    references: ['moon','moons','sun','above','up']
})
sky.getDescription = () => {
    let dayState = gameState.getDayStateComplex();
    let dayVariables = {
        dusk: {
            '': ``,
            'sky': `A vast dark canvas of pitch black covers the sky. You see the two moons, slowly inching towards the horizon as the moments seem to pass by.One smaller accompanying the bigger one, enjoying each other's presence while it still lasts.`,
        },
        sunrise:{
            '':``,
            'sky':`to be written.`,
        },
        morning: {
            '': ``,
            'sky': `to be written.`,
        },
        noon:{
            '':``,
            'sky':`to be written.`,
        },
        afternoon: {
            '': ``,
            'sky': `to be written.`,
        },
        sunset:{
            '':``,
            'sky':`to be written.`,
        },
        evening: {
            '': ``,
            'sky': `to be written.`,
        },
        midnight:{
            '':``,
            'sky':`to be written.`,
        },
    };
    let response = dayVariables[dayState]['sky'];
    return response;
}

export const upView = new Container({content: [sky]});