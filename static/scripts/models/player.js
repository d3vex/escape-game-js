import LocalStorageService from '../services/localStorageService.js';
import { checkCollision } from '../utils.js';
import { actualSizeMultiplier, preloadImage } from "./renderer.js";

class Player {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.element = document.getElementById('pixel-square');
        this.speed = 1;
        this.boardElement = document.getElementById('board');
        this.collisionsData = [];
        this.size = 16; // Player size

        this.NORTH = 'north';
        this.EAST = 'east';
        this.SOUTH = 'south';
        this.WEST = 'west';
        this.facing = this.SOUTH; // Default facing south

        this.currentAnimation = 'idle';
        this.animationFrame = 1;
        this.animationFrameCount = 4;
        this.animationSpeed = 200;
        this.lastAnimationTime = 0;
        this.animationFrames = {}; // Cache for preloaded animation frames

        this.animationTypes = {
            'idle': 4,
            'walk': 8
        };

        this.isMoving = false;

        this.preloadAnimations().then(() => {
            this.startIdleAnimation();
        });
    }

    async preloadAnimations() {
        const baseUrl = 'static/assets/images/sprite/';
        const directions = [this.NORTH, this.EAST, this.SOUTH, this.WEST];
        const animationTypes = Object.keys(this.animationTypes);
        
        const promises = [];
        
        for (const animType of animationTypes) {
            const frameCount = this.animationTypes[animType];
            
            for (const direction of directions) {
                const animKey = `${animType}-${direction}`;
                this.animationFrames[animKey] = [];
                
                for (let i = 1; i <= frameCount; i++) {
                    const src = `${baseUrl}${animType}/${direction}${i}.png`;
                    promises.push(preloadImage(src).then(img => {
                        this.animationFrames[animKey][i] = src;
                    }).catch(err => {
                        console.warn(`Failed to preload ${src}:`, err);
                    }));
                }
            }
        }
        
        return Promise.all(promises);
    }

    setCollisionsData(data) {
        this.collisionsData = data;
    }

    move(dx, dy) {
        // Update facing direction based on movement
        if (dx > 0) this.facing = this.EAST;
        else if (dx < 0) this.facing = this.WEST;
        else if (dy < 0) this.facing = this.NORTH;
        else if (dy > 0) this.facing = this.SOUTH;
        
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

        // Start walking animation if not already walking
        if (!this.isMoving) {
            this.startWalkAnimation();
        }
        
        this.position = checkCollision(this.collisionsData, this.position, newPosition, this.size);

        this.updatePosition();
        this.updateSprite(); // Update sprite when direction changes
    }

    updatePosition() {
        LocalStorageService.setItem('playerPosition', this.position);
        if (this.element) {
            this.element.style.transform = 'none';
            this.element.style.top = `${this.position.y * actualSizeMultiplier}px`;
            this.element.style.left = `${this.position.x * actualSizeMultiplier}px`;
        }
    }

    updatePlayerSize() {
        if (this.element) {
            this.element.style.width = `${16 * actualSizeMultiplier}px`;
            this.element.style.height = `${16 * actualSizeMultiplier}px`;
            this.element.style.imageRendering = 'pixelated';
        }
    }
    
    startIdleAnimation() {
        this.currentAnimation = 'idle';
        this.animationFrame = 1;
        this.animationFrameCount = this.animationTypes['idle'];
        this.isMoving = false;
        this.updateSprite();
    }
    
    startWalkAnimation() {
        this.currentAnimation = 'walk';
        this.animationFrame = 1;
        this.animationFrameCount = this.animationTypes['walk'];
        this.isMoving = true;
        this.updateSprite();
    }
    
    stopMoving() {
        if (this.isMoving) {
            this.startIdleAnimation();
        }
    }

    updateSprite() {
        if (this.element) {
            const animKey = `${this.currentAnimation}-${this.facing}`;

            if (this.animationFrames[animKey] &&
                this.animationFrames[animKey][this.animationFrame]) {
                this.element.style.backgroundImage = `url('${this.animationFrames[animKey][this.animationFrame]}')`;
            } else {
                const url = `static/assets/images/sprite/${this.currentAnimation}/${this.facing}${this.animationFrame}.png`;
                this.element.style.backgroundImage = `url('${url}')`;
                preloadImage(url).then(img => {
                    if (!this.animationFrames[animKey]) {
                        this.animationFrames[animKey] = [];
                    }
                    this.animationFrames[animKey][this.animationFrame] = url;
                }).catch(err => {
                    console.warn(`Failed to load sprite ${url}:`, err);
                });
            }
        }
    }

    updateAnimation(timestamp) {
        if (!this.lastAnimationTime) {
            this.lastAnimationTime = timestamp;
            return;
        }

        const deltaTime = timestamp - this.lastAnimationTime;

        if (deltaTime >= this.animationSpeed) {
            this.lastAnimationTime = timestamp;
            this.animationFrame = (this.animationFrame % this.animationFrameCount) + 1;
            this.updateSprite();
        }
    }
}

export default Player;
