import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import Entity from "../models/entity.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import MovementController from "../controllers/move.js";

/**
 * Represents the Enigme5 class, which contains the logic for the fifth enigma in the game.
 * This class includes methods for interacting with various elements of the enigma,
 * checking combinations, playing audio, and managing the enigma's state.
 *
 * @class Enigme5
 */

/**
 * Retrieves the details of the enigma.
 *
 * @static
 * @returns {Object} An object containing the enigma's properties:
 * - id {number}: The ID of the enigma.
 * - name {string}: The name of the enigma.
 * - description {string}: A description of the enigma.
 * - hint {string}: A hint for solving the enigma.
 * - hintPrice {number}: The price of the hint.
 * - level {number}: The difficulty level of the enigma.
 */

/**
 * Handles interaction with the parchment.
 *
 * @static
 * @returns {Object} An object containing:
 * - success {boolean}: Whether the interaction was successful.
 * - message {string}: A message describing the interaction result.
 */

/**
 * Provides the message to display when interacting with the parchment.
 *
 * @static
 * @returns {Object} An object containing:
 * - mainMessage {string}: The main message to display.
 * - subMessage {string}: The sub-message to display.
 */

/**
 * Handles interaction with Stele 1.
 *
 * @static
 */

/**
 * Handles interaction with Stele 2.
 *
 * @static
 */

/**
 * Handles interaction with Stele 3.
 *
 * @static
 */

/**
 * Handles interaction with Stele 4.
 *
 * @static
 */

/**
 * Provides the message to display when interacting with Stele 1.
 *
 * @static
 * @returns {Object} An object containing:
 * - mainMessage {string}: The main message to display.
 * - subMessage {string}: The sub-message to display.
 */

/**
 * Provides the message to display when interacting with Stele 2.
 *
 * @static
 * @returns {Object} An object containing:
 * - mainMessage {string}: The main message to display.
 * - subMessage {string}: The sub-message to display.
 */

/**
 * Provides the message to display when interacting with Stele 3.
 *
 * @static
 * @returns {Object} An object containing:
 * - mainMessage {string}: The main message to display.
 * - subMessage {string}: The sub-message to display.
 */

/**
 * Provides the message to display when interacting with Stele 4.
 *
 * @static
 * @returns {Object} An object containing:
 * - mainMessage {string}: The main message to display.
 * - subMessage {string}: The sub-message to display.
 */

/**
 * Checks the combination and adds a value to it. Plays audio if the combination is incomplete.
 * Ends the enigma if the combination is correct.
 *
 * @static
 * @async
 * @private
 * @param {string} value - The value to add to the combination.
 */

/**
 * Ends the enigma, plays the final audio, and transitions to the next game state.
 *
 * @static
 * @async
 * @private
 */

/**
 * Closes the modal and resumes the game.
 *
 * @static
 * @private
 */

/**
 * Checks if the enigma has been completed.
 *
 * @static
 * @returns {boolean} True if the enigma is finished, false otherwise.
 */
class Enigme5 {
    static #combination = "";
    static #goodCombination = "3124";
    static #playList = [];

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
            id: 5,
            name: "Become the king",
            description: "The last thing you need to do is to create your hymn",
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
    static interactWithParchment() {
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
    static interactWithParchment_interact() {
        return {
            mainMessage: "This migth be a clue",
            subMessage: "Something is writen on the scroll",
        };
    }

    static interactWithStele1() {
        Enigme5.#combinationCheckAndAdd("1");
    }
    static interactWithStele2() {
        Enigme5.#combinationCheckAndAdd("2");
    }
    static interactWithStele3() {
        Enigme5.#combinationCheckAndAdd("3");
    }
    static interactWithStele4() {
        Enigme5.#combinationCheckAndAdd("4");
    }

    static interactWithStele1_interact() {
        return {
            mainMessage: "Press it",
            subMessage: "It's like the stele can sink",
        };
    }
    static interactWithStele2_interact() {
        return {
            mainMessage: "Press it",
            subMessage: "It's like the stele can sink",
        };
    }
    static interactWithStele3_interact() {
        return {
            mainMessage: "Press it",
            subMessage: "It's like the stele can sink",
        };
    }
    static interactWithStele4_interact() {
        return {
            mainMessage: "Press it",
            subMessage: "It's like the stele can sink",
        };
    }

    /**
     * Fetches an audio file and returns an Audio object.
     *
     * @static
     * @async
     * @param {string} path - The path to the audio file.
     * @returns {Promise<HTMLAudioElement>} A promise that resolves to an Audio object.
     */
    static async fetchSong(path) {
        const audio = new Audio(path);
        return new Promise((resolve, reject) => {
            audio.addEventListener("canplaythrough", () => {
                resolve(audio);
            });
            audio.addEventListener("error", (e) => {
                console.error("Error loading audio:", e);
                reject(e);
            });
        });
    }

    static async #combinationCheckAndAdd(value) {
        if (Enigme5.#combination.length < 4) {
            Enigme5.#combination += value;
        }
        if (Enigme5.#combination.length == 4) {
            if (Enigme5.#combination == Enigme5.#goodCombination) {
                Enigme5.#end();
                Enigme5.#closeModal();
            } else {
                messagePopUp("The combination is incorrect");
                Enigme5.#combination = "";
            }
        } else {
            const audio = await Enigme5.fetchSong(
                "./static/assets/song/Fur_elise-" + value + ".mp3"
            );
            Enigme5.#playList.push(audio);
            Enigme5.#playAudio();
        }
    }

    static async #end() {
        LocalStorageService.getUserAttributes("enigme5.isFinished", true);
        const audio = await Enigme5.fetchSong(
            "./static/assets/song/Fur_elise.mp3"
        );
        Enigme5.#playList.push(audio);
        Enigme5.#playAudio();
        messagePopUp(
            "Now the king",
            "You find your hymn, now go to your throne"
        );
        togglePopUp();
        await Game.getInstance().nextState();
        showInteraction();
    }

    static #playAudio() {
        if (Enigme5.#playList.length > 0) {
            let audio = Enigme5.#playList[0];
            if (!audio.paused && !audio.ended && audio.currentTime > 0) {
                audio.onended = () => {
                    Enigme5.#playList.shift();
                    Enigme5.#playAudio();
                };
            } else {
                audio.onended = () => {
                    Enigme5.#playList.shift();
                    Enigme5.#playAudio();
                };
                audio.play();
            }
        }
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
        let isFinished =
            LocalStorageService.getUserAttributes("egnime5.isFinished");

        return isFinished;
    }
}

export default Enigme5;
