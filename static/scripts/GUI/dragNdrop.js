import Enigme2 from "../enigmes.js/enigme2.js";

const workspace = document.querySelector(".enigme2_dragNdrop #workspace");
const blockTypes = ["forward", "left", "right"];
const blockClasses = ["go-forward", "turn-left", "turn-right"];

blockTypes.forEach((text, index) => {
  let block = documsent.createElement("div");
  block.className = `block ${blockClasses[index]} demo`;
  block.textContent = text;
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
      clone.classList.remove("demo");
      clone.style.left = `${e.clientX - 70}px`; // 1/2 of (the initial block width + the initial block left) ((120+20)/2 = 140/2 = 70)
      clone.style.top = `${e.clientY - 35}px`; // 1/2 of (the initial block height + the initial block top) ((50+20)/2 = 70/2 = 35)
      workspace.appendChild(clone);
      selectedBlock = clone;
      addDragHandlers(clone, false);
    } else {
      selectedBlock = block;
    }
    let rect = selectedBlock.getBoundingClientRect();
    offsetX = e.clientX - rect.left + 10; // 1/2  of the initial block left (20/2 = 10)
    offsetY = e.clientY - rect.top + 10; // 1/2 of the default block top
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
      if (dx < snapDistance && dy < snapDistance) {
        while (otherBlock.childNodes.length > 0) {
          otherBlock = otherBlock.childNodes[0];
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

document.getElementById("run").addEventListener("click", () => {
  document.querySelectorAll(".workspace > .block").forEach((block) => {
    if (block.classList.contains("demo")) return; // Skip demo blocks
    let res = getChildText(block, "");
    Enigme2.runDragNDrop(res);
});
});

function getChildText(block, seperator=" ->") {
  let text = getTextWithoutChildren(block);
  if (text == "") return "";
  block.childNodes.forEach((child) => {
    if (child.classList && child.classList.contains("block")) {
      text += seperator +getChildText(child);
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
