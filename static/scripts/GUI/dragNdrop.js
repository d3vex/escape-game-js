import Enigme2 from "../enigmes.js/enigme2.js";

const workspace = document.querySelector(".enigme2_dragNdrop>#workspace");
const blockTypes = ["forward", "left", "right"];
const blockClasses = ["go-forward", "turn-left", "turn-right"];
const blockValue = ["f", "l", "r"];

blockTypes.forEach((text, index) => {
    let block = document.createElement("div");
    block.className = `block ${blockClasses[index]} demo`;
    block.textContent = text;
    block.value = blockValue[index];
    block.style.top = `${20 + index * 60}px`;
    block.style.left = `${20}px`;
    workspace.appendChild(block);
    addDragHandlers(block, true);
});

let selectedBlock = null;
let offsetX, offsetY;
const snapDistance = 20;

function addDragHandlers(block, isOriginal) {
    block.addEventListener("mousedown", (e) => {
        if (isOriginal) {
            let clone = block.cloneNode(true);
            let blockRect = block.getBoundingClientRect();
            clone.classList.remove("demo");
            clone.value = block.value;

            clone.style.left = `${
                e.clientX - (blockRect.left / 2 + block.width / 2)
            }px`; // 1/2 of (the initial block width + the initial block left) ((120+20)/2 = 140/2 = 70)
            clone.style.top = `${
                e.clientY - (blockRect.top / 2 + block.height / 2)
            }px`; // 1/2 of (the initial block height + the initial block top) ((50+20)/2 = 70/2 = 35)

            workspace.appendChild(clone);
            selectedBlock = clone;
            addDragHandlers(clone, false);
        } else {
            selectedBlock = block;
        }
        let rect = selectedBlock.getBoundingClientRect();
        offsetX = e.clientX - rect.left + window.innerWidth * 0.15; // 1/2  of the initial block left (20/2 = 10)
        offsetY = e.clientY - rect.top + window.innerHeight * 0.25 -50; // 1/2 of the default block top
        selectedBlock.style.position = "absolute";
        selectedBlock.style.zIndex = 1000;
    });
}

document.addEventListener("mousemove", (e) => {
    if (!selectedBlock) return;
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    selectedBlock.style.left = `${newLeft}px`;
    selectedBlock.style.top = `${newTop}px`;
});

document.addEventListener("mouseup", () => {
    if (!selectedBlock) return;
    let blockRect = selectedBlock.getBoundingClientRect();
    let snapped = false;
    document.querySelectorAll(".block").forEach((otherBlock) => {
        if (otherBlock !== selectedBlock) {
            let otherRect = otherBlock.getBoundingClientRect();
            let dx = Math.abs(blockRect.left - otherRect.left);
            let dy = Math.abs(blockRect.top - otherRect.bottom);
            let parent = otherBlock;
            while (
                parent.parentElement != null &&
                parent.parentElement.classList.contains("block")
            ) {
                parent = parent.parentElement;
            }

            if (dx < snapDistance && dy < snapDistance) {
                while (otherBlock.children.length > 0) {
                    otherBlock = otherBlock.children.item(0);
                    otherBlock.classList.add("nested");
                }
                selectedBlock.style.left = "0px";
                selectedBlock.style.top = `${otherBlock.offsetHeight}px`;
                selectedBlock.classList.add("nested");
                otherBlock.appendChild(selectedBlock);
                snapped = true;
            }
        }
    });

    if (!snapped && workspace.contains(selectedBlock)) {
        selectedBlock.style.zIndex = "auto";
    }
    selectedBlock = null;
});

document.getElementById("egnime2_run").addEventListener("click", () => {
    let blocks = document.querySelectorAll(
        ".enigme2_dragNdrop>#workspace>.block"
    );
    Array.from(blocks)
        .filter(
            (block) =>
                !block.classList.contains("demo") && // SKip demo blocks
                block.children.length != 0 // Skip blocks that have no nest
        )
        .forEach((block) => {
            let cmd = getCommandValue(block, ";");
            Enigme2.runDragNDrop(cmd);
        });
});

function getCommandValue(block, seperator = ";") {
    let text = block.value;
    if (text == "") return "";
    block.childNodes.forEach((child) => {
        if (child.classList && child.classList.contains("block")) {
            text += seperator + getCommandValue(child, seperator);
        }
    });
    return text;
}
/* 
function getChildText(block, seperator = " ->") {
    let text = getTextWithoutChildren(block);
    if (text == "") return "";
    block.childNodes.forEach((child) => {
        if (child.classList && child.classList.contains("block")) {
            text += seperator + getChildText(child, seperator);
        }
    });
    return text;
}
function getTextWithoutChildren(element) {
    let text = "";
    element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        }
    });
    return text.trim();
}
 */
