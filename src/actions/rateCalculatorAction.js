
const getCurrency = require('../../utils/fetcher')
const sort = require('../../utils/sort')
const { getDataFromDB, insertDataToDB, actionUsageIncrement } = require('../../utils/database')
const exchangeCurrencies = require('../../utils/exchangeCurrencies')

/**
 * Description of the action goes here
 * @param  {Number} params.option 
 * @param  {String} state['skill-choice-ret'] 
 */

async function rateCalculatorAction(state, event, params) {

    const endPoint = process.env.ENDPOINT

    const amountEntered = params.option

    if (isNaN(parseInt(amountEntered)))
        return await event.reply('#builtin_text', { text: 'Please, enter valid amount' })

    const selectedCurrency = state['skill-choice-ret']

    const date = new Date()

    const exchangeOption = 'BNM'

    const todayDate = date.getDate()


    // 1. get data from database
    const dataFromDatabase = await getDataFromDB('currencies', exchangeOption)


    // 2. otherwise from api
    let dataFromApi
    if (!dataFromDatabase[0])
        dataFromApi = await getCurrency(event, endPoint, exchangeOption, todayDate)


    let dataForToday = dataFromDatabase ? dataFromDatabase : dataFromApi

    // select only those currencies which are in exchangeCurrencies = ['USD', 'EUR', 'RUB', 'RON', 'UAH']  
    const selectedFromToday = sort(dataForToday.filter((curr) => {
        return exchangeCurrencies.some(e => {
            return curr.currencies_name === e.name
        })
    }))

    let responsTemplate = `According to BNM at ${selectedFromToday[0].exchange_rate_date.slice(0, 10)}\n${amountEntered} ${selectedCurrency} equivalent with:\n`

    let MdlInSelectedCurrency = selectedCurrency === 'MDL' ? amountEntered : null

    selectedFromToday.filter((el) => {
        if (el.currencies_name === selectedCurrency && selectedCurrency !== 'MDL')
            MdlInSelectedCurrency = amountEntered * el.buy
        return el.currencies_name !== selectedCurrency

    }).map((el) => {
        responsTemplate += `${el.currencies_name}: \xa0 ${(MdlInSelectedCurrency / el.buy).toFixed(4)}\n`
    })

    if (selectedCurrency !== 'MDL')
        responsTemplate += `MDL: \xa0 ${(MdlInSelectedCurrency).toFixed(4)}\n`

    await event.reply('#builtin_text', { text: responsTemplate })

    // save new  data to database
    if (!dataFromDatabase[0])
        await insertDataToDB('currencies', dataFromApi)

   await actionUsageIncrement('calculatorActionUsage')

    return
}

module.exports = { rateCalculatorAction }
