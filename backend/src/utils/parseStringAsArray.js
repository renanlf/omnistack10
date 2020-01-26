module.exports = function parseStringAsArray(string){
    if(!string || string.trim() === ''){
        return [];
    }

    return string.split(',').map(tech => tech.trim());
};