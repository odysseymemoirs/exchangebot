const { getActionUsage } = require('../../utils/database')

/**
 * Description of the action goes here
 * @param  {String} params.option single string: 'calculatorActionUsage', 'todayExchangeActionUsage', 'rateVariationActionUsage'
 */

async function actionUsageAction(state, event, params) {

    const actionName = params.option

    const calculator = await getActionUsage('calculatorActionUsage')
    const todayEx = await getActionUsage('todayExchangeActionUsage')
    const rateVar = await getActionUsage('rateVariationActionUsage')

    await event.reply('#builtin_text', {
        text:
            `Today Exchange usage: ${todayEx[0] ? todayEx[0].counter : 0}\n` +
            `Rate Variation usage: ${rateVar[0] ? rateVar[0].counter : 0}\n` +
            `Calculator usage: ${calculator[0] ? calculator[0].counter : 0}\n`
    })


    return
}

module.exports = { actionUsageAction }
