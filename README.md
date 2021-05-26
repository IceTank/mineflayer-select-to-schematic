# Mineflayer Select to Schematic

Make Schematics off your world with World Edit like selections.

### Example
Join the local offline server and load the plugin
```js
const mineflayer = require('mineflayer')
const { selector } = require('mineflayer-select-to-schematic')

const bot = mineflayer.createBot({
    username: 'world_edit'
})

bot.on('spawn', () => {
    bot.loadPlugin(selector)
})

bot.on('error', (err) => {
    console.error(err)
})
```

### Installation
This plugin is not on npm. You can install it in your nodejs project like this:
```bash
npm i git+https://github.com/IceTank/mineflayer-select-to-schematic.git
```
or by including it in the the dependencies of your package.json
```json
"dependencies": {
    ...,
    "mineflayer-select-to-schematic": "git+https://github.com/IceTank/mineflayer-select-to-schematic.git",
    ...
}
```

### Usage
First of grab a Wooden Axe and Hoe. To select an Area left click with ether the Wooden Axe or Wooden Hoe while looking at the block you want to select. 
The Wooden Axe selects Position 1. The Wooden Hoe Position 2. 
To save the Selected Area type
 ```save``` 
 into chat. This will save a Schematic off the current selection.
You can give your Schematic a custom name by typing your name after save like so:
```save myCustomName```.