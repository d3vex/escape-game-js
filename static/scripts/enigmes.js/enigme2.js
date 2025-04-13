import LocalStorageService from "../services/localStorageService.js";

const maxTimer = 15 * 60 * 1000; // 15 minutes in milliseconds

class Enigme2 {
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
      name: "Manage the knigth",
      description:
        "Only the knigth can open the door. You need to find a way to talk with him.",
      hint: "Take the knigth helmet!",
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
  static takeHelmet() {
    let helmetAvailableToTake =
      LocalStorageService.getUserAttributes("enigme2.helmet") == false
        ? true
        : false;
    if (helmetAvailableToTake) {
      LocalStorageService.setUserAttributes("enigme2.helmet", true);
      return {
        success: true,
        message: "You took the helmet.",
      };
    } else {
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
  static takeHelmet_interact() {
    return {
      mainMessage: "Put on the helmet",
      subMessage: "This helmet look good.",
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
  static manipulateTheKnigth() {
    let helmetAvailableToTake =
      LocalStorageService.getUserAttributes("enigme2.helmet") == false
        ? true
        : false;
    if (helmetAvailableToTake) {
      return {
        success: false,
        message: "You need to put the helmet on before..",
      };
    } else {

      
      
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
  static manipulateTheKnigth_interact() {
    if (!LocalStorageService.getUserAttributes("enigme2.helmet")) {
      return {
        mainMessage: "Impossible...",
        subMessage: "The knigth don't talk with lambda...",
      };
    }
    return {
      mainMessage: "Give order",
      subMessage: "Make the knigth open the door.",
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
    let timestampWhenEnded = LocalStorageService.getUserAttributes(
      "enigme1.timestampWhenEnded"
    );
    if (keyIsAvailableToTake && doorIsOpen && isFinished) {
      let currentTime = Date.now();
      if (currentTime - timestampWhenEnded > maxTimer) return false; // Timer is over
      return true;
    }
    return false;
  }
}

export default Enigme1;
