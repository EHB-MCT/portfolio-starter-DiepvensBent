function checkItemName(name){
    if(
        name == null 
        || name.length <=1 
        || typeof(name) != "string" 
        || name.length > 16){
    return false
    }
    return true
}

module.exports = {
    checkItemName
} 