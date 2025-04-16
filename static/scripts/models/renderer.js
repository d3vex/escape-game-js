import Game from "../game.js";

const sizeMultiplier = 2;
let actualSizeMultiplier = 1;
const imageCache = {}; // Cache for preloaded images

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        if (imageCache[src]) {
            resolve(imageCache[src]);
            return;
        }

        const img = new Image();
        img.onload = () => {
            imageCache[src] = img;
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

async function setBoardBackground(state) {
    // Ensure state is a valid number
    if (typeof state !== "number") {
        console.error("Invalid state provided to setBoardBackground:", state);
        return;
    }

    const board = document.getElementById("board");
    if (board) {
        const imgSrc = `static/assets/images/map/Map-${state}.png`;

        let img = await preloadImage(imgSrc).catch((error) => {
            console.error("Error loading background image:", error);
        });
        const imageWidth = img.width;
        const imageHeight = img.height;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let finalWidth = imageWidth;
        let finalHeight = imageHeight;
        actualSizeMultiplier = 1;

        if (
            windowWidth >= imageWidth * sizeMultiplier &&
            windowHeight >= imageHeight * sizeMultiplier
        ) {
            finalWidth = imageWidth * sizeMultiplier;
            finalHeight = imageHeight * sizeMultiplier;
            actualSizeMultiplier = sizeMultiplier;
        }

        board.style.width = `${finalWidth}px`;
        board.style.height = `${finalHeight}px`;
        board.style.backgroundImage = `url(${imgSrc})`;
        board.style.backgroundSize = `${finalWidth}px ${finalHeight}px`;
        board.style.backgroundRepeat = "no-repeat";
        board.style.backgroundPosition = "center";
        board.style.imageRendering = "pixelated";

        console.log(`Actual size multiplier used: ${actualSizeMultiplier}`);

        if (!document.getElementById("pixel-square")) {
            createSquare();
        }

        for (const e of Game.getInstance().entities) {
            if (!document.getElementById(e.id)) {
                if (
                    typeof e.secondCondition == "function" &&
                    e.secondCondition()
                ) {
                    e.x = e.x2;
                    e.y = e.y2;
                }
                createEntity(e.id, e.x, e.y, e.img);
            }
        }

        const boardReadyEvent = new CustomEvent("boardReady", {
            detail: { width: finalWidth, height: finalHeight },
        });
        document.dispatchEvent(boardReadyEvent);
    } else {
        console.log("Board element not found");
    }
}

function createSquare() {
    const existingSquare = document.getElementById("pixel-square");
    if (existingSquare) {
        existingSquare.remove();
    }

    const player = document.createElement("div");
    player.id = "pixel-square"; // Keep the same ID for compatibility
    const spriteSize = 16 * actualSizeMultiplier;

    player.style.width = `${spriteSize}px`;
    player.style.height = `${spriteSize}px`;
    player.style.position = "absolute";
    player.style.backgroundImage =
        "url('static/assets/images/sprite/idle/south1.png')";
    player.style.backgroundSize = "contain";
    player.style.backgroundRepeat = "no-repeat";
    player.style.zIndex = "10";
    // Fix blurry images
    player.style.imageRendering = "pixelated";

    const board = document.getElementById("board");
    if (board) {
        const boardWidth = parseInt(board.style.width);
        const boardHeight = parseInt(board.style.height);

        const initialX = (boardWidth - spriteSize) / 2;
        const initialY = (boardHeight - spriteSize) / 2;

        player.style.left = `${initialX}px`;
        player.style.top = `${initialY}px`;

        board.appendChild(player);
        console.log(
            `Player sprite created with size: ${spriteSize}x${spriteSize}px at position (${initialX}, ${initialY})`
        );
    }
}

/**
 * Create a new entity on the board with the given id and position.
 *
 * @param {String} id
 * @param {Number} x
 * @param {Number} y
 * @param {String} [imgSrc] - Optional image source for the entity
 */
function createEntity(id, x, y, imgSrc) {
    const existingSquare = document.getElementById(id);
    if (existingSquare) {
        existingSquare.remove();
    }
    const entity = document.createElement("div");
    entity.id = id;
    const squareSize = 16 * actualSizeMultiplier;

    entity.style.width = `${squareSize}px`;
    entity.style.height = `${squareSize}px`;
    entity.style.position = "absolute";

    if (imgSrc) {
        entity.style.backgroundImage = `url(${imgSrc})`;
        entity.style.backgroundSize = "contain";
        entity.style.backgroundRepeat = "no-repeat";
        entity.style.imageRendering = "pixelated";
    } else {
        entity.style.backgroundColor = "red";
    }

    const board = document.getElementById("board");
    if (board) {
        const initialX = x * actualSizeMultiplier;
        const initialY = y * actualSizeMultiplier;

        entity.style.left = `${initialX}px`;
        entity.style.top = `${initialY}px`;

        board.appendChild(entity);
    }
}

async function preloadMapAssets(maxState = 3) {
    console.log("Preloading all map backgrounds...");
    const mapPromises = [];

    for (let state = 1; state <= maxState; state++) {
        const mapUrl = `static/assets/images/map/Map-${state}.png`;
        mapPromises.push(preloadImage(mapUrl));
    }

    try {
        await Promise.all(mapPromises);
        console.log(`Successfully preloaded ${maxState} map backgrounds`);
    } catch (error) {
        console.error("Error preloading map assets:", error);
        throw error;
    }
}

async function preloadCharacterAnimations() {
    console.log("Preloading character animations...");
    const baseUrl = "static/assets/images/sprite/";
    const animations = {
        idle: 4,
        walk: 8,
    };
    const directions = ["north", "east", "south", "west"];

    const promises = [];

    for (const [animation, frameCount] of Object.entries(animations)) {
        for (const direction of directions) {
            for (let i = 1; i <= frameCount; i++) {
                const src = `${baseUrl}${animation}/${direction}${i}.png`;
                promises.push(preloadImage(src));
            }
        }
    }

    try {
        await Promise.all(promises);
        console.log(
            `Successfully preloaded ${promises.length} character animation frames`
        );
    } catch (error) {
        console.error("Error preloading character animations:", error);
        throw error;
    }
}

async function preloadEntityImages() {
    console.log("Preloading entity images...");
    const promises = [];

    // Précharger les images des entités
    for (const entity of Game.getInstance().entities) {
        if (entity.img) {
            promises.push(preloadImage(entity.img));
        }
    }

    try {
        await Promise.all(promises);
        console.log(`Successfully preloaded ${promises.length} entity images`);
    } catch (error) {
        console.error("Error preloading entity images:", error);
        throw error;
    }
}

async function preloadAllGameAssets(maxState = 3) {
    console.log("Starting preloading of all game assets...");

    try {
        await preloadMapAssets(maxState);
        await preloadCharacterAnimations();
        await preloadEntityImages();

        console.log("All game assets preloaded successfully!");
        return true;
    } catch (error) {
        console.error("Error during comprehensive asset preloading:", error);
        throw error;
    }
}

export {
    actualSizeMultiplier,
    setBoardBackground,
    createEntity,
    preloadCharacterAnimations,
    preloadMapAssets,
    preloadImage,
    preloadAllGameAssets,
};
