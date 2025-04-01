import GameMap from "./gameMap.js";

class Renderer {
  #x = 0;
  #y = 0;
  #w = 0;
  #h = 0;
  #speed = 1;
  /**
   * @type {GameMap}
   */
  #map = null;
  #canvas = null;
  /**
   * @type {CanvasRenderingContext2D}
   */
  #ctx = null;
  #loop = null;
  displayX = 0;
  displayY = 0;

  constructor(canvasId, rendererJson) {
    this.#canvas = document.getElementById(canvasId) ?? false;
    if (this.#canvas == false)
      throw new Error("Unable to find the canvas to render in");

    let { w, h, speed, displayX, displayY, mapNumber } = rendererJson;

    this.#w = w ?? this.#w;
    this.#h = h ?? this.#h;
    this.#speed = speed ?? this.#speed;
    this.#map = new GameMap(mapNumber ?? 1);

    this.displayX = displayX ?? this.displayX;
    this.displayY = displayY ?? this.displayY;

    this.#canvas = document.getElementById(canvasId);
    this.#ctx = this.#canvas.getContext("2d");
    this.#ctx.imageSmoothingEnabled = false;

  }

  /**
   * This method is used to start the rendering in an interval.
   * The render is called every 1000/26 ms (26 fps).
   */
  startRendering() {
    this.#loop = setInterval(() => {
      this.render();
    }, 1000 / 30);
  }
  /**
   * This method is used to stop the rendering interval.
   */
  stopRendering() {
    clearInterval(this.#loop);
  }

  render() {
    if (this.#map == null || !this.#map.isReady()) {
      console.error("Map is not loaded yet");
      return;
    }
    console.log("rendering");
    this.#map.obstacles.forEach((obj) => {
      if (
        obj.x + obj.w > background.displayX &&
        obj.y + obj.h > background.displayY &&
        obj.x < background.displayX + background.w &&
        obj.y < background.displayY + background.h
      ) {
        this.#ctx.drawImage(
          obj.spriteImage,
          0, 0, obj.w, obj.h,
          obj.x - background.displayX,
          obj.y - background.displayY,
          obj.w, obj.h
        );
      }
    });
  }

  // Check if the localStorage is empty or corrupted
  // This try to parse the json, it will throw an error if it's corrupted
  // And will return null if the given string is null
  static #isRendererClassAvailable() {
    try {
      let rendererJson = JSON.parse(localStorage.getItem("renderer"));
      return rendererJson ?? false;
    } catch (error) {
      console.error("Error parsing renderer data from localStorage:", error);
      console.error("Reset renderer and return null");
      localStorage.removeItem("renderer");
    }
    return false;
  }
  /**
   * Create factory for Renderer class.
   * This method allow to construct Renderer without error
   * when localStorage is empty or corrupted.
   *
   * @param {String} canvasId
   * @param {Number} mapNumber This parameter is optionnal and represent the mapNumber used to render.
   * @returns {Renderer | null} The Renderer instance or null if unable to create
   */
  static create(canvasId, mapNumber = null) {
    if (!document.getElementById(canvasId)) {
      console.error("Canvas used to render was not found: ", error);
      return null;
    }
    let rendererJson = Renderer.#isRendererClassAvailable();
    if (rendererJson != false && rendererJson.mapNumber) {
      return new Renderer(canvasId, rendererJson);
    }
    // If the localStorage is empty or corrupted, we create a new Renderer
    // and save it in localStorage
    let renderer = new Renderer(canvasId, { mapNumber: mapNumber });
    localStorage.setItem("renderer", JSON.stringify(renderer));
    return renderer;
  }
}

export default Renderer;
