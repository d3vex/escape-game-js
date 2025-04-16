import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import MovementController from "../controllers/move.js";
import hiddenQuest from "../GUI/hiddenQuest.js";

class Enigme3 {
    /**
     * This method allow to get the Enigme3 object
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
            id: 3,
            name: "Find the cursed vial...",
            description:
                "You must retrieve the cursed vial and place it near the door.",
            hint: "When you have the vial, your movement will be randomized",
            hintPrice: 50,
            level: 1,
        };
    }

    /**
     * This method allow the user to grap the cursed vial.
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     *
     */
    static drinkVial() {
        let vialAvailableToTake =
            LocalStorageService.getUserAttributes("enigme3.vial") == false
                ? true
                : false;
        if (vialAvailableToTake) {
            LocalStorageService.setUserAttributes("enigme3.vial", true);
            Game.getInstance().nextState()
            MovementController.getInstance().randomizeMovementKeys();
            showInteraction();
            messagePopUp("You are drunk", "You're drunk and lose your sense of direction.");
            togglePopUp();
            return {
                success: true,
                message: "You drink this weird vial.",
            };
        } else {
            return {
                success: false,
                message: "The vial is empty.",
            };
        }
    }
    /**
     * This method return the message to display when
     * the user can interact with the vial.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}}
     */
    static drinkVial_interact() {
        if (LocalStorageService.getUserAttributes("enigme3.vial")) {
            return {
                mainMessage: "There is nothing left...",
                subMessage: "You're drunk... Deal with the consequences.",
            };
        }
        return {
            mainMessage: "Drink the vial",
            subMessage: "This is the only thing you can do anyway.",
        };
    }

    /**
     * This method allow to take off the vial on the plate.
     * It will end the enigme and unlock the next room.
     *
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     */
    static async vomitOnDoor() {
        let vialAvailableToTake =
            LocalStorageService.getUserAttributes("enigme3.vial") == false
                ? true
                : false;
        if (vialAvailableToTake) {
            showInteraction();
            return {
                success: false,
                message: "You need to dring the vial before..",
            };
        } else {
            LocalStorageService.setUserAttributes("enigme3.vial", false);
            LocalStorageService.setUserAttributes("enigme3.door", true);
            LocalStorageService.setUserAttributes("enigme3.isFinished", true);
            LocalStorageService.setUserAttributes(
                "enigme3.timestampWhenEnded",
                Date.now()
            );
            await Game.getInstance().nextState();
            showInteraction();
            MovementController.getInstance().resetMovementKeys();
            messagePopUp("Success", "You unlock the next room! And the effect of the vial is gone.");
            togglePopUp();
            hiddenQuest(Enigme3.enigme.id)
            return {
                success: true,
                message: "You open the door.",
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
    static vomitOnDoor_interact() {
        if (!LocalStorageService.getUserAttributes("enigme3.vial")) {
            return {
                mainMessage: "This door is tough",
                subMessage: "It cannot be broken by hand, but some acid might do the trick.",
            };
        }
        if (LocalStorageService.getUserAttributes("enigme3.isFinished")) {
            return {
                mainMessage: "Nothing more to do",
                subMessage: "You open the door.",
            };
        }
        return {
            mainMessage: "The drunk effect is overwhelming...",
            subMessage: "You feel nauseous and might vomit any moment.",
        };
    }

    static isQuestEnded() {
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme3.door");

        let holdingVial = LocalStorageService.getUserAttributes("enigme3.vial");
        let isFinished =
            LocalStorageService.getUserAttributes("enigme3.isFinished");

        if (arguments.length == 1 && arguments[0] == true) { // If there is a given parameter and the first one is set to true
            // This means this method is called at the game initialization process
            if(holdingVial) { // If the user leave while holding the vial
                MovementController.getInstance().randomizeMovementKeys() // Randomize his movement keys
            }
            if(isFinished || holdingVial) {
                Game.getInstance().nextState()
            }
        }
        if(doorIsOpen && !holdingVial && isFinished) {
            hiddenQuest(Enigme3.enigme.id)
            return true
        }
        return false;
    }
}

export default Enigme3;
