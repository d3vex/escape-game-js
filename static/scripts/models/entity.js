import { checkCollision } from "../utils.js";
import { actualSizeMultiplier } from "./renderer.js";
import { CYCLE_DURATION } from "../variables.js";

class Entity {
    #position;
    #element;
    #speed = 1;
    #boardElement;
    #size = 16;
    #facing = 2;
    #positionUpdated = false;
    #lastFrameTime = performance.now();

    constructor(id, x = -1, y = -1) {
        this.#position = { x: x, y: y };
        this.#element = document.getElementById(id);
        if (x == -1 && y == -1) {
            this.#position.x = Math.floor(
                this.#element.offsetLeft / actualSizeMultiplier
            );
            this.#position.y = Math.floor(
                this.#element.offsetTop / actualSizeMultiplier
            );
        }
        this.#speed = 1;
        this.#boardElement = document.getElementById("board");
        this.#size = 16; // Taille du joueur
        this.#facing = 2; // NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3
    }

    turnLeft() {
        this.#facing = (this.#facing + 3) % 4;
    }

    turnRight() {
        this.#facing = (this.#facing + 1) % 4;
    }

    async moveForward() {
        switch (this.#facing) {
            case 0: // NORTH
                for (let i = 0; i < 16; i++) {
                    this.#move(0, -this.#speed);
                    await this.waitForPositionToUpdate();
                }
                break;
            case 1: // EAST
                for (let i = 0; i < 16; i++) {
                    this.#move(this.#speed, 0);
                    await this.waitForPositionToUpdate();
                }
                break;
            case 2: // SOUTH
                for (let i = 0; i < 16; i++) {
                    this.#move(0, this.#speed);
                    await this.waitForPositionToUpdate();
                }
                break;
            case 3: // WEST
                for (let i = 0; i < 16; i++) {
                    this.#move(-this.#speed, 0);
                    await this.waitForPositionToUpdate();
                }
                break;
        }
    }

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

        this.#position = { x: newX, y: newY };
    }

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

    updateEntitySize() {
        if (this.#element) {
            this.#element.style.width = `${16 * actualSizeMultiplier}px`;
            this.#element.style.height = `${16 * actualSizeMultiplier}px`;
        }
    }

    start() {
        this.isRunning = true;
        this.moveLoop();
    }

    stop() {
        this.isRunning = false;
    }

    moveLoop() {
        const now = performance.now();
        const deltaTime = now - this.#lastFrameTime;

        if (deltaTime >= CYCLE_DURATION) {
            this.#lastFrameTime = now - (deltaTime % CYCLE_DURATION);

            this.updatePosition();
        }

        if (this.isRunning) {
            setTimeout(() => this.moveLoop(), CYCLE_DURATION);
        }
    }

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
}

export default Entity;
