import { loadInteractionsData } from '../utils.js';
import InteractionManager from '../models/interactionManager.js';

class MovementController {
    constructor(player) {
        this.player = player;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            e: false
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

                if (e.key === 'e') {
                    this.checkForInteraction();
                }
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
            { x: checkX, y: checkY - size }
        ];

        const interactions = adjacentPositions.flatMap(pos => {
            const gridX = Math.floor(pos.x / 16) * 16;
            const gridY = Math.floor(pos.y / 16) * 16;

            return this.player.collisionsData.filter(item =>
                item.x === gridX &&
                item.y === gridY &&
                item.interaction !== 'walls'
            );
        });

        if (interactions.length > 0) {
            interactions.forEach(interaction => {
                InteractionManager.triggerInteraction(interaction.interaction);
            });
        }
    }

    updatePlayerPosition() {
        let dx = 0;
        let dy = 0;

        if (this.keys.ArrowUp) {
            dy -= this.speed;
            this.player.facing = 0; // NORTH
        }
        if (this.keys.ArrowDown) {
            dy += this.speed;
            this.player.facing = 2; // SOUTH
        }
        if (this.keys.ArrowLeft) {
            dx -= this.speed;
            this.player.facing = 3; // WEST
        }
        if (this.keys.ArrowRight) {
            dx += this.speed;
            this.player.facing = 1; // EAST
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

