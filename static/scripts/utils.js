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

/**
 * Vérifie si une position donnée entre en collision avec un mur
 * @param {Array} collisionsData - Tableau des objets de collision
 * @param {Object} position - Position à vérifier {x, y}
 * @param {number} width - Largeur de l'objet
 * @param {number} height - Hauteur de l'objet
 * @returns {boolean} - True si collision détectée
 */
export function checkCollision(collisionsData, position, width, height) {
    // Vérifie chaque coin de l'objet (joueur)
    const corners = [
        { x: position.x, y: position.y },                   // Coin supérieur gauche
        { x: position.x + width, y: position.y },           // Coin supérieur droit
        { x: position.x, y: position.y + height },          // Coin inférieur gauche
        { x: position.x + width, y: position.y + height }   // Coin inférieur droit
    ];
    
    // Vérifie si un coin est dans un mur
    for (const corner of corners) {
        // Arrondit aux coordonnées de la grille (16x16)
        const gridX = Math.floor(corner.x / 16) * 16;
        const gridY = Math.floor(corner.y / 16) * 16;
        
        // Vérifie si cette cellule de la grille contient un mur
        const collision = collisionsData.find(
            col => col.x === gridX && col.y === gridY && col.interaction === 'walls'
        );
        
        if (collision) {
            return true;
        }
    }
    
    return false;
}
