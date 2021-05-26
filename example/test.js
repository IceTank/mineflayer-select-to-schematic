const mineflayer = require('mineflayer')
const { selector } = require('../index')

const bot = mineflayer.createBot({
    username: 'world_edit'
})

bot.on('spawn', () => {
    bot.loadPlugin(selector)
})

bot.on('error', (err) => {
    console.error(err)
})