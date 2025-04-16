import LocalStorageService from "../services/localStorageService.js";
import Game from "../game.js";
import { showInteraction } from "../utils.js";
import hiddenQuest from "../GUI/hiddenQuest.js";
const maxTimer = 15 * 60 * 1000; // 15 minutes in milliseconds

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
                "You are locked in a room and you need to find the key to escape.",
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
            showInteraction();
            return {
                success: true,
                message: "You took the key.",
            };
        } else {
            showInteraction();
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
        if (keyIsAvailableToTake) {
            showInteraction();
            return {
                success: false,
                message: "You need to find the key first.",
            };
        } else {
            LocalStorageService.setUserAttributes("enigme1.Door", true);
            LocalStorageService.setUserAttributes(
                "enigme1.timestampWhenEnded",
                Date.now()
            );
            LocalStorageService.setUserAttributes("enigme1.isFinished", true);
            await Game.getInstance().nextState();

            showInteraction();
            hiddenQuest(Enigme1.enigme.id);
            return {
                success: true,
                message: "You opened the door.",
            };
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
    static isQuestEnded() {
        let keyIsAvailableToTake =
            LocalStorageService.getUserAttributes("enigme1.Key") == false
                ? true
                : false;
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme1.Door");
        let isFinished =
            LocalStorageService.getUserAttributes("enigme1.isFinished");
        if (!keyIsAvailableToTake && doorIsOpen && isFinished) {
            hiddenQuest(Enigme1.enigme.id);
            return true;
        }
        return false
    }
}

export default Enigme1;
