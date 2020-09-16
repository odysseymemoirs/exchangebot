const { getDataFromDB, insertDataToDB, insertTemplateToDB, actionUsageIncrement } = require('../../utils/database')
const getCurrency = require('../../utils/fetcher')
const exchangeCurrencies = require('../../utils/exchangeCurrencies')

/**
 * Description of the action goes here
 * @param  {String} params.option single string: 'BNM', 'CARD', 'PSV', 'VIR'
 */

async function todayExchangeAction(state, event, params) {


    const endPoint = process.env.ENDPOINT

    const exchangeOption = params.option

    const date = new Date()

    const todayDate = date.getDate()


    // 1. get data from database
    const dataFromDatabase = await getDataFromDB('currencies', exchangeOption)

    const todayExchangeTemplate = await getDataFromDB('todayExchangeTemplate', exchangeOption)

    await actionUsageIncrement('todayExchangeActionUsage')

    // display to chatbot user and stop execution
    if (todayExchangeTemplate[0])
        return await event.reply('#builtin_text', { text: todayExchangeTemplate[0].template })



    // 2. else fetch data from api 
    let dataFromApi = await getCurrency(event, endPoint, exchangeOption, todayDate)


    // extract only day 
    // '2020-09-11 08:28:05.000' => '11'
    const maibLastUpdateDay = dataFromApi[0].exchange_rate_date.slice(8, 10)

    const currentMonth = dataFromApi[0].exchange_rate_date.slice(5, 7)

    const isDataUpToDate = maibLastUpdateDay === (date.getDate + '')

    if (!isDataUpToDate)
        await event.reply('#builtin_text', { text: `Here are data for ${currentMonth}.${maibLastUpdateDay}` })


    const selectedExchangeCurrencies = dataFromApi.filter((curr) => {

        return exchangeCurrencies.some(e => {
            return curr.currencies_name === e.name
        })
    })

    let responsTemplate = `${
        isDataUpToDate
            ? 'Today'
            : currentMonth + '.' + maibLastUpdateDay} exchange rate for ${exchangeOption}:\n
            BUY | SELL \n`
            selectedExchangeCurrencies.map((curr) => {
                responsTemplate += `${curr.currencies_name}\xa0\xa0${curr.buy.toFixed(4)}\xa0\xa0${curr.sell.toFixed(4)}\n`
    })

    await event.reply('#builtin_text', { text: responsTemplate })


    // save new  data to database
    if (!dataFromDatabase[0])
        await insertDataToDB('currencies', dataFromApi)

    // save new template data to database
    if (!todayExchangeTemplate[0])
        await insertTemplateToDB('todayExchangeTemplate', responsTemplate, exchangeOption)


    return
}

module.exports = { todayExchangeAction }
