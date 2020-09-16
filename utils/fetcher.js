
const axios = require('axios')

const date = new Date()

module.exports = async (event, endPoint, exchangeOption, day) => {


    const todayDate = '' + date.getFullYear() + getMonth()

    try {

        const { data } = await axios.get(`${endPoint}/${exchangeOption}${todayDate}${day}.json`);

        return data

    } catch (error) {

        console.log(error)

        // from 00:00 to 8:00 maib api returns 404 status code for this new day that just came
        // instead of redirecting us to previous day,
        // so it makes sense to try to pull the data from the previous day
        if (error.response.status === 404) {

            await event.reply('#builtin_text', { text: 'No Recent data for this day' })

            try {

                const { data } = await axios.get(`${endPoint}/${exchangeOption}${todayDate}${day - 1}.json`);

                return data

            } catch (error) {

                await event.reply('#builtin_text', { text: 'Something went wrong, Please, try again' })

                return null
            }

        }

        else
            await event.reply('#builtin_text', { text: 'Something went wrong, Please, try again' })

        return null
    }
}


function getMonth() {

    var month = date.getMonth() + 1;

    return month < 10 ? '0' + month : '' + month;

}