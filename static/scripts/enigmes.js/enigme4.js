import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import MovementController from "../controllers/move.js";

class Enigme4 {
    static #eventDefined = false;

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
            name: "The port is weird...",
            description:
                "This wall might be a fake one. Find the good combination to open it.",
            hint: "You have all the tools you need to open it.",
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
    static interactWithWall() {
        if (!Enigme4.#eventDefined) {
            Enigme4.#setListener();
        }
        Game.getInstance().stop();
        document.querySelector(".enigme4_findOrder").style.display = "block";
    }
    /**
     * This method return the message to display when
     * the user can interact with the vial.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}}
     */
    static interactWithWall_interact() {
        return {
            mainMessage: "Look at the wall",
            subMessage: "There is some weird draw on the wall...",
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
    static #setListener() {
        document
            .querySelectorAll(".enigme4_findOrder img")
            .forEach((img) => {
                console.log(img)
                img.addEventListener("click", Enigme4.clickHandler);
            });
        document.querySelector(".enigme4_findOrder .closeSymbol").addEventListener("click", Enigme4.#closeModal)
        Enigme4.#eventDefined = true;
    }

    static async clickHandler(e) {
        let imgClicked = e.target;
        let imgId = imgClicked.getAttribute("id").split("_")[1];
        if (Enigme4.#combination.includes(imgId)) {
            return;
        }
        if (Enigme4.#combination.length < 4) {
            Enigme4.#combination += imgId;
            imgClicked.style.opacity = "0.5";
        }
        if (Enigme4.#combination.length == 4) {
            if (Enigme4.#combination == "6142") {
                messagePopUp(
                    "Oh... A noise!",
                    "You hear a weird noise and the wall have move out."
                );
                togglePopUp();
                await Game.getInstance().nextState();
                LocalStorageService.setUserAttributes(
                    "enigme4.isFinished",
                    true
                );
                LocalStorageService.setUserAttributes("enigme4.door", true);
                LocalStorageService.setUserAttributes(
                    "enigme4.timestampWhenEnded",
                    Date.now()
                );
                Game.getInstance().start();
                document.querySelector(".enigme4_findOrder").style.display =
                    "none";
            } else {
                // Reset the combination and the opacity of the images selected
                Enigme4.#combination = "";
                document
                    .querySelector(".enigme4_findOrder")
                    .querySelectorAll("img")
                    .forEach((img) => {
                        img.style.opacity = "1";
                    });
                    Enigme4.#closeModal()
                // Display a message to the user to say that is not the good combination
                messagePopUp("This is not the good combination", "Try again.");
                togglePopUp();
            }
        }
    }

    static #closeModal() {
        document.querySelector(".enigme4_findOrder").style.display = "none";
        Game.getInstance().start();
    }

    static isQuestEnded() {
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme4.door");
        let isFinished = LocalStorageService.getUserAttributes("egnime4.isFinished");

        return doorIsOpen && isFinished;
    }
}

export default Enigme4;
