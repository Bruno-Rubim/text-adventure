import { writeInScreen } from "../screen/terminal"

export let progress = {
    stage: 0,
    stageTexts: [
        `When unsure where you are, always LOOK AROUND`,
        `You can LOOK at TABLE`,
        `You can always CHECK your INVENTORY to see if you have anything useful`,
        `Maybe you can BREAK SOMETHING with ROCK`,
        `The only thing left to do is to GO through HOLE`,
    ]
}
export let moveStage = (newStage) => {
    if (newStage > progress.stage){
        progress.stage = newStage;
        writeInScreen(progress.stageTexts[newStage]);
    }
}
