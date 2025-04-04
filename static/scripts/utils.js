import {actualSizeMultiplier} from "./models/renderer.js";

/**
 * Charge les données de collision depuis un fichier JSON
 * @returns {Promise<Array>} Les données de collision
 */
export async function loadCollisionsData() {
    try {
        const response = await fetch('static/assets/json/collisions.json');
        if (!response.ok) {
            throw new Error('Impossible de charger les données de collision');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des collisions:', error);
        return [];
    }
}

export function checkCollision(collisionsData, oldPosition, newPosition, size) {
    const possibleMovement = {
        x: newPosition.x - oldPosition.x,
        y: newPosition.y - oldPosition.y
    };

    const hasCollision = (x, y) => {
        const gridX = Math.floor(x / 16) * 16;
        const gridY = Math.floor(y / 16) * 16;
        return collisionsData.some(col =>
            col.x === gridX &&
            col.y === gridY &&
            col.interaction === 'walls'
        );
    };

    // Check horizontal movement
    if (possibleMovement.x !== 0) {
        const testX = possibleMovement.x > 0 ?
            oldPosition.x + possibleMovement.x + size :
            oldPosition.x + possibleMovement.x;

        if (hasCollision(testX, oldPosition.y) ||
            hasCollision(testX, oldPosition.y + size)) {
            possibleMovement.x = 0;
        }
    }

    // Check vertical movement
    if (possibleMovement.y !== 0) {
        const testY = possibleMovement.y > 0 ?
            oldPosition.y + possibleMovement.y + size :
            oldPosition.y + possibleMovement.y;

        const adjustedX = oldPosition.x + possibleMovement.x;

        if (hasCollision(adjustedX, testY) ||
            hasCollision(adjustedX + size, testY)) {
            possibleMovement.y = 0;
        }
    }

    return {
        x: oldPosition.x + possibleMovement.x,
        y: oldPosition.y + possibleMovement.y
    };
}