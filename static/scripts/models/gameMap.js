import { loadInteractionsData } from '../utils.js';

/**
 * Classe qui gère la carte du jeu et ses éléments
 */
class GameMap {
    constructor() {
        this.mapData = null;
        this.collisionsData = [];
    }

    /**
     * Initialise la carte du jeu
     */
    async initialize() {
        await this.loadMapData();
    }

    /**
     * Charge les données de carte (collisions, interactions, etc.)
     */
    async loadMapData() {
        this.collisionsData = await loadInteractionsData();
        console.log(`GameMap: Loaded ${this.collisionsData.length} map elements`);
    }

    /**
     * Obtient les données de collision pour le joueur
     */
    getCollisionsData() {
        return this.collisionsData;
    }
}

export default GameMap;
