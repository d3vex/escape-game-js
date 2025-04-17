import Game from "../game.js";
import LocalStorageService from "../services/localStorageService.js";
import { messagePopUp, togglePopUp } from "../GUI/messagePopUp.js";
import { showInteraction } from "../utils.js";
import { stopTimer } from "../GUI/startTimer.js";
import { launchConfetti } from "../GUI/effects.js";
import { updateEnigmeBoxContent } from "../GUI/enigmeManager.js";

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
            name: "The harmony of steles",
            description:
                'The room you enter is vast, silent... seemingly empty. Massive columns support a ceiling so high it\'s lost in the darkness. In the center, four stone steles are arranged. Each one looks ancient, engraved with forgotten symbols and adorned with a dull crystal.\n\nWhen you touch the first, it emits a crystalline, brief, almost melancholy sound. The others react in the same way: each stele sings a note, a short, fragmented melody.\n\nOn the floor between the steles, a barely visible phrase appears when you touch it with your fingers:\n\n"Harmony begets revelation. Only the perfect sequence will reveal what lies dormant."',
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
     * This method allow the user to end the game
     * when interact with the throne.
     */
    static async endTheGame() {
        if (LocalStorageService.getUserAttributes("enigme5.melody") == true) {
            const audio = await Enigme5.fetchSong(
                "./static/assets/song/Fur_elise.mp3"
            ); // Fetch the song and add it to the playlist
            Enigme5.#playList.push(audio);
            Enigme5.#playAudio(); // request the playlist to play the song
            // Inform the user that he finished the enigme
            messagePopUp("You finished the enigme");
            togglePopUp();
            // End the enigme
            await Enigme5.#end();
        }
    }

    /**
     * This method return the message to display when
     * the user can interact with the throne.
     *
     * @returns {{
     *     mainMessage: String,
     *     subMessage: String}}
     */
    static endTheGame_interact() {
        if (LocalStorageService.getUserAttributes("enigme5.melody") == true) {
            return {
                mainMessage: "You can now go to your throne",
                subMessage: "You are the king",
            };
        }
        return {
            mainMessage: "You can't go to your throne",
            subMessage: "You need to find your hymn",
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
                await Enigme5.#unlockThrone(); // End the enigme
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
     * This method allow to unlock the throne.
     * It will set the melody as found
     * It will also play the song of the enigme.
     */
    static async #unlockThrone() {
        if (Enigme5.#combination != Enigme5.#goodCombination) return;
        LocalStorageService.setUserAttributes("enigme5.melody", true);

        messagePopUp(
            "Now the king",
            "You find your hymn, now go to your throne"
        );
        togglePopUp();
        // Fetching the next game state
        await Game.getInstance().nextState();
        showInteraction();
        updateEnigmeBoxContent(
            "The Coronation",
            'After solving the five riddles, you sit upon the throne. A brilliant light floods the room, and the chains of your past shatter. You are now the sovereign, master of your destiny. But one question remains:\n"Were you destined for this power, or did the power choose you?"'
        );
    }

    /**
     * This method allow to end the enigme.
     * It will set all the attributes to end the enigme
     * and unlock the next room.
     * It will also play the song of the enigme.
     */
    static async #end() {
        // Set the attributes to end the enigme
        LocalStorageService.setUserAttributes("enigme5.isFinished", true);
        stopTimer();
        Game.getInstance().stop();
        launchConfetti();
        document.querySelector(".gameWin")?.style.display = "block";
        document.querySelector(".interactBox")?.style.bottom = "calc(-10vh - 4px)"
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
        let melody = LocalStorageService.getUserAttributes("enigme5.melody");
        let isFinished =
            LocalStorageService.getUserAttributes("egnime5.isFinished");

        if (melody == true) {
            Game.getInstance().nextState();
        }
        if(melody && isFinished) {
            Enigme5.#end();
            return true
        }
        return false
    }
}

export default Enigme5;
