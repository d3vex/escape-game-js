import Player from './models/player.js';
import MovementController from './controllers/move.js';
import { actualSizeMultiplier, setBoardBackground } from './models/renderer.js';
const CYCLE_DURATION = 1000 / 30;

class Game {
    constructor() {
        this.player = null;
        this.isRunning = false;
        this.lastFrameTime = 0;

        document.addEventListener('boardReady', (event) => {
            console.log('Board ready, initializing player...');

            this.player = new Player();
            const boardWidth = event.detail.width;
            const boardHeight = event.detail.height;
            const playerSize = 16 * actualSizeMultiplier;

            const initialX = 180;
            const initialY = 50;

            this.player.initialize(initialX, initialY);
            this.movementController = new MovementController(this.player);

            console.log('Game initialized successfully!');

            if (!this.isRunning) {
                this.start();
            }
        });
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
        console.log('Game initializing...');
        setBoardBackground();
        window.addEventListener('resize', setBoardBackground);
    }
}

export default Game;
