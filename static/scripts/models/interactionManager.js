import Enigme1 from "../enigmes.js/enigme1.js";
import Enigme2 from "../enigmes.js/enigme2.js";
import Enigme3 from "../enigmes.js/enigme3.js";
import Enigme4 from "../enigmes.js/enigme4.js";
import Enigme5 from "../enigmes.js/enigme5.js";

class InteractionManager {
  constructor() {
    this.interactionHandlers = {
      PrintConsole: this.printConsole,
      Enigme1: Enigme1,
      Enigme2: Enigme2,
      Enigme3: Enigme3,
      Enigme4: Enigme4,
      Enigme5: Enigme5
    };
  }

  /**
   * This method will trigger the interaction
   *
   * @param {String} interaction
   */
  triggerInteraction(interaction) {
    const handler = this.getInteractionHandler(interaction);

    if (handler) {
      handler();
    } else {
      console.log(`Interaction non gérée: ${interaction}`);
    }
  }

  /**
   * This method allow to get the interaction handler
   * Even if it is a nested interaction
   * 
   * @param {String} interaction
   * @param {Object|null} handler
   * @returns {Function} return the interaction handler
   */
  getInteractionHandler(interaction, handler = null) {
    // Check if the interaction string includes a dot, indicating nested interaction
    if (interaction.includes(".")) {
      // Destructure the first part as handlerName, and the rest as methodName (array of remaining parts)
      let [handlerName, ...methodName] = interaction.split(".");

      // If no handler was passed in, start from the root interactionHandlers map
      if (handler == null) {
        handler = this.interactionHandlers[handlerName];
      } else {
        // Otherwise, navigate deeper into the current handler
        handler = handler[handlerName];
      }

      // Recursively resolve the remaining methodName parts
      return this.getInteractionHandler(methodName, handler);
    }

    // If no handler is provided, using the root interactionHandlers map
    // Otherwise, navigate to the specified interaction
    if (handler == null) {
      handler = this.interactionHandlers[interaction];
    } else {
      handler = handler[interaction];
    }

    // Return the handler
    return handler;
  }

  printConsole() {
    console.log("Test interaction");
  }
}

export default new InteractionManager();
