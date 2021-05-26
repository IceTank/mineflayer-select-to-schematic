const standaloneViewer = require('prismarine-viewer').standalone
const { Vec3 } = require('vec3')
const { Schematic } = require('prismarine-schematic')
const fs = require('fs').promises
const path = require('path')

const version = '1.16.5'

const World = require('prismarine-world')(version)
const Chunk = require('prismarine-chunk')(version)

// Create a flat world with only 1 layer of stone at y=0
function worldGenerator (x, y, z) {
  if (y === 0) return 1
  return 0
}

const world = new World((chunkX, chunkZ) => {
  const chunk = new Chunk()
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        chunk.setBlockStateId(new Vec3(x, y, z), worldGenerator(chunkX * 16 + x, y, chunkZ * 16 + z))
      }
    }
  }
  return chunk
})

const viewer = standaloneViewer({ version, world, center: new Vec3(0, 20, 0), port: 3000 })

// Generate a level 4 menger sponge fractal
;
(async () => {
    const schematic = await Schematic.read(await fs.readFile(path.join(__dirname, '../schematics/test.schem')))
    await schematic.paste(world, new Vec3(0, 10, 0))
    viewer.update()
})()