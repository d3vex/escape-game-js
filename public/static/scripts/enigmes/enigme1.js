import LocalStorageService from "../services/localStorageService.js";
import Game from "../game.js";
import { showInteraction } from "../utils.js";
import hiddenQuest from "../GUI/hiddenQuest.js";
import { updateEnigmeBoxContent } from "../GUI/enigmeManager.js";
import Enigme2 from "./enigme2.js";

class Enigme1 {
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
            name: "Finding the key",
            description:
                'The room is dark, almost empty. Only a few cobwebs hang from the ceiling, and a fine layer of dust covers the floor. Moving cautiously forward, you come across this old object that catches your eye.\nOn the wall, a phrase is carved into the stone:\n\n"That which opens the way is not found in the light of day. You have to look where you forget to look."',
            hint: "Search in the box.",
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
    static takeKey() {
        let keyIsAvailableToTake =
            LocalStorageService.getUserAttributes("enigme1.Key") == false
                ? true
                : false;
        if (keyIsAvailableToTake) {
            LocalStorageService.setUserAttributes("enigme1.Key", true);
            showInteraction(); // Update the interaction message
            return {
                success: true,
                message: "You took the key.",
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
    static takeKey_interact() {
        if (!LocalStorageService.getUserAttributes("enigme1.Key")) {
            return {
                mainMessage: "Search in the box.",
                subMessage: "Maybe you will find a key.",
            };
        }
        return {
            mainMessage: "Nothing more..",
            subMessage: "The box is empty, you already took the key.",
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
    static async openDoor() {
        let keyIsAvailableToTake =
            LocalStorageService.getUserAttributes("enigme1.Key") == false
                ? true
                : false;
        if (!keyIsAvailableToTake) {
            // If the key is taken
            await Enigme1.#end(); // end the game
            return {
                success: true,
                message: "You opened the door.",
            };
        }

        return {
            success: false,
            message: "You need to find the key first.",
        };
    }

    /**
     * This method return the message to display when
     * the user can interact with the door.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}
     */
    static openDoor_interact() {
        if (!LocalStorageService.getUserAttributes("enigme1.Key")) {
            return {
                mainMessage: "You cannot open the grid without a key.",
                subMessage: "Search in the room.",
            };
        }
        return {
            mainMessage: "Open the grid",
            subMessage: "You have the key, escape now!",
        };
    }

    /**
     * This method is used to end the enigme
     *
     * @async
     */
    static async #end() {
        // Set all attributes that are needed to finish the enigme
        LocalStorageService.setUserAttributes("enigme1.Door", true);
        LocalStorageService.setUserAttributes(
            "enigme1.timestampWhenEnded",
            Date.now()
        );
        LocalStorageService.setUserAttributes("enigme1.isFinished", true);
        // Fetch the next game state
        await Game.getInstance().nextState();

        showInteraction(); // Update the interaction message
        hiddenQuest(Enigme1.enigme.id); // Unlock the next clue
        const nextEnigme = Enigme2.enigme; // Get the next enigme
        updateEnigmeBoxContent(nextEnigme.name, nextEnigme.description); // Update enigma box content
    }

    /**
     * This method return true if the quest is ended.
     * If the quest is ended, it will also show the next clues
     *
     * @returns {Boolean}
     */
    static isQuestEnded() {
        let keyIsAvailableToTake =
            LocalStorageService.getUserAttributes("enigme1.Key") == false
                ? true
                : false;
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme1.Door");
        let isFinished =
            LocalStorageService.getUserAttributes("enigme1.isFinished");
        if (!keyIsAvailableToTake && doorIsOpen && isFinished) {
            hiddenQuest(Enigme1.enigme.id); // Means that the quest is ended, so we unlock the next clue
            return true;
        }
        return false;
    }
}

export default Enigme1;
