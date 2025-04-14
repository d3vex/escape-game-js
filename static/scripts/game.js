import Player from "./models/player.js";
import MovementController from "./controllers/move.js";
import { actualSizeMultiplier, setBoardBackground } from "./models/renderer.js";
import { loadInteractionsData } from "./utils.js";
import { CYCLE_DURATION } from "./variables.js";
import Entity from "./models/entity.js";
import Enigme1 from "./enigmes.js/enigme1.js";
import Enigme2 from "./enigmes.js/enigme2.js";
import LocalStorageService from "./services/localStorageService.js";

class Game {
    static #instance = null;
    static #entities = [
        {
            id: "knight",
            x: 304,
            y: 128,
            x2: 448,
            y2: 256,
            secondCondition: Enigme2.isQuestEnded,
            img: "static/assets/images/knight.png",
        },
    ];

    #enigmes = [Enigme1, Enigme2];

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

                if (!this.isRunning) {
                    this.start();
                }
            } else {
                console.log("Board resized, updating player position...");
                this.player.updatePlayerSize();
                for (const e of Game.#entities) {
                    if(e.secondCondition && e.secondCondition()) {
                        e.x = e.x2;
                        e.y = e.y2;
                    }
                    const entity = new Entity(e.id, e.x, e.y);
                    entity.updateEntitySize();
                    entity.updatePosition();
                }
            }
        });

        // Store the instance
        Game.#instance = this;
    }

    async loadInteractions() {
        this.interactionsData = await loadInteractionsData(this.currentState);
        console.log(`Loaded ${this.interactionsData.length} interactions`);
    }

    async nextState() {
        this.currentState++;
        console.log(`Loading state ${this.currentState}...`);

        setBoardBackground(this.currentState);

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

        if (deltaTime >= CYCLE_DURATION) {
            this.lastFrameTime = now - (deltaTime % CYCLE_DURATION);

            this.update(deltaTime);
            this.render();
        }

        if (this.isRunning) {
            setTimeout(() => this.gameLoop(), CYCLE_DURATION);
        }
    }

    update(deltaTime) {
        if (this.player) {
        }
    }

    render() {
        if (this.player) {
            this.player.updatePosition();
        }
    }

    initialize() {
        console.log("Game initializing...");
        this.#fetchCurrentState();
        setBoardBackground(this.currentState);
        window.addEventListener("resize", () =>
            setBoardBackground(this.currentState)
        );
    }

    #fetchCurrentState() {
        console.log("Fetching current state...");
        for (const enigme of this.#enigmes) {
            if (enigme.isQuestEnded()) {
                this.currentState++;
            }
        }
        console.log(`Current state is ${this.currentState}`);
    }

    get entities() {
        return Game.#entities;
    }
}

export default Game;
