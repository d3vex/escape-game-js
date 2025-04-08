class LocalStorage {
  constructor() {}

  /**
   * This method allow to get all user attributes stored in localStorage
   * 
   * @returns {Object|Boolean}
   */
  static #getAllUserAttributes() {
    let userAttributes = this.getItem("userAttributes");
    if (!userAttributes) {
      return false;
    }
    // userAttributes is a string, we need to parse it to get the object
    // If the parsing fails, we return false
    try {
      userAttributes = JSON.parse(userAttributes);
      return userAttributes ?? false;
    } catch (error) {
      console.error("Error parsing user attributes from localStorage:", error);
      return false;
    }
  }
  /**
   * This method allow to get an user attributes stored in localStorage
   * It will return the value of the key if it exists, otherwise it will return false
   *
   * @param {String} key
   */
  static getUserAttributes(key) {
    let userAttributes = this.#getAllUserAttributes();
    if (!userAttributes) {
      return false;
    }
    // Check if the key exists in the userAttributes object
    if (userAttributes[key]) {
      return userAttributes[key];
    }
    return false;
  }

  /**
   * This method allow to set an user attributes stored in localStorage
   * 
   * @param {String} key 
   * @param {any} value 
   */
  static setUserAttributes(key, value) {
    let userAttributesthis = this.#getAllUserAttributes();
    if (!userAttributesthis) {
      userAttributesthis = {};
    }

    userAttributesthis[key] = value;
    this.setItem("userAttributes", userAttributesthis);
  }

  /**
   * This method allow to fetch an item from localStorage
   * It will return the value of the key if it exists, otherwise it will return false
   *
   * @param {String} key
   * @returns {String|false}
   */
  static getItem(key) {
    return localStorage.getItem(key) ?? false;
  }

  /**
   * This method allow to set an item in localStorage
   * 
   * @param {String} key 
   * @param {any} value 
   */
  static setItem(key, value) {
    // Check if the value is an object
    if (typeof value === "object") {
      // If it is, we need to stringify it before storing it
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }
}
