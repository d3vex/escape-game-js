import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import hiddenQuest from "../GUI/hiddenQuest.js";
import Enigme5 from "./enigme5.js";
import { updateEnigmeBoxContent } from "../GUI/enigmeManager.js";

class Enigme4 {
    static #eventDefined = false;

    static #combination = "";

    constructor() {}
    /**
     * This method allow to get the Enigme4 object
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
            id: 4,
            name: "The forgotten sequence",
            description:
                "A massive door blocks your path. On this door are engraved symbols, accompanied by a phrase:\n\"Only the right sequence will open the way.\"\nYou need to observe the clues around you to find the right combination of symbols and unlock the door.",
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
     * the user can interact with the fake wall.
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
     * This method allow to set up the listener on the images and the close button
     *
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     */
    static #setListener() {
        document.querySelectorAll(".enigme4_findOrder img").forEach((img) => {
            img.addEventListener("click", Enigme4.clickHandler);
        });
        document
            .querySelector(".enigme4_findOrder .closeSymbol")
            .addEventListener("click", Enigme4.#closeModal);
        Enigme4.#eventDefined = true;
    }

    /**
     * This method handle the click on the images
     * and check if the combination is correct
     */
    static async clickHandler(e) {
        // Get the image clicked and its id (the number only)
        let imgClicked = e.target;
        let imgId = imgClicked.getAttribute("id").split("_")[1];
        // Check if the image is already clicked
        if (Enigme4.#combination.includes(imgId)) {
            return;
        }
        // Check if the combination is not already full, if not, add the image.
        if (Enigme4.#combination.length < 4) {
            Enigme4.#combination += imgId;
            imgClicked.style.opacity = "0.5";
        }
        // Check if the combination is full and check if the combination is correct
        if (Enigme4.#combination.length == 4) {
            if (Enigme4.#combination == "5142") {
                await Enigme4.#end(); // End the enigme
            } else {
                // Reset the combination and the opacity of the images selected
                Enigme4.#reset();
                // Display a message to the user to say that is not the good combination
                messagePopUp("This is not the good combination", "Try again.");
                togglePopUp();
            }
        }
    }

    /**
     * This method allow to reset the combination
     * and the opacity of the images selected
     * It will also close the modal
     * */
    static #reset() {
        Enigme4.#combination = "";
        document
            .querySelector(".enigme4_findOrder")
            .querySelectorAll("img")
            .forEach((img) => {
                img.style.opacity = "1";
            });
        // Close the modal
        Enigme4.#closeModal();
    }

    /**
     * This method allow to end the enigme
     * and unlock the next room.
     * It will set all attributes that are needed to finish the enigme
     */
    static async #end() {
        // Inform the user that the combination is correct
        // and the wall is opening
        messagePopUp(
            "Oh... A noise!",
            "You hear a weird noise and the wall have move out."
        );
        togglePopUp();
        // Fetch the next game step and setup up all attributes
        // that are needed to finish the enigme
        await Game.getInstance().nextState();
        LocalStorageService.setUserAttributes("enigme4.isFinished", true);
        LocalStorageService.setUserAttributes("enigme4.door", true);
        LocalStorageService.setUserAttributes(
            "enigme4.timestampWhenEnded",
            Date.now()
        );
        Enigme4.#closeModal(); // Restart the game and close the modal
        hiddenQuest(this.enigme.id); // Unlock the next clue
        const nextEnigme = Enigme5.enigme; // Get the next enigme
        updateEnigmeBoxContent(nextEnigme.name, nextEnigme.description); // Update the enigme box content
    }

    /**
     * This method allow to close the modal
     * and restart the game
     */
    static #closeModal() {
        document.querySelector(".enigme4_findOrder").style.display = "none";
        Game.getInstance().start();
    }

    /**
     * This method allow to check if the enigme is finished
     *
     * @returns {Boolean}
     */
    static isQuestEnded() {
        let doorIsOpen = LocalStorageService.getUserAttributes("enigme4.door");
        let isFinished =
            LocalStorageService.getUserAttributes("enigme4.isFinished");
        if (doorIsOpen && isFinished) {
            hiddenQuest(Enigme4.enigme.id); // Unlock the next clue
            return true;
        }
        return false;
    }
}

export default Enigme4;
