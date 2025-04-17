/**
 * This method allow to modify the title of the enigme box located at the left of the screen
 * 
 * @param {String} title 
 */
function updateEnigmeBoxTitle(title) {  
    let enigmeBox = document.querySelector(".enigmaBox")
    if(!enigmeBox) return
    enigmeBox.querySelector("h4").innerText = title;
}

/**
 * This method allow to modify the description of the enigme in the enigme box located at the left of the screen
 * 
 * @param {String} description 
 */
function updateEnigmeBoxDescription(description) {  
    let contentBox = document.querySelector(".enigmaBox .contentEnigmaBox")
    if(!contentBox) return
    contentBox.querySelector("span").innerText = description;
}

/**
 * Updates the content of the enigme box located at the left of the screen by modifying its title and description.
 * 
 * @param {String} title - The new title to set for the enigme box.
 * @param {String} description - The new description to set for the enigme box.
 */
function updateEnigmeBoxContent(title, description) {
    updateEnigmeBoxTitle(title),
    updateEnigmeBoxDescription(description)
}


export { updateEnigmeBoxContent, updateEnigmeBoxTitle, updateEnigmeBoxDescription}