import { checkCollision } from '../utils.js';

class Player {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.element = document.getElementById('pixel-square');
        this.speed = 1;
        this.boardElement = document.getElementById('board');
        this.collisionsData = [];
        this.size = 16; // Taille du joueur (carré de 16x16px)
    }

    initialize(x, y) {
        this.position = { x, y };
        this.updatePosition();
    }

    // Charger les données de collision
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

        // Limites du plateau
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // Vérifier les collisions pour le mouvement horizontal
        if (dx !== 0) {
            const horizontalPosition = { x: newX, y: this.position.y };
            if (!this.collisionsData.length || !checkCollision(this.collisionsData, horizontalPosition, playerSize, playerSize)) {
                this.position.x = newX;
            }
        }

        // Vérifier les collisions pour le mouvement vertical
        if (dy !== 0) {
            const verticalPosition = { x: this.position.x, y: newY };
            if (!this.collisionsData.length || !checkCollision(this.collisionsData, verticalPosition, playerSize, playerSize)) {
                this.position.y = newY;
            }
        }

        this.updatePosition();
    }

    updatePosition() {
        if (this.element) {
            this.element.style.transform = 'none';
            this.element.style.top = `${this.position.y}px`;
            this.element.style.left = `${this.position.x}px`;
        }
    }
}

export default Player;
