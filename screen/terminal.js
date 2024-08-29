import { executeInput } from "../commands/executor.js";

export const screenText = document.querySelector("#screen-text");
export const warningText = document.querySelector("#warning-text");
export const input = document.querySelector("#input-text");

let wrirtingInScreen = false;
let screenTextQueue = [];

let writingDelay = 50;
export const setWritingDelay = (num) => {
    writingDelay = num;
}

const updateScreen = () => {
    let text = '';
    if (!wrirtingInScreen) {
        while (screenTextQueue.length){
            text += screenTextQueue.shift().replace("\n", "<br>") + '<br><br>';
        }
        if (text != '') {
            wrirtingInScreen = true;
            input.disabled = true;
            typeWriterEffect(screenText, text);
            writeInWarning('&nbsp;');
        }
    } else {
        setTimeout(updateScreen, 10);
    }
}

export const addTextToScreenQueue = (text) => {
    screenTextQueue.push(text);
    updateScreen();
}

const insertChar = (textObject) => {
    setTimeout(() => {
        document.querySelector("#" + textObject.target).innerHTML += textObject.char;
        if (textObject.isLast) {
            wrirtingInScreen = false;
            input.disabled = false;
            input.focus();
            updateScreen();
        }
    }, textObject.delay);
}

let universalIdCounter = 0;
const typeWriterEffect = (originalTarget, text) => {
    let currentCharacter = '';
    let insertDelay = writingDelay;
    let charCount = 0;
    let targetArray = [originalTarget.id];
    let targetLayer = 0;
    let nextTargetLayer = 0;
    let textArray = [];
    let lastText = false;
    for(let textIndex = 0; textIndex < text.length; textIndex++){
        currentCharacter = text[textIndex];
        let hasId = false;
        const id = "id" + universalIdCounter;
        if (text[textIndex] == "<"){
            do {
                textIndex++;
                currentCharacter += text[textIndex];
                if (text[textIndex] == " " && !hasId){
                    hasId = true;
                    currentCharacter += `id="` + id + `" `;
                    universalIdCounter++;
                    nextTargetLayer++;
                    targetArray.push(id);
                }
                if (text[textIndex] == "/" && !hasId){
                    nextTargetLayer--;
                }
            } while (text[textIndex] != ">");
        }
        if (textIndex == text.length - 1) {
            lastText = true;
        }
        textArray.push({
            target: targetArray[targetLayer],
            char: currentCharacter,
            delay: insertDelay * charCount,
            isLast: lastText,
        })
        targetLayer = nextTargetLayer;
        if (text[textIndex] == ","){
            charCount += 7;
        }
        if (text[textIndex] == "."){
            charCount += 10;
        }
        charCount++;
    }
    while (textArray.length > 0){
        insertChar(textArray[0]);
        textArray.shift();
    }
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

addTextToScreenQueue(`When unsure where you are, LOOK AROUND.`);