
class GameMap {
    constructor(mapNumber=1) {
        fetch(`/static/assets/map/map${mapNumber}.json`)
        .then(res => res.json())
        .then(json => {
            this.mapJson = json
            this.#load()
        })
        .catch(err => {
            throw new Error("Unable to fetch map data. " + err, {cause: err})
        })
        this.obstacles = []
        
    }

    #load() {
        for(let el of this.mapJson.grid) {
            this.obstacles.push(
                {
                    x: el.x * this.mapJson.config.gridXSize,
                    y: el.y * this.mapJson.config.gridYSize,
                    onCollide: document[el.onCollide],
                    canGoThrough: el.canGoThrough,
                    img: this.mapJson.config.imageSet[el.img]
                }
            )
        }
    }
}

