module.exports = (object) => {
    const sorted = object.sort((a,b) => (a.currencies_name > b.currencies_name) ? 1 : ((b.currencies_name > a.currencies_name) ? -1 : 0)); 
    return sorted
}
