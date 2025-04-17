import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import hiddenQuest from "../GUI/hiddenQuest.js";

class Enigme2 {
    static #elementId = "knight";
    /**
     * This method allow to get the Enigme2 object
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
            id: 2,
            name: "Manage the knigth",
            description:
                "Only the knigth can open the door. You need to find a way to talk with him.",
            hint: "Take the knigth helmet!",
            hintPrice: 50,
            level: 1,
        };
    }

    /**
     * This method allow to put on the knight helmet.
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
            // Set the helmet as taken
            LocalStorageService.setUserAttributes("enigme2.helmet", true);
            showInteraction(); // Update the interaction message
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
     * the user can interact with the helmet.
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
     * This method allow to open the dragNdrop modal.
     * You need to have the helmet equiped to talk with the knight.
     *
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     */
    static manipulateTheKnigth() {
        // Set event to close the modal and restart the game
        document.querySelector(".enigme2_dragNdrop .closeSymbol").onclick =
            Enigme2.#updateModal(false);

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
            showInteraction(); // Update the interaction message
            // Fetch the modal and display it if it exists
            this.#updateModal(true); // Show the modal
        }
    }

    /**
     * This method return the message to display when
     * the user can interact with the knight.
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
        if (LocalStorageService.getUserAttributes("enigme2.isFinished")) {
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

    /**
     * This method allow to run the command given by the user.
     * It will move the knight following the given dragNdrop command.
     * It will check if the knight reach the door.
     * If the knight reach the door, it will end the enigme and unlock the next room.
     * If the knight didn't reach the door, it will reset the knight position.
     * A message will be displayed to inform the user if the knight reach the door or not.
     *
     * @param {String} command - The command to run.
     * @returns {{
     *      success: Boolean,
     *     message: String}
     * }
     * */
    static async runDragNDrop(command) {
        // Fetch the modal and hide it if it exists
        const dragNdropContainer = document.querySelector(".enigme2_dragNdrop");
        if (!dragNdropContainer) return;
        dragNdropContainer.style.display = "none";
        // Wait for and perform the knight movement
        await this.#moveKnigth(command);

        // Restart the game loop
        Game.getInstance().start();
        // Fetch the knight enity and check if it reach the door
        const entity = new Entity(this.#elementId);
        if (
            entity.position.x >= 28 * 16 &&
            entity.position.x <= 29 * 16 &&
            entity.position.y == 15 * 16
        ) {
            // If he reach the door,
            await Enigme2.#end(); // End the enigme
            return true;
        }
        showInteraction(); // Update the interaction message
        // If he didn't reach the door,
        // Reset the knight position

        let initialPosition = Game.getInstance().entities.filter(
            (x) => x.id == this.#elementId
        )[0];
        entity.goTo(initialPosition.x, initialPosition.y);
        // And inform the user that the knight didn't reach the door
        messagePopUp("Fail", "The knigth didn't reach the door. Try again.");
        togglePopUp();

        return false;
    }

    /**
     * This method allow to move the knight
     * The movement is asynchrone.
     * It's waiting for the movement to be finished before continuing.
     * The entity update loop is working only during the movement.
     *
     * @param {String} command - The command to run.
     * @returns {true}
     * */
    static async #moveKnigth(command = "") {
        const entity = new Entity(this.#elementId);
        entity.start(); // Start the entity update loop
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
        entity.stop(); // Stop the entity update loop
        return true;
    }

    /**
     * This method allow to update the modal visibility
     * and start/stop the game.
     * */
    static #updateModal(visible = true) {
        // Fetch the modal and hide it if it exists
        const dragNdropContainer = document.querySelector(".enigme2_dragNdrop");
        if (!dragNdropContainer) return;
        dragNdropContainer.style.display = visible ? "block" : "none";
        visible ? Game.getInstance().stop() : Game.getInstance().start();
    }

    /**
     * This method allow to end the enigme
     * and unlock the next room.
     */
    static async #end() {
        // Set all attributes that are needed to finish the enigme
        LocalStorageService.setUserAttributes("enigme2.isFinished", true);
        LocalStorageService.setUserAttributes(
            "enigme2.timestampWhenEnded",
            Date.now()
        );
        // Fetch the next game state
        await Game.getInstance().nextState();
        showInteraction(); // Update the interaction message
        // Display the message to inform the user that the knight reach the door
        messagePopUp("Success", "You made the knigth open the door.");
        togglePopUp();
        hiddenQuest(Enigme2.enigme.id); // Unlock the next clue
    }

    /**
     * This method allow to check if the quest is ended.
     * It will check if the helmet is equiped and if the quest is finished.
     * If the quest is finished, it will show the next clue.
     *
     * @returns {Boolean}
     */
    static isQuestEnded() {
        let helmetIsEquiped =
            LocalStorageService.getUserAttributes("enigme2.helmet");
        let isFinished =
            LocalStorageService.getUserAttributes("enigme2.isFinished");
        if (helmetIsEquiped && isFinished) {
            hiddenQuest(Enigme2.enigme.id); // Unlock the next clue
            return true;
        }
        return false;
    }
}

export default Enigme2;
