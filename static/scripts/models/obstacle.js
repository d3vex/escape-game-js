class Obstacles {
    #x;
    #y;
    #w;
    #h
    #onCollide;
    #canGoThrough;
    #sprite
    #spritesList = []
    constructor(x, y, w, h, onCollide, canGoThrough, sprite) {
        this.#x = x;
        this.#y = y;
        this.#w = w;
        this.#h = h;

        this.#onCollide = onCollide;
        this.#canGoThrough = canGoThrough;
        if(typeof img == "object") {
            this.#sprite = img[0];
            this.#spritesList = img;
        }else{
            this.#sprite = img;
        }
    }

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    /**
     * This method allow to move the absolute position of the obstacle
     * @param {Object} m
     * @param {Number} m.x
     * @param {Number} m.y
     */
    move(m) {
        this.#x += m.x;
        this.#y += m.y;
    } 

    get onCollide() {
        return this.#onCollide;
    }
    get canGoThrough() {
        return this.#canGoThrough;
    }
    get sprite() {
        return this.#sprite;
    }
    /**
     * This method change the current sprite to the next one in the list
     */
    nextSprite() {
        if(this.spritesList.length == 0) return;
        let index = (this.#spritesList.indexOf(this.#sprite) + 1) % this.#spritesList.length;
        this.#sprite = this.#spritesList[index];
    }
    
}

export default Obstacles;