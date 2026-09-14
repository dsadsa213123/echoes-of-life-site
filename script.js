const loadingBar = document.querySelector("#loadingBar");
const loadingPercent = document.querySelector("#loadingPercent");
const bootMessage = document.querySelector("#bootMessage");
const accessButton = document.querySelector("#accessButton");
const bootContent = document.querySelector("#bootContent");
const archiveMenu = document.querySelector("#archive-menu");
const systemStatus = document.querySelector("#systemStatus");
const screen = document.querySelector("#screen");
const terminalResponse = document.querySelector("#terminalResponse");
const fileButtons = document.querySelectorAll("[data-file]");

let progress = 0;
let ready = false;
let accessed = false;
let selectedFileIndex = 0;

const bootMessages = [
    "CHECKING MEMORY SECTORS...",
    "RESTORING DAMAGED RECORDS...",
    "SEARCHING FOR EXTERNAL SIGNAL...",
    "ARCHIVE RECOVERY COMPLETE."
];

function finishBoot() {
    ready = true;
    systemStatus.textContent = "READY";
    bootMessage.textContent = bootMessages[3];
    accessButton.hidden = false;
    accessButton.focus();
}

function runBootSequence() {
    const timer = window.setInterval(() => {
        progress += 4;
        loadingBar.style.width = `${progress}%`;
        loadingPercent.textContent = `${String(progress).padStart(2, "0")}%`;

        if (progress === 28) bootMessage.textContent = bootMessages[1];
        if (progress === 60) bootMessage.textContent = bootMessages[2];

        if (progress >= 100) {
            window.clearInterval(timer);
            finishBoot();
        }
    }, 90);
}

function accessArchive() {
    if (!ready || accessed) return;

    accessed = true;
    window.location.hash = "archive-menu";
    archiveMenu.classList.add("is-open");
    systemStatus.textContent = "ONLINE";
    selectFile(0, true);
}

function selectFile(index, moveFocus = false) {
    selectedFileIndex = (index + fileButtons.length) % fileButtons.length;

    fileButtons.forEach((button, buttonIndex) => {
        button.classList.toggle("is-selected", buttonIndex === selectedFileIndex);
    });

    if (moveFocus) fileButtons[selectedFileIndex].focus();
}

function openSelectedFile() {
    const selectedFile = fileButtons[selectedFileIndex];
    terminalResponse.textContent = `${selectedFile.dataset.file}: MODULE WILL BE INSTALLED NEXT.`;
}

function handleKeyboard(event) {
    if (!ready) return;

    if (!accessed && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        accessArchive();
        return;
    }

    if (!accessed) return;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        selectFile(selectedFileIndex + 1, true);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        selectFile(selectedFileIndex - 1, true);
    }

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSelectedFile();
    }

    if (event.key === "Escape") {
        event.preventDefault();
        accessed = false;
        archiveMenu.classList.remove("is-open");
        window.location.hash = "";
        systemStatus.textContent = "READY";
        accessButton.focus();
    }
}

fileButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectFile([...fileButtons].indexOf(button));
        openSelectedFile();
    });
});

accessButton.addEventListener("click", accessArchive);
window.addEventListener("keydown", handleKeyboard);

runBootSequence();
