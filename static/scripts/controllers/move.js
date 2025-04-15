import { loadInteractionsData } from "../utils.js";
import InteractionManager from "../models/interactionManager.js";
import Game from "../game.js";

class MovementController {
    static #instance = null;

    /**
     * This method allows to get the instance of the MovementController.
     *
     * @returns {MovementController} - The instance of the MovementController
     */
    static getInstance() {
        if (!MovementController.#instance) {
            MovementController.#instance = new MovementController(
                Game.getInstance().player
            );
        }
        return MovementController.#instance;
    }

    constructor(player) {
        if (MovementController.#instance) {
            return MovementController.#instance;
        }

        this.player = player;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            e: false,
        };
        this.virtualKeys = {
            Up: "ArrowUp",
            Down: "ArrowDown",
            Left: "ArrowLeft",
            Right: "ArrowRight",
        };
        this.speed = player.speed;

        MovementController.#instance = this;

        this.setupEventListeners();
        //this.startGameLoop();
    }

    setupEventListeners() {
        window.addEventListener("keydown", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;

                if (e.key === "e") {
                    this.checkForAndTriggerInteraction();
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    startGameLoop() {
        const gameLoop = () => {
            this.updatePlayerPosition();
            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }

    /**
     * This method return all the interactions that is in front of the player.
     *
     * @returns {Array} - An array of interactions that the player can trigger
     */
    checkForInteraction() {
        const playerPos = this.player.position;
        const size = this.player.size;
        const facing = this.player.facing;

        let checkX = playerPos.x;
        let checkY = playerPos.y;

        switch (facing) {
            case 0: // NORTH
                checkY = playerPos.y - size;
                break;
            case 1: // EAST
                checkX = playerPos.x + size;
                break;
            case 2: // SOUTH
                checkY = playerPos.y + size;
                break;
            case 3: // WEST
                checkX = playerPos.x - size;
                break;
        }

        const adjacentPositions = [
            { x: checkX, y: checkY },
            { x: checkX + size, y: checkY },
            { x: checkX - size, y: checkY },
            { x: checkX, y: checkY + size },
            { x: checkX, y: checkY - size },
        ];

        const interactions = adjacentPositions.flatMap((pos) => {
            const gridX = Math.floor(pos.x / 16) * 16;
            const gridY = Math.floor(pos.y / 16) * 16;

            return this.player.collisionsData.filter(
                (item) =>
                    item.x === gridX &&
                    item.y === gridY &&
                    item.interaction !== "walls"
            );
        });

        return interactions;
    }

    /**
     * This method check if the player is in front of an interaction. (using {@link checkForInteraction})
     * If the player is in front of an interaction, it will trigger the interaction.
     */
    checkForAndTriggerInteraction() {
        const interactions = this.checkForInteraction();
        if (interactions.length > 0) {
            interactions.forEach((interaction) => {
                InteractionManager.triggerInteraction(interaction.interaction);
            });
        }
    }

    updatePlayerPosition() {
        let dx = 0;
        let dy = 0;

        if (this.keys[this.virtualKeys.Up]) {
            dy -= this.speed;
            this.player.facing = 0; // NORTH
        }
        if (this.keys[this.virtualKeys.Down]) {
            dy += this.speed;
            this.player.facing = 2; // SOUTH
        }
        if (this.keys[this.virtualKeys.Left]) {
            dx -= this.speed;
            this.player.facing = 3; // WEST
        }
        if (this.keys[this.virtualKeys.Right]) {
            dx += this.speed;
            this.player.facing = 1; // EAST
        }

        // Normalise the speed
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;
        }

        dx *= this.speed;
        dy *= this.speed;

        if (dx !== 0 || dy !== 0) {
            this.player.move(dx, dy);
        }
    }

    /**
     * This method is used to randomize the movement keys.
     * It will be used to randomize the movement keys for the player.
     */
    randomizeMovementKeys() {
        const keys = Object.keys(this.virtualKeys);
        const values = Object.values(this.virtualKeys);
        
        while (values.length > 0) {
            const randomIndex = Math.floor(Math.random() * values.length);
            const rdn2 = Math.floor(Math.random() * keys.length);
            if(this.virtualKeys[keys[rdn2]] == values[randomIndex]){
                continue;
            }
            const randomValue = values.splice(randomIndex, 1)[0];
            const randomKey = keys.splice(rdn2, 1)[0];
            this.virtualKeys[randomKey] = randomValue;
        }

        console.log(this.virtualKeys)
    }

    /**
     * This method is used to reset the movement keys to their default values.
     * It will be used to reset the movement keys for the player.
     */
    resetMovementKeys() {
        this.virtualKeys = {
            Up: "ArrowUp",
            Down: "ArrowDown",
            Left: "ArrowLeft",
            Right: "ArrowRight",
        };
    }
}

export default MovementController;
