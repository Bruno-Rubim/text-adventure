import { gameState } from "../gameState.js";
import * as terminal from "../screen/terminal.js";
import { commandList } from "./commands.js";

const ingorables = [
    'at', 'around', 'in', 'on', 'a', 'the', 'with', 'of', 'into', 'out',
]

export const executeInput = (input) => {
    let words = input.trim().toLowerCase().split(/\s+/);
    words = words.filter(word => !ingorables.includes(word));
    if (words[0]) {
        let verb = words.splice(0, 1)[0];
        let command = commandList.find(command => command.keywords.includes(verb));
        if (command){
            command.execute(words);
            gameState.checkTimedEvents();
        } else {
            verb = verb[0].toUpperCase() + verb.substring(1);
            terminal.writeInWarning(verb + ` is not a command`);
        }
        return;
    }
    console.log(`Congrats you entered no commands I'll just pretend nothing happened`);
}