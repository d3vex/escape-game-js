import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";

/**
 * Represents the Enigme5 class, which contains the logic for the fifth enigma in the game.
 * This class includes methods for interacting with various elements of the enigma,
 * checking combinations, playing audio, and managing the enigma's state.
 *
 */
class Enigme5 {
    static #combination = "";
    static #goodCombination = "3124";
    static #playList = [];

    /**
     * This method allow to get the Enigme5 object
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
     * This method allow the user to look at the parchment.
     * @returns {{
     *      success: Boolean,
     *      message: String}
     * }
     *
     */
    static interactWithParchment() {
        Game.getInstance().stop(); // Stop the game loop while interacting
        document.querySelector(".enigme5_scroll").style.display = "block";
        // Close the modal when clicking on the close button
        document.querySelector(".enigme5_scroll .closeSymbol").onclick =
            Enigme5.#closeModal;
    }
    /**
     * This method return the message to display when
     * the user can interact with the parchment.
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

    // All the following methods are used to interact with the stele
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

    // All the following methods are used to display the message
    // when the user interact with the stele
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
        const audio = new Audio(path); // Fetch the audio file
        // Make a promise that resolve when the audio is loaded and can be played
        // and reject if there is an error
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

    /**
     * This method is used to add a value to the combinaison
     * and check if the combinaison is correct.
     *
     * @param {Number} value
     */
    static async #combinationCheckAndAdd(value) {
        if (Enigme5.#combination.length < 4) {
            // If the combinaison is not full
            Enigme5.#combination += value; // Add the value to the combinaison
        }
        if (Enigme5.#combination.length == 4) {
            // If the combinaison is full
            if (Enigme5.#combination == Enigme5.#goodCombination) {
                // And correct
                await Enigme5.#end(); // End the enigme
            } else {
                // If the combinaison is not correct
                // Display a message to inform the user and reset the combinaison
                messagePopUp("The combination is incorrect");
                togglePopUp();
                Enigme5.#combination = "";
            }
        } else {
            // If the combinaison is not full
            // Play the sound of the stele
            const audio = await Enigme5.fetchSong(
                "./static/assets/song/Fur_elise-" + value + ".mp3"
            );
            Enigme5.#playList.push(audio);
            Enigme5.#playAudio();
        }
    }

    /**
     * This method allow to end the enigme.
     * It will set all the attributes to end the enigme
     * and unlock the next room.
     * It will also play the song of the enigme.
     */
    static async #end() {
        // Set the attributes to end the enigme
        LocalStorageService.getUserAttributes("enigme5.isFinished", true);
        const audio = await Enigme5.fetchSong(
            "./static/assets/song/Fur_elise.mp3"
        ); // Fetch the song and add it to the playlist
        Enigme5.#playList.push(audio);
        Enigme5.#playAudio(); // request the playlist to play the song
        // Inform the user that he finished the enigme
        messagePopUp(
            "Now the king",
            "You find your hymn, now go to your throne"
        );
        togglePopUp();
        // Fetching the next game state
        await Game.getInstance().nextState();
        showInteraction();
    }

    /**
     * This method is used to manage playlist
     * and make sure only one song is playing at a time.
     * It will play the next song in the playlist
     * Only if no other one is currently playing.
     * Otherwise the next song will be automatically played
     */
    static #playAudio() {
        // If the playlist is not empty
        if (Enigme5.#playList.length > 0) {
            let audio = Enigme5.#playList[0];
            // Check if the audio is not playing
            if (!(!audio.paused && !audio.ended && audio.currentTime > 0)) {
                audio.play(); // Play the audio
            }
            // Set the audio listener to play automatically the next song
            // when the current one is finished
            audio.onended = () => {
                // Set the audio event to play the next song
                // when it will be finished
                Enigme5.#playList.shift();
                Enigme5.#playAudio();
            };
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

    /**
     * This method allow to check if the enigme is ended.
     */
    static isQuestEnded() {
        let isFinished =
            LocalStorageService.getUserAttributes("egnime5.isFinished");

        return isFinished;
    }
}

export default Enigme5;
