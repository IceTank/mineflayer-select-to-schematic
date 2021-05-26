const Vec3 = require('vec3')
const fs = require('fs')
const path = require('path')
const { Schematic } = require('prismarine-schematic')

const SchematicsFolder = 'schematics'

// Pos 1 == wooden_axe
// Pos 2 == wooden_hoe

function inject (bot) {
    bot.formationBot = {}
    bot.formationBot.magicItem1Name = 'wooden_axe'
    bot.formationBot.magicItem2Name = 'wooden_hoe'
    bot.formationBot.pos1 = null
    bot.formationBot.pos2 = null

    bot.formationBot._entityClick = function (entityId) {
        const entity = bot.entities[entityId]
        if (!entity || entity.type !== 'player') return
        if (!entity.heldItem) return
        if (entity.heldItem.name !== bot.formationBot.magicItem1Name && entity.heldItem.name !== bot.formationBot.magicItem2Name) return
        let posNum
        if (entity.heldItem.name === bot.formationBot.magicItem1Name) {
            posNum = 1
        } else {
            posNum = 2
        }
        const { height, position, yaw, pitch } = entity
        const x = -Math.sin(yaw) * Math.cos(pitch)
        const y = Math.sin(pitch)
        const z = -Math.cos(yaw) * Math.cos(pitch)
        const rayBlock = bot.world.raycast(position.offset(0, height, 0), new Vec3(x, y, z), 120)
        if (!rayBlock) {
            return bot.chat('Block out of Sight')
        }
        const pos = rayBlock.position
        if (posNum === 1) {
            bot.formationBot.pos1 = pos.clone()
        } else {
            bot.formationBot.pos2 = pos.clone()
        }
        bot.chat(`Block ${posNum} x:${pos.x} y:${pos.y} z:${pos.z}`)
    }
    bot.formationBot._save = async function(name) {
        if (!bot.formationBot.pos1 || !bot.formationBot.pos2) {
            return bot.chat('Pos1 or Pos2 null')
        }
        let height, width, depth
        const pos1 = bot.formationBot.pos1
        const pos2 = bot.formationBot.pos2

        height = Math.abs(pos2.y - pos1.y)
        width = Math.abs(pos1.x - pos2.x)
        depth = Math.abs(pos1.z - pos2.z)

        bot.chat(`Volume=${ (width + 1) * (height + 1) * (depth + 1) } Width=${ width + 1 } Height=${ height + 1 } Depth=${ depth + 1 }`)
        let s1 = getPos1(pos1, pos2)
        let s2 = getPos2(pos1, pos2)
        console.info('Start', s1, 'End', s2)
        let schematic = await Schematic.copy(bot.world, s1, s2, new Vec3(0, 0, 0), bot.version)

        let stat
        try {
            stat = fs.accessSync(SchematicsFolder)
        } catch (checkError){
            try {
                fs.mkdirSync(SchematicsFolder)
                console.info('Created new Schematics Folder named: ' + SchematicsFolder)
            } catch (mkdirError) {
                if (mkdirError) {
                    console.error('Error checking folder')
                    console.error(mkdirError)
                    return
                }
            }
        }

        fs.writeFile(path.join('.', SchematicsFolder, name) + '.schem', await schematic.write(), (err, data) => {
            if (err) {
                console.error(err)
                bot.chat('Error writing file')
                return
            }
            bot.chat('saved ' + name + '.schem')
        })
    }

    bot._client.on('packet', (data, meta) => {
        packetHandler(data, meta, bot)
    })

    bot.on('chat', (username, message) => {
        if (bot.username === username) return
        if (message === 'info') {
            let pos1 = this.formationBot.pos1
            let pos2 = this.formationBot.pos2
            return bot.chat(`Pos 1 x:${pos1.x} y:${pos1.y} z:${pos1.z}; Pos 2 x:${pos2.x} y:${pos2.y} z:${pos2.z}`)
        } else if (message.startsWith('save')) {
            const cmd = message.split(' ')
            let name = localDateString()
            new Date().toUTCString()
            if (cmd.length === 2) {
                name = cmd[1]
            }
            bot.formationBot._save(name)
        }
    })
}

function getPos1(v1, v2) {
    return new Vec3(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), Math.min(v1.z, v2.z))
}

function getPos2(v1, v2) {
    return new Vec3(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), Math.max(v1.z, v2.z))
}

function localDateString() {
    const now = new Date()
    return 'form_' + now.toLocaleDateString() + '_' + now.toLocaleTimeString().split(':').join('_')
}

function packetHandler (data, meta, bot) {
    if (meta.name !== 'animation') return
    if (data.animation !== 0) return
    bot.formationBot._entityClick(data.entityId)
}

module.exports = {
    selector: inject
}