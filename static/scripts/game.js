import Player from './models/player.js';
import MovementController from './controllers/move.js';
import { actualSizeMultiplier, setBoardBackground, preloadAllGameAssets } from './models/renderer.js';
import { loadInteractionsData } from './utils.js';

const CYCLE_DURATION = 1000 / 30;

class Game {
    static #instance = null;

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

    start() {
        console.log('Starting game loop...');
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
        console.log('Game initializing...');
        
        await this.preloadAssets();
        setBoardBackground(this.currentState);
        window.addEventListener('resize', () => setBoardBackground(this.currentState));
        
        document.addEventListener('boardReady', async (event) => {
            if (!this.player) {
                console.log('Board ready, initializing player...');

                const boardWidth = event.detail.width;
                const boardHeight = event.detail.height;
                const playerSize = 16 * actualSizeMultiplier;

                const initialX = 180;
                const initialY = 50;

                this.player = new Player(initialX, initialY);
                await this.loadInteractions();
                this.player.setCollisionsData(this.interactionsData);

                this.player.updatePosition();
                this.movementController = new MovementController(this.player);

                console.log('Game initialized successfully!');

                if (!this.isRunning) {
                    this.start();
                }
            } else {
                console.log('Board resized, updating player position...');
                this.player.updatePlayerSize();
            }
        });
    }
}

export default Game;

