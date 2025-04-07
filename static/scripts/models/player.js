import { checkCollision } from '../utils.js';
import {actualSizeMultiplier} from "./renderer.js";

class Player {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.element = document.getElementById('pixel-square');
        this.speed = 1;
        this.boardElement = document.getElementById('board');
        this.collisionsData = [];
        this.size = 16; // Taille du joueur
        this.facing = 2; // NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3
    }

    setCollisionsData(data) {
        this.collisionsData = data;
    }

    move(dx, dy) {
        const boardRect = this.boardElement.getBoundingClientRect();
        const playerRect = this.element.getBoundingClientRect();
        const playerSize = playerRect.width;

        let newX = this.position.x + dx;
        let newY = this.position.y + dy;

        const maxX = boardRect.width - playerSize;
        const maxY = boardRect.height - playerSize;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        const newPosition = { x: newX, y: newY };

        this.position = checkCollision(this.collisionsData, this.position, newPosition, this.size);

        this.updatePosition();
    }

    updatePosition() {
        if (this.element) {
            this.element.style.transform = 'none';
            this.element.style.top = `${this.position.y * actualSizeMultiplier}px`;
            this.element.style.left = `${this.position.x * actualSizeMultiplier}px`;
        }
    }

    updatePlayerSize() {
        this.element.style.width = `${16 * actualSizeMultiplier}px`;
        this.element.style.height = `${16 * actualSizeMultiplier}px`;
    }
}

export default Player;
