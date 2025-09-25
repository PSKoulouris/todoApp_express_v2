const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname,'..','data','tasks.json')

function getTasks(){
    const fileData =  fs.readFileSync(filePath)
    const restaurants = JSON.parse(fileData)
    return restaurants
}

function storeTasks(r){
    fs.writeFileSync(filePath, JSON.stringify(r))
}

module.exports = {
    getTasks : getTasks,
    storeTasks : storeTasks
}