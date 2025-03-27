import Obstacles from "./obstacle";

class GameMap {
  // private attributs
  /**
   * mapJson - The json object that contains the map data
   * @type {Object}
   */
  #mapJson = {};
  /**
   * The list that contains all obstacles
   * @type {Obstacles[]}
   */
  #obstacles = [];
  /**
   * ready - A flag that indicates if the map is fully loaded and ready
   * @type {boolean}
   */
  #ready = false;

  constructor(mapNumber = 1) {
    fetch(`/static/assets/map/map${mapNumber}.json`)
      .then((res) => res.json())
      .then((json) => {
        this.#mapJson = json;
        this.#load();
      })
      .catch((err) => {
        throw new Error("Unable to fetch map data. " + err, { cause: err });
      });
  }

  // private methods
  #load() {
    let config = this.#mapJson.config
    for (let el of this.#mapJson.grid) {
      this.#obstacles.push({
        x: el.x * config.gridXSize,
        y: el.y * gridYSize,
        onCollide: document[el.onCollide],
        canGoThrough: el.canGoThrough,
        img: config.imageSet[el.img],
      });
    }
    this.#ready = true;
  }

  /**
   * Return the list of obstacles
   * @returns {Obstacles[]} 
   */
  getObstacles() {
    return this.#obstacles;
  }

  /**
   * Re-set the obstacle at the given index
   * @param {Obstacles} obstacles - The obstacle to set
   * @param {Number} index - The index of the obstacle to set
   */
  updateObstaclesAt(obstacle, index) {
    if (index < 0) throw new Error("Index out of bounds");
    if (index > this.#obstacles.length) throw new Error("Index out of bounds");
    this.#obstacles[index] = obstacle;
  }

  /**
   * Return true if the map is fully loaded and ready
   * @returns {Boolean}
   */
  isReady() {
    return this.#ready;
  }
}

export default GameMap;