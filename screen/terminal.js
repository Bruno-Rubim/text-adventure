import { executeInput } from "../commands/executor.js";

export const screenText = document.querySelector("#screen-text-area");
export const warningText = document.querySelector("#warning-text");
export const input = document.querySelector("#input-text");

export const writeInScreen = (text) => {
    screenText.value += text + '\n\n';
    warningText.innerHTML = '&nbsp;';
}

export const writeInWarning = (text) => {
    warningText.innerHTML = text;
}

export const clearScreen = () => {
    screenText.innerHTML = '';
}

let inputHistory = [];
let inputIndex = inputHistory.length;

const enterInput = () => {
    executeInput(input.value);
    if (input.value){
        inputHistory.push(input.value);
    }
    input.value = '';
}
window.addEventListener("keyup", function(event) {
    if (event.key === "CapsLock") {
        writeInWarning("Capital letters are not necessary");
    }
});

input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        enterInput();
        screenText.scrollTop = screenText.scrollHeight;
        inputIndex = inputHistory.length;
    }
    if (inputHistory.length){
        if (event.key === "ArrowUp") {
            inputIndex--;
            if (inputIndex < 0){
                inputIndex = 0
            }
            input.value = inputHistory[inputIndex];
        }
        if (event.key === "ArrowDown") {
            inputIndex++;
            input.value = inputHistory[inputIndex];
            if (inputIndex >= inputHistory.length){
                inputIndex = inputHistory.length;
                input.value = '';
            }
        }
    }
});

writeInScreen(`When unsure where you are, LOOK AROUND`);