
const getCurrency = require('../../utils/fetcher')
const sort = require('../../utils/sort')
const { getDataFromDB, insertDataToDB, insertTemplateToDB, actionUsageIncrement } = require('../../utils/database')
const exchangeCurrencies = require('../../utils/exchangeCurrencies')

/**
 * Description of the action goes here
 * @param  {String} params.option single string: 'BNM', 'CARD', 'PSV', 'VIR'
 */

async function rateVariationAction(state, event, params) {

    const endPoint = process.env.ENDPOINT

    const exchangeOption = params.option

    const date = new Date()

    const todayDate = date.getDate()


    // 1. get data from database
    const dataFromDatabase = await getDataFromDB('currencies', exchangeOption)

    const todayExchangeTemplate = await getDataFromDB('rateVariationTemplate', exchangeOption)

    await actionUsageIncrement('rateVariationActionUsage')

    // display to chatbot user and stop execution
    if (todayExchangeTemplate[0])
        return await event.reply('#builtin_text', { text: todayExchangeTemplate[0].template })


    // 2. else fetch data from api 
    let dataFromApi = await getCurrency(event, endPoint, exchangeOption, todayDate)

    // extract only day 
    // '2020-09-11 08:28:05.000' => '11'
    const maibLastUpdateDay = dataFromApi[0].exchange_rate_date.slice(8, 10)

    const currentMonth = dataFromApi[0].exchange_rate_date.slice(5, 7)

    const comparisonDay = maibLastUpdateDay - 1;

    const comparisonDayData = await getCurrency(event, endPoint, exchangeOption, comparisonDay)


    const isDataUpToDate = maibLastUpdateDay === (date.getDate() + '')

    if (!isDataUpToDate) {
        await event.reply('#builtin_text', {
            text: `Here are data for ${currentMonth}.${maibLastUpdateDay}\nin comparison with ${currentMonth}.${maibLastUpdateDay - 1}`
        })
    }

    let responsTemplate = `${
        isDataUpToDate
            ? 'Today'
            : currentMonth + '.' + maibLastUpdateDay} exchange rate for ${exchangeOption}:\n`

    // select only those currencies which are in exchangeCurrencies = ['USD', 'EUR', 'RUB', 'RON', 'UAH']  
    // select from today's data
    const selectedFromToday = sort(dataFromApi.filter((curr) => {
        return exchangeCurrencies.some(e => {
            return curr.currencies_name === e.name
        })
    }))

    // select from comparison day's data
    const selectedFromComparisonDay = sort(comparisonDayData.filter((curr) => {
        return exchangeCurrencies.some(e => {
            return curr.currencies_name === e.name
        })
    }))


    // compare and get differences
    // for ex. EUR: 19.541025 with EUR: 19.481175 = 0.05985⬇️
    selectedFromToday.map((el, index) => {
        let difference = selectedFromComparisonDay[index].buy - el.buy
        responsTemplate += `${el.currencies_name} \xa0`
            + `${el.buy.toFixed(3)}`
            + `${el.buy.toFixed(3).toString().length === 5 ? '\xa0\xa0' : '\xa0'}` // verticall arrows ⬆️ ⬇️ alignment based on digit count
            + `${Math.sign(difference) < 0 ? '⬆️' : '⬇️'}\xa0\xa0`
            + `${Math.abs(difference.toFixed(4))}\n`
    })

    await event.reply('#builtin_text', { text: responsTemplate })

    // save new  data to database
    if (!dataFromDatabase[0])
        await insertDataToDB('currencies', dataFromApi)

    // save new template data to database
    if (!todayExchangeTemplate[0])
        await insertTemplateToDB('rateVariationTemplate', responsTemplate, exchangeOption)


    return
}

module.exports = { rateVariationAction }
