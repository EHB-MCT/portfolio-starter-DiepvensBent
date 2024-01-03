function checkItemName(name){
    if(
        name == null 
        || name.length <=1 
        || typeof(name) != "string"
        || name.trim() !== name // Check for leading or trailing whitespace
        || name.length > 16
        || /[!@#$€%^&*(),.?":{}|<>123456789]/.test(name) // Check if name contains symbol
        ){
    return false
    }
    return true
}

module.exports = {
    checkItemName
} 