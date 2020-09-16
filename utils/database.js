const knex = require('./knex')
const { table } = require('./knex')

const date = new Date()

const todayDate = date.getDate()

// 1. get data from database
module.exports.getDataFromDB = async (from, exchangeOption) => {

    return await knex.select('*')
        .from(from)
        .where({ exchange_types_name: exchangeOption })
        .andWhere({ day: todayDate })
}

module.exports.insertTemplateToDB = async (to, template, exchangeOption) => {

    await knex(to).insert({
        template: template,
        exchange_types_name: exchangeOption,
        day: todayDate
    })
}

module.exports.insertDataToDB = async (to, data) => {

    const fieldsToInsert = data.map(field =>
        ({ ...field, day: todayDate }));

    await knex(to).insert(fieldsToInsert)
}

module.exports.actionUsageIncrement = async (tableName) => {

   let exists =  await knex(tableName).select('counter')

    if(!exists[0])
    await knex(tableName).insert({
        counter: 0
    })

    await knex(tableName)
        .update({
            'counter': knex.raw('counter + 1')
        })

}

module.exports.getActionUsage = async (tableName) => {

    
     return await knex(tableName).select('counter')
 
 }


