const fs = require('fs')

const data = require('./csvjson.json')


const d = data.filter(el => {
  return el.Year === 2017 ? true : false
})

const dd = d.map(el => {
  const o = {}
  let total = 0
  Object.entries(el).forEach(a => {
    const [key, value] = a
    if (typeof value === 'number' && key !== 'Year') {
      o[key] = Math.round(value)
      total += Math.round(value)
    } else if (typeof value === 'string' && value.length === 0) {
      o[key] = 0
    } else {
      o[key] = value
    }
  })
  o['Total'] = total
  return o

})

fs.writeFile('./src/assets/cods.json', JSON.stringify(dd, null, 2), () => { console.log('done') })
