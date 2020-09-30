const fs = require('fs')

const data = require('./csvjson.json')

const filterout = [
  'World',
  'Sub-Saharan Africa',
  'Low SDI',
  'Low-middle SDI',
  'Middle SDI',
  'High-middle SDI',
  'High SDI',
  'Eastern Sub-Saharan Africa',
  'Western Sub-Saharan Africa',
  'Central Sub-Saharan Africa',
  'Southern Sub-Saharan Africa',
  'Central Africa',
  'South Asia',
  'Southeast Asia, East Asia, and Oceania',
  'Southeast Asia',
  'East Asia',
  'Central Asia',
  'Australasia',
  'Australasia & Oceania',
  'Central America & Caribbean',
  'Middle East & North Africa',
  'High-income',
  'Latin America and Caribbean',
  'Western Europe',
  'Central Europe',
  'Eastern Europe',
  'High-income Asia Pacific',
  'South America',
  'North America',
  'North Africa and Middle East',
  'Central Europe, Eastern Europe, and Central Asia',
  'Tropical Latin America',
  'Central Latin America',
  'Southern Latin America',
  'Kosovo', // has no data
]

const d = data.filter(el => {
  return el.Year === 2017 ? true : false
}).filter(el => {
  return !filterout.includes(el.Entity)
})

const dd = d.map(country => {
  const newObj = {}
  let total = 0
  Object.entries(country).forEach(([key, value]) => {
    key = key.replace(' (deaths)', '')
    if (key === 'Code' || key === 'Year' || key === 'Execution' || key === 'Intestinal infectious diseases' || key === 'Entity') return newObj
    if (typeof value === 'number' && key !== 'Year') {
      newObj[key] = Math.round(value)
      total += Math.round(value)
    } else if (typeof value === 'string' && value.length === 0) {
      newObj[key] = 0
    } else {
      newObj[key] = value
    }
  })
  newObj['Total'] = total
  newObj['Country'] = country.Entity
  return newObj
})



// change to percentages
const ddd = dd.map(country => {
  const newObj = {}
  Object.entries(country).forEach(([key, value]) => {
    if (typeof value === 'number' && key !== 'Total') {
      newObj[key] = {
        num: value,
        per: ((value / country.Total) * 100).toFixed(2)
      }
    } else {
      newObj[key] = value
    }
  })
  newObj.Country = {
    Country: newObj.Country,
    Total: newObj.Total
  }
  delete newObj.Total
  return newObj
})

fs.writeFile('./src/assets/cods-table.json', JSON.stringify(ddd, null, 2), (e) => {
  console.log('done')
  console.log('err:', e)
})

