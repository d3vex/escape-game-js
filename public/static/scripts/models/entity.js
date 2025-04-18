import { checkCollision } from "../utils.js";
import { actualSizeMultiplier, preloadImage } from "./renderer.js";
import { CYCLE_DURATION } from "../variables.js";
import Game from "../game.js";

class Entity {
    #position;
    #element;
    #speed = 1;
    #boardElement;
    #size = 16;
    #facing = 1;
    #positionUpdated = false;
    #lastFrameTime = performance.now();
    #animationFrame = 1;
    #animationFrameCount = 8; // Walking animations have 8 frames
    #animationSpeed = 150; // Animation frame speed in ms
    #lastAnimationTime = 0;
    #animationFrames = {}; // Cache for preloaded animation frames
    #isMoving = false;

    constructor(id, x = -1, y = -1) {
        this.#position = { x: x, y: y };
        this.#element = document.getElementById(id);
        if (x == -1 && y == -1) {
            // If no position is given, fetch it from the element
            this.#position.x = Math.floor(
                this.#element.offsetLeft / actualSizeMultiplier
            );
            this.#position.y = Math.floor(
                this.#element.offsetTop / actualSizeMultiplier
            );
        }
        this.#speed = 1;
        this.#boardElement = document.getElementById("board");
        this.#size = 16; // Entity size
        this.#facing = 1; // NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3

        // Preload walking animations
        this.#preloadAnimations();
        this.updateSprite();
    }

    get position() {
        return this.#position;
    }

    /**
     * This method will teleport entity to a specific point
     *
     * @param {Number} x
     * @param {Number} y
     */
    goTo(x, y) {
        this.#position.x = x;
        this.#position.y = y;
        this.updatePosition();
    }

    turnLeft() {
        this.#facing = (this.#facing + 3) % 4;
        this.updateSprite();
    }

    turnRight() {
        this.#facing = (this.#facing + 1) % 4;
        this.updateSprite();
    }

    /**
     * This method will move the entity forward in the direction it is facing
     * until it hits a wall.
     */
    async moveForward() {
        this.#isMoving = true;

        switch (this.#facing) {
            case 0: // NORTH
                while (this.#move(0, -this.#speed)) {
                    await this.waitForPositionToUpdate();
                }
                break;
            case 1: // EAST
                while (this.#move(this.#speed, 0)) {
                    await this.waitForPositionToUpdate();
                }
                break;
            case 2: // SOUTH
                while (this.#move(0, this.#speed)) {
                    await this.waitForPositionToUpdate();
                }
                break;
            case 3: // WEST
                while (this.#move(-this.#speed, 0)) {
                    await this.waitForPositionToUpdate();
                }
                break;
        }

        this.#isMoving = false;
    }

    /**
     * This method will move the entity in absolute coordinates
     * It will return false if the entity hit a wall and cannot do the move
     *
     * @param {Number} dx
     * @param {Number} dy
     * @returns {Boolean}
     */
    #move(dx, dy) {
        const boardRect = this.#boardElement.getBoundingClientRect();
        const playerRect = this.#element.getBoundingClientRect();
        const playerSize = playerRect.width;

        let newX = this.#position.x + dx;
        let newY = this.#position.y + dy;

        const maxX = boardRect.width - playerSize;
        const maxY = boardRect.height - playerSize;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        let finalPosition = checkCollision(
            Game.getInstance().collisionsData,
            this.#position,
            {
                x: newX,
                y: newY,
            },
            this.#size
        );
        if (finalPosition.x != newX || finalPosition.y != newY) {
            this.#position = finalPosition;
            return false;
        }
        this.#position = { x: newX, y: newY };
        return true;
    }

    /**
     * This method will update the entity position
     */
    updatePosition() {
        if (this.#element) {
            this.#positionUpdated = true;
            this.#element.style.transform = "none";
            this.#element.style.top = `${
                this.#position.y * actualSizeMultiplier
            }px`;
            this.#element.style.left = `${
                this.#position.x * actualSizeMultiplier
            }px`;
        }
    }

    /**
     * This method will update the entity size
     */
    updateEntitySize() {
        if (this.#element) {
            this.#element.style.width = `${16 * actualSizeMultiplier}px`;
            this.#element.style.height = `${16 * actualSizeMultiplier}px`;
        }
    }

    /**
     * This method will start the entity render loop
     */
    start() {
        this.isRunning = true;
        this.moveLoop();
    }

    /**
     * This method will stop the entity render loop
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * This method is a loop that update the entity position
     * and the animation
     */
    moveLoop() {
        const now = performance.now();
        const deltaTime = now - this.#lastFrameTime;

        if (deltaTime >= CYCLE_DURATION && this.isRunning) {
            this.#lastFrameTime = now - (deltaTime % CYCLE_DURATION);
            this.updatePosition();

            // Update animation frames only if moving
            if (this.#isMoving) {
                this.#updateAnimation(now);
            }
        }

        if (this.isRunning) {
            setTimeout(() => this.moveLoop(), CYCLE_DURATION);
        }
    }

    /**
     * This method allow to wait the next entity position update
     * It will return a promise that will resolve when the position is updated
     */
    async waitForPositionToUpdate() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.#positionUpdated) {
                    this.#positionUpdated = false;
                    clearInterval(interval);
                    resolve();
                }
            }, 1000 / 60);
        });
    }

    /**
     * This method allow to load in cache all animations
     * @returns {Promise}
     */
    async #preloadAnimations() {
        // Map directions to string representation for file paths
        const directionMap = {
            0: "north",
            1: "east",
            2: "south",
            3: "west",
        };

        const baseUrl = "static/assets/images/sprite/knight/";
        const promises = [];

        for (const [dirNum, dirName] of Object.entries(directionMap)) {
            const animKey = `walk-${dirNum}`;
            this.#animationFrames[animKey] = [];

            // Knight animations have 8 frames
            for (let i = 1; i <= 8; i++) {
                const src = `${baseUrl}walk/${dirName}${i}.png`;
                promises.push(
                    preloadImage(src)
                        .then((img) => {
                            this.#animationFrames[animKey][i - 1] = src;
                        })
                        .catch((err) => {
                            console.warn(
                                `Failed to preload entity animation ${src}:`,
                                err
                            );
                        })
                );
            }
        }

        return Promise.all(promises);
    }

    /**
     * This method will update the animation frame
     */
    #updateAnimation(timestamp) {
        if (!this.#lastAnimationTime) {
            this.#lastAnimationTime = timestamp;
            return;
        }

        const deltaTime = timestamp - this.#lastAnimationTime;

        if (deltaTime >= this.#animationSpeed) {
            this.#lastAnimationTime = timestamp;
            this.#animationFrame =
                (this.#animationFrame % this.#animationFrameCount) + 1;
            this.updateSprite();
        }
    }

    /**
     * This method will update the sprite of the entity
     * depending on the facing direction and the animation frame
     */
    updateSprite() {
        if (this.#element) {
            const facingNum = this.#facing;
            const animKey = `walk-${facingNum}`;

            // Choose the correct walking frame
            if (
                this.#animationFrames[animKey] &&
                this.#animationFrames[animKey][this.#animationFrame - 1]
            ) {
                this.#element.style.backgroundImage = `url('${
                    this.#animationFrames[animKey][this.#animationFrame - 1]
                }')`;
            } else {
                const directionMap = ["north", "east", "south", "west"];
                const url = `static/assets/images/sprite/knight/walk/${
                    directionMap[facingNum]
                }${this.#animationFrame}.png`;
                this.#element.style.backgroundImage = `url('${url}')`;

                // Try to cache this image for next time
                preloadImage(url)
                    .then((img) => {
                        if (!this.#animationFrames[animKey]) {
                            this.#animationFrames[animKey] = [];
                        }
                        this.#animationFrames[animKey][
                            this.#animationFrame - 1
                        ] = url;
                    })
                    .catch((err) => {
                        console.warn(
                            `Failed to load entity sprite ${url}:`,
                            err
                        );
                    });
            }

            // Ensure pixelated rendering
            this.#element.style.imageRendering = "pixelated";
        }
    }
}

export default Entity;
