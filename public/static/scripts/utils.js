import interactionManager from "./models/interactionManager.js";
import manageInteractBox from "./GUI/manageInteractBox.js";
import MovementController from "./controllers/move.js";

/**
 * @function preloadAllGameAssets
 * @description Précharge tous les assets du jeu (images, animations, etc.)
 * @returns {Promise<boolean>} Une promesse qui se résout en true si le préchargement est réussi
 * @throws {Error} Si une erreur se produit lors du préchargement
 */
export async function loadInteractionsData(id) {
    try {
        const response = await fetch(
            "static/assets/json/interactions-" + id + ".json"
        );
        if (!response.ok) {
            throw new Error(
                "Impossible de charger les données des interactions"
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement des interactions:", error);
        return [];
    }
}

/**
 * @function preloadImage
 * @description Précharge une image en créant un nouvel objet Image et en lui assignant la source
 * @param collisionsData
 * @param x
 * @param y
 * @returns {*}
 */
function getCollisionsAtPosition(collisionsData, x, y) {
    const gridX = Math.floor(x / 16) * 16;
    const gridY = Math.floor(y / 16) * 16;
    return collisionsData.filter((col) => col.x === gridX && col.y === gridY);
}

/**
 * @function checkHorizontalCollision
 * @description Vérifie les collisions horizontales et retourne la distance de mouvement possible
 * @param collisionsData
 * @param oldPosition
 * @param possibleMovement
 * @param size
 * @returns {number|*|number}
 */
function checkHorizontalCollision(
    collisionsData,
    oldPosition,
    possibleMovement,
    size
) {
    if (possibleMovement.x === 0) return 0;

    const testX =
        possibleMovement.x > 0
            ? oldPosition.x + possibleMovement.x + size
            : oldPosition.x + possibleMovement.x;

    const horizontalCollisions = [
        ...getCollisionsAtPosition(collisionsData, testX, oldPosition.y),
        ...getCollisionsAtPosition(collisionsData, testX, oldPosition.y + size),
    ];

    const hasWall =  horizontalCollisions.length > 0;

    return hasWall ? 0 : possibleMovement.x;
}

/**
 * @function checkVerticalCollision
 * @description Vérifie les collisions verticales et retourne la distance de mouvement possible
 * @param collisionsData
 * @param oldPosition
 * @param possibleMovement
 * @param size
 * @returns {number|*|number}
 */
function checkVerticalCollision(
    collisionsData,
    oldPosition,
    possibleMovement,
    size
) {
    if (possibleMovement.y === 0) return 0;

    const testY =
        possibleMovement.y > 0
            ? oldPosition.y + possibleMovement.y + size
            : oldPosition.y + possibleMovement.y;

    const adjustedX = oldPosition.x + possibleMovement.x;

    const verticalCollisions = [
        ...getCollisionsAtPosition(collisionsData, adjustedX, testY),
        ...getCollisionsAtPosition(collisionsData, adjustedX + size, testY),
    ];

    const hasWall = verticalCollisions.length > 0;

    return hasWall ? 0 : possibleMovement.y;
}

/**
 * @function checkCollision
 * @description Vérifie les collisions et retourne la nouvelle position possible
 * @param collisionsData
 * @param oldPosition
 * @param newPosition
 * @param size
 * @returns {{x: *, y: *}}
 */
export function checkCollision(collisionsData, oldPosition, newPosition, size) {
    const possibleMovement = {
        x: newPosition.x - oldPosition.x,
        y: newPosition.y - oldPosition.y,
    };

    const finalMovementX = checkHorizontalCollision(
        collisionsData,
        oldPosition,
        possibleMovement,
        size - 1
    ); // -1 so you can enter 1 block gap

    possibleMovement.x = finalMovementX;

    const finalMovementY = checkVerticalCollision(
        collisionsData,
        oldPosition,
        possibleMovement,
        size - 1
    ); // -1 so you can enter 1 block gap

    let finalPosition = {
        x: oldPosition.x + finalMovementX,
        y: oldPosition.y + finalMovementY,
    };

    showInteraction();

    return finalPosition;
}

/**
 * @function showInteraction
 * @description Affiche la boîte d'interaction si une interaction est détectée
 */
export function showInteraction() {
    let collisions = MovementController.getInstance().checkForInteraction();
    if (collisions.length == 1) {
        let message = interactionManager.getInteractionHandler(
            collisions[0].interaction + "_interact"
        )();
        manageInteractBox.revealInteractBox(
            message.mainMessage,
            message.subMessage
        );
    } else {
        manageInteractBox.hideInteractBox();
    }
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
