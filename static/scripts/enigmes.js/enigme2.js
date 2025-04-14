import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";

const maxTimer = 15 * 60 * 1000; // 15 minutes in milliseconds

class Enigme2 {
    static #elementId = "knight";
    /**
     * This method allow to get the Enigme1 object
     * It will return an object with the following properties:
     * - id: the id of the enigme
     * - name: the name of the enigme
     * - description: the description of the enigme
     * - hint: the hint of the enigme
     * - hintPrice: the price of the hint
     * - level: the level of the enigme
     *
     * @returns {Object}
     */
    static get enigme() {
        return {
            id: 1,
            name: "Manage the knigth",
            description:
                "Only the knigth can open the door. You need to find a way to talk with him.",
            hint: "Take the knigth helmet!",
            hintPrice: 50,
            level: 1,
        };
    }

    /**
     * This method allow to get the first key.
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     *
     */
    static takeHelmet() {
        let helmetAvailableToTake =
            LocalStorageService.getUserAttributes("enigme2.helmet") == false
                ? true
                : false;
        if (helmetAvailableToTake) {
            LocalStorageService.setUserAttributes("enigme2.helmet", true);
            return {
                success: true,
                message: "You took the helmet.",
            };
        } else {
            return {
                success: false,
                message: "You already took the key.",
            };
        }
    }
    /**
     * This method return the message to display when
     * the user can interact with the key.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}
     */
    static takeHelmet_interact() {
        if (LocalStorageService.getUserAttributes("enigme2.helmet")) {
            return {
                mainMessage: "Nothing more..",
                subMessage: "You already took the helmet.",
            };
        }
        return {
            mainMessage: "Put on the helmet",
            subMessage: "This helmet look good.",
        };
    }

    /**
     * This method allow to open the door.
     * You need to have the key to open the door.
     * It will end the enigme and unlock the next room.
     *
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     */
    static manipulateTheKnigth() {
        let helmetAvailableToTake =
            LocalStorageService.getUserAttributes("enigme2.helmet") == false
                ? true
                : false;
        if (helmetAvailableToTake) {
            return {
                success: false,
                message: "You need to put the helmet on before..",
            };
        } else {
            const dragNdropContainer =
                document.querySelector(".enigme2_dragNdrop");
            if (!dragNdropContainer) return;
            dragNdropContainer.style.display = "block";
            Game.getInstance().stop();
            /*
      <div class="enigme2_dragNdrop">
        <div class="workspace" id="workspace">
          <div class="block go-forward og-block">Go forward</div>
          <div class="block turn-left og-block">Turn left</div>
          <div class="block turn-rigth og-block">Turn rigth</div>
        </div>
        <button class="run-button" id="egnime2_run">Run</button>
    </div>
    */
        }
    }

    /**
     * This method return the message to display when
     * the user can interact with the door.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}
     */
    static manipulateTheKnigth_interact() {
        if (!LocalStorageService.getUserAttributes("enigme2.helmet")) {
            return {
                mainMessage: "Impossible...",
                subMessage: "The knigth don't talk with lambda...",
            };
        }
        if (LocalStorageService.setUserAttributes("enigme2.isFinished", true)) {
            return {
                mainMessage: "Nothing more to do",
                subMessage: "You made the knigth open the door.",
            };
        }
        return {
            mainMessage: "Give order",
            subMessage: "Make the knigth open the door.",
        };
    }

    static async runDragNDrop(command) {
        const dragNdropContainer = document.querySelector(".enigme2_dragNdrop");
        if (!dragNdropContainer) return;
        dragNdropContainer.style.display = "none";
        Game.getInstance().start();
        await this.#moveKnigth(command);
        const entity = new Entity(this.#elementId);
        if (
            entity.position.x >= 28 * 16 &&
            entity.position.x <= 29 * 16 &&
            entity.position.y == 16 * 16
        ) {
            LocalStorageService.setUserAttributes("enigme2.isFinished", true);
            LocalStorageService.setUserAttributes(
                "enigme2.timestampWhenEnded",
                Date.now()
            );
            Game.getInstance().nextState();
            return true;
        }
        let initialPosition = Game.getInstance().entities.filter(
            (x) => x.id == this.#elementId
        )[0];
        entity.goTo(initialPosition.x, initialPosition.y);

        return false;
    }

    static async #moveKnigth(command = "") {
        const entity = new Entity(this.#elementId);
        entity.start();
        for (const c of command.split("")) {
            switch (c) {
                case "f":
                    await entity.moveForward();
                    break;
                case "r":
                    entity.turnRight();
                    break;
                case "l":
                    entity.turnLeft();
                    break;
            }
        }
        entity.stop();
        return true;
    }

    static isQuestEnded() {
        return false;
    }
}

export default Enigme2;
