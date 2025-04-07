import InteractionManager from "./models/interactionManager.js";

/**
 * Charge les données de collision depuis un fichier JSON
 * @returns {Promise<Array>} Les données de collision
 */
export async function loadInteractionsData() {
    try {
        const response = await fetch('static/assets/json/interactions.json');
        if (!response.ok) {
            throw new Error("Impossible de charger les données des interactions");
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des interactions:', error);
        return [];
    }
}

function getCollisionsAtPosition(collisionsData, x, y) {
    const gridX = Math.floor(x / 16) * 16;
    const gridY = Math.floor(y / 16) * 16;
    return collisionsData.filter(col =>
        col.x === gridX &&
        col.y === gridY
    );
}


function checkHorizontalCollision(collisionsData, oldPosition, possibleMovement, size) {
    if (possibleMovement.x === 0) return 0;

    const testX = possibleMovement.x > 0 ?
        oldPosition.x + possibleMovement.x + size :
        oldPosition.x + possibleMovement.x;

    const horizontalCollisions = [
        ...getCollisionsAtPosition(collisionsData, testX, oldPosition.y),
        ...getCollisionsAtPosition(collisionsData, testX, oldPosition.y + size)
    ];

    const hasWall = horizontalCollisions.length > 0;

    return hasWall ? 0 : possibleMovement.x;
}

function checkVerticalCollision(collisionsData, oldPosition, possibleMovement, size) {
    if (possibleMovement.y === 0) return 0;

    const testY = possibleMovement.y > 0 ?
        oldPosition.y + possibleMovement.y + size :
        oldPosition.y + possibleMovement.y;

    const adjustedX = oldPosition.x + possibleMovement.x;

    const verticalCollisions = [
        ...getCollisionsAtPosition(collisionsData, adjustedX, testY),
        ...getCollisionsAtPosition(collisionsData, adjustedX + size, testY)
    ];

    const hasWall = verticalCollisions.length > 0;

    return hasWall ? 0 : possibleMovement.y;
}

export function checkCollision(collisionsData, oldPosition, newPosition, size) {
    const possibleMovement = {
        x: newPosition.x - oldPosition.x,
        y: newPosition.y - oldPosition.y
    };

    const finalMovementX = checkHorizontalCollision(collisionsData, oldPosition, possibleMovement, size);

    possibleMovement.x = finalMovementX;
    
    const finalMovementY = checkVerticalCollision(collisionsData, oldPosition, possibleMovement, size);

    return {
        x: oldPosition.x + finalMovementX,
        y: oldPosition.y + finalMovementY
    };
}

