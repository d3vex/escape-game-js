import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import MovementController from "../controllers/move.js";

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
            id: 1,
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
    static takeVial() {
        let vialAvailableToTake =
            LocalStorageService.getUserAttributes("enigme3.vial") == false
                ? true
                : false;
        if (vialAvailableToTake) {
            LocalStorageService.setUserAttributes("enigme3.vial", true);
            MovementController.getInstance().randomizeMovementKeys();
            showInteraction();
            return {
                success: true,
                message: "You took the helmet.",
            };
        } else {
            LocalStorageService.setUserAttributes("enigme3.vial", false);
            MovementController.getInstance().resetMovementKeys();
            showInteraction();
            return {
                success: false,
                message: "You drop the vial.",
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
    static takeVial_interact() {
        if (LocalStorageService.getUserAttributes("enigme3.vial")) {
            return {
                mainMessage: "Take off the vial",
                subMessage: "The movement keys will be back to normal.",
            };
        }
        return {
            mainMessage: "Take the cursed vial",
            subMessage: "You will be cursed while holding it.",
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
    static dropOnThePlate() {
        let vialAvailableToTake =
            LocalStorageService.getUserAttributes("enigme3.vial") == false
                ? true
                : false;
        if (vialAvailableToTake) {
            showInteraction();
            return {
                success: false,
                message: "You need to take the vial before..",
            };
        } else {
            LocalStorageService.setUserAttributes("enigme3.vial", false);
            LocalStorageService.setUserAttributes("enigme3.door", true);
            LocalStorageService.setUserAttributes("enigme3.isFinish", true);
            LocalStorageService.setUserAttributes(
                "enigme3.timestampWhenEnded",
                Date.now()
            );
            showInteraction();
            Game.getInstance().nextState();
            MovementController.getInstance().resetMovementKeys();
            messagePopUp("Success", "You unlock the next room!");
            togglePopUp();
            return {
                success: true,
                message: "You drop the vial on the plate.",
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
    static dropOnThePlate_interact() {
        if (!LocalStorageService.getUserAttributes("enigme3.vial")) {
            return {
                mainMessage: "Something is missing",
                subMessage:
                    "This space is weird... It migth be something missing...",
            };
        }
        if (LocalStorageService.getUserAttributes("enigme3.isFinished")) {
            return {
                mainMessage: "Nothing more to do",
                subMessage: "You find what was missing.",
            };
        }
        return {
            mainMessage: "Place the vial",
            subMessage: "The vial make the perfect size for fit in this space",
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
        }

        return doorIsOpen && !holdingVial && isFinished;
    }
}

export default Enigme3;
