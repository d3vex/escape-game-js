import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import MovementController from "../controllers/move.js";

class Enigme4 {
    static #combination = "";

    constructor() {}
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
            name: "Become the king",
            description:
                "The last thing you need to do is to create your hymn",
            hint: "All stellar will make a song",
            hintPrice: 50,
            level: 1,
        };
    }

    /**
     * This method allow the user to interact with the fake wall.
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     *
     */
    static seeScroll() {
        Game.getInstance().stop();
        document.querySelector(".enigme5_scroll").style.display = "block";
    }
    /**
     * This method return the message to display when
     * the user can interact with the vial.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}}
     */
    static seeScroll_interact() {
        return {
            mainMessage: "This migth be a clue",
            subMessage: "Something is ",
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
    static #closeModal() {
        document.querySelector(".enigme5_scroll").style.display = "none";
        Game.getInstance().start();
    }

    static isQuestEnded() {
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme4.door");
        let isFinished = LocalStorageService.getUserAttributes("egnime4.isFinished");

        return doorIsOpen && isFinished;
    }
}

export default Enigme4;
