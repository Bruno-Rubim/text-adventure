import { executeInput } from "../commands/executor.js";

export const screenText = document.querySelector("#screen-text");
export const warningText = document.querySelector("#warning-text");
export const input = document.querySelector("#input-text");

let wrirtingInScreen = false;
let screenTextQueue = [];
let writingDelay = 25;

export const setWritingDelay = (num) => {
    writingDelay = num;
}

const updateScreen = () => {
    let text = '';
    if (!wrirtingInScreen) {
        while (screenTextQueue.length){
            text += screenTextQueue.shift() + '<br><br>';
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
    screenTextQueue.push(text.replaceAll('\n', '<br>'));
    updateScreen();
}

const insertTextFragment = (textObject) => {
    setTimeout(() => {
        document.querySelector("#" + textObject.target).innerHTML += textObject.fragment;
        screenText.scrollTop = screenText.scrollHeight;
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
    let currentFragment = '';
    let insertDelay = writingDelay;
    let totalDelay = 0;
    let fragmentCount = 0;
    let targetArray = [originalTarget.id];
    let targetIndex = 0;
    let nextTargetIndex = 0;
    let textArray = [];
    let lastText = false;
    let currentTag = '';
    for(let textIndex = 0; textIndex < text.length; textIndex++){
        currentFragment = text[textIndex];
        let hasId = false;
        if (text[textIndex] == "<"){
            do {
                textIndex++;
                currentFragment += text[textIndex];
                if (text[textIndex] == " " && !hasId){
                    hasId = true;
                    universalIdCounter++;
                    const id = `tag` + universalIdCounter;
                    currentFragment +=  `id="` + id + `" `;
                    nextTargetIndex = targetArray.length;
                    targetArray.push(id);
                }
                currentTag = currentFragment;
                if (text[textIndex] == "/" && !hasId){
                    nextTargetIndex = 0;
                }
            } while (text[textIndex] != ">");
        }
        if (currentTag == '<br>' || currentTag.includes('/')){
            currentTag = '';
        }
        if (textIndex == text.length - 1) {
            lastText = true;
        }
        if (currentTag.includes('h1')){
            insertDelay = 250;
        } else {
            insertDelay = writingDelay;
        }
        textArray.push({
            target: targetArray[targetIndex],
            fragment: currentFragment,
            delay: insertDelay  + totalDelay,
            isLast: lastText,
        })
        totalDelay += insertDelay;
        targetIndex = nextTargetIndex;
        if (text[textIndex] == ","){
            fragmentCount += 7;
        }
        if (text[textIndex] == "."){
            fragmentCount += 10;
        }
        fragmentCount++;
    }
    while (textArray.length > 0){
        insertTextFragment(textArray[0]);
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

addTextToScreenQueue(`Welcome to<h1 > GAME NAME </h1> type HELP and hit ENTER for command list!`);