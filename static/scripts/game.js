import Player from "./models/player.js";
import MovementController from "./controllers/move.js";
import { actualSizeMultiplier, setBoardBackground, preloadAllGameAssets } from "./models/renderer.js";
import { loadInteractionsData } from "./utils.js";
import { CYCLE_DURATION } from "./variables.js";
import { updateEnigmeBoxContent } from "./GUI/enigmeManager.js"
import Entity from "./models/entity.js";
import {Enigme1, Enigme2, Enigme3, Enigme4, Enigme5}from "./enigmes.js/enigmes.js" 
import LocalStorageService from "./services/localStorageService.js";


class Game {
    static #instance = null;
    static #entities = [
        {
            id: "knight",
            x: 336,
            y: 128,
            x2: 464,
            y2: 240,
            secondCondition: Enigme2.isQuestEnded,
            img: "static/assets/images/sprite/knight/idle.png",
        },
    ];

    #enigmes = [Enigme1, Enigme2, Enigme3, Enigme4, Enigme5];

    static getInstance() {
        if (!Game.#instance) {
            Game.#instance = new Game();
        }
        return Game.#instance;
    }

    constructor() {
        if (Game.#instance) {
            return Game.#instance;
        }

        this.player = null;
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.interactionsData = [];
        this.currentState = 1;
        this.assetsLoaded = false;

        // Store the instance
        Game.#instance = this;
    }

    async preloadAssets() {
        try {
            await preloadAllGameAssets();

            this.assetsLoaded = true;
            console.log("All game assets preloaded successfully");

            const assetsLoadedEvent = new CustomEvent('assetsLoaded');
            document.dispatchEvent(assetsLoadedEvent);
        } catch (error) {
            console.error("Error preloading assets:", error);
        }
    }

    async loadInteractions() {
        this.interactionsData = await loadInteractionsData(this.currentState);
        console.log(`Loaded ${this.interactionsData.length} interactions`);
    }

    async changeState(newState) {
        if (this.currentState !== newState) {
            console.log(`Changing state from ${this.currentState} to ${newState}`);
            this.currentState = newState;

            setBoardBackground(this.currentState);

            await this.loadInteractions();

            if (this.player) {
                this.player.setCollisionsData(this.interactionsData);
            }
        }
    }

    async nextState() {
        this.currentState++;
        console.log(`Loading state ${this.currentState}...`);

        await setBoardBackground(this.currentState);

        await this.loadInteractions();

        if (this.player) {
            this.player.setCollisionsData(this.interactionsData);
        }
    }

    get collisionsData() {
        return this.player.collisionsData;
    }

    start() {
        console.log("Starting game loop...");
        this.isRunning = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;

        if (deltaTime >= CYCLE_DURATION && this.isRunning) {
            this.lastFrameTime = now - (deltaTime % CYCLE_DURATION);
            MovementController.getInstance().updatePlayerPosition();
            this.update(deltaTime);
            this.render();
        }

        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    update(deltaTime) {
        if (this.player) {
            // Update player animation on each frame
            const now = performance.now();
            this.player.updateAnimation(now);
        }
    }

    render() {
        if (this.player) {
            this.player.updatePosition();
        }
    }

    async initialize() {
        console.log("Game initializing...");
        this.#fetchCurrentState();
        await this.preloadAssets();
        setBoardBackground(this.currentState);
        window.addEventListener("resize", () =>
            setBoardBackground(this.currentState)
        );

        document.addEventListener("boardReady", async (event) => {
            if (!this.player) {
                console.log("Board ready, initializing player...");

                const boardWidth = event.detail.width;
                const boardHeight = event.detail.height;
                const playerSize = 16 * actualSizeMultiplier;

                let playerPosition =
                    LocalStorageService.getItem("playerPosition");
                if (playerPosition != false) {
                    playerPosition = JSON.parse(playerPosition);
                }

                if (!playerPosition || !playerPosition.x || !playerPosition.y) {
                    playerPosition = {
                        x: 180,
                        y: 50,
                    };
                }

                this.player = new Player(playerPosition.x, playerPosition.y);
                await this.loadInteractions();
                this.player.setCollisionsData(this.interactionsData);

                this.player.updatePosition();
                this.movementController = new MovementController(this.player);

                console.log("Game initialized successfully!");

            } else {
                console.log("Board resized, updating player position...");
                this.player.updatePlayerSize();
                for (const e of Game.#entities) {

                    if(typeof e.secondCondition == "function" && e.secondCondition()) {
                        e.x = e.x2;
                        e.y = e.y2;
                    }
                    const entity = new Entity(e.id, e.x, e.y);
                    entity.updateEntitySize();
                    entity.updatePosition();
                }
            }
        });
    }

    #fetchCurrentState() {
        console.log("Fetching current state...");
        for (const enigme of this.#enigmes) {
            if (enigme.isQuestEnded(true)) {
                this.currentState++;
            } else {
                updateEnigmeBoxContent(enigme.enigme.name, enigme.enigme.description);
                break;
            }
        }
        console.log(`Current state is ${this.currentState}`);
    }

    get entities() {
        return Game.#entities;
    }
}

export default Game;