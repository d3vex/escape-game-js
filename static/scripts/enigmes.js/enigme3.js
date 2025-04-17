import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
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
     * This method allow the user to drink the vial.
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
            // Set the vial as drunk and fetch next game state
            LocalStorageService.setUserAttributes("enigme3.vial", true);
            Game.getInstance().nextState();
            // Randomize the movement keys
            MovementController.getInstance().randomizeMovementKeys();

            showInteraction(); // Update the interaction message

            // Display the message pop up to inform the user
            // that he is drunk and lost his sense of direction
            messagePopUp(
                "You are drunk",
                "You're drunk and lose your sense of direction."
            );
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
     * This method allow to vomit and smelt the door.
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
            return {
                success: false,
                message: "You need to dring the vial before..",
            };
        } else {
            await Enigme3.#end(); // End the enigme
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
                subMessage:
                    "It cannot be broken by hand, but some acid might do the trick.",
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

    static async #end() {
        // Set all the attributes to end the enigme
        LocalStorageService.setUserAttributes("enigme3.vial", false);
        LocalStorageService.setUserAttributes("enigme3.door", true);
        LocalStorageService.setUserAttributes("enigme3.isFinished", true);
        LocalStorageService.setUserAttributes(
            "enigme3.timestampWhenEnded",
            Date.now()
        );
        // Fetching next game state
        await Game.getInstance().nextState();
        showInteraction(); // Update the interaction message
        // Reset the movement keys to default
        MovementController.getInstance().resetMovementKeys();

        // Display the message pop up to inform the user
        // that he is no more drunk and he found back his sense of direction
        messagePopUp(
            "Success",
            "You unlock the next room! And the effect of the vial is gone."
        );
        togglePopUp();
        hiddenQuest(Enigme3.enigme.id); // Unlock the next clue
    }

    /**
     * This method allow to check if the quest is ended.
     * If the quest is finished, it will show the next clue.
     * This method will also be used to get back to the old state (drunk/not drunk)
     * after the user rejoin the game.
     * 
     * @returns {Boolean}
     */
    static isQuestEnded() {
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme3.door");

        let holdingVial = LocalStorageService.getUserAttributes("enigme3.vial");
        let isFinished =
            LocalStorageService.getUserAttributes("enigme3.isFinished");

        if (arguments.length == 1 && arguments[0] == true) {
            // If there is a given parameter and  is set to true
            // This means the method is called at the game initialization process
            if (holdingVial) {
                Game.getInstance().nextState(); // Fetch the state corresponding to a drunk vial
                // If the user leave while drunk
                MovementController.getInstance().randomizeMovementKeys(); // Randomize his movement keys
            }
        }
        // If the enigme is ended, we unlock the next clue
        if (doorIsOpen && !holdingVial && isFinished) {
            Game.getInstance().nextState(); // Fetch the state corresponding to a drunk vial
            hiddenQuest(Enigme3.enigme.id); // Unlock the next clue
            return true;
        }
        return false;
    }
}

export default Enigme3;
