/**
 * checkItemName
 * 
 * This function validates the format of an item name.
 * It checks various criteria, including non-null, length constraints, type, absence of leading/trailing whitespaces,
 * and the absence of specific symbols in the name.
 * 
 * @param {string} name - the iten name to be validated
 * @returns {boolean} - Returns true if the item name is valid, and false otherwise.
 * 
 * Criteria:
 * - Non-null: The name must not be null.
 * - Length: The length of the name must be greater than 1 and smaller than 24 characters.
 * - Type: The name must be of type string.
 * - Whitespace: The name must not have leading or trailing whitespaces.
 * - Symbols: The name must not contain specific symbols: ! @ # $ € % ^ & * ( ) , . ? " : { } | < > 1 2 3 4 5 6 7 8 9.
 * 
 */

function checkItemName(name){
    if(
        name == null                  // Name can't be null
        || name.length <= 1           // Length needs to be larger than 1
        || typeof(name) != "string"   // Name must be type string
        || name.trim() !== name       // Check for leading or trailing whitespace
        || name.length > 24           // Name must be smaller that 24 characters
        || /[!@#$€%^&*(),.?":{}|<>123456789]/.test(name) // Check if name contains symbol
    ){
        return false
    }
    return true
}

module.exports = {
    checkItemName
} 