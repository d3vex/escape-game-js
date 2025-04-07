import { loadInteractionsData } from '../utils.js';

class MovementController {
    constructor(player) {
        this.player = player;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.speed = player.speed;

        this.setupEventListeners();
        this.loadCollisions();
        this.startGameLoop();
    }

    async loadCollisions() {
        const collisionsData = await loadInteractionsData();
        this.player.setCollisionsData(collisionsData);
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
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

    updatePlayerPosition() {
        let dx = 0;
        let dy = 0;

        if (this.keys.ArrowUp) {
            dy -= this.speed;
        }
        if (this.keys.ArrowDown) {
            dy += this.speed;
        }
        if (this.keys.ArrowLeft) {
            dx -= this.speed;
        }
        if (this.keys.ArrowRight) {
            dx += this.speed;
        }

        // Normaliser la vitesse
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
}

export default MovementController;
