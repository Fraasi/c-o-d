import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-dialog'
import 'leaflet-dialog/Leaflet.Dialog.css'
import { percentageOf } from 'futility'
import countries from './assets/countries-geojson'
import population from './assets/worldpopulation'
import deaths from './assets/cods.json'

const totalWorldPopulation = 7573472031
const totalWorldDeaths = 254288406
const worldPercent = percentageOf(totalWorldDeaths, totalWorldPopulation, 1)
document.querySelector('.header-totals').textContent = `
World population: ${totalWorldPopulation.toLocaleString()}, world deaths: ${totalWorldDeaths.toLocaleString()} (${worldPercent}%)
`

const bounds = new L.LatLngBounds(new L.LatLng(500, -700), new L.LatLng(-70, 700))
const map = L.map('map', {
	center: L.latLng(50, 0),
	zoom: 1.7,
	minZoom: 1,
	maxZoom: 5,
	worldCopyJump: true,
	maxBounds: bounds,
	maxBoundsViscosity: 1.5,
})

map.on('click', e => {
  updateDialog()
})

map.createPane('labels')
map.getPane('labels').style.zIndex = 650
map.getPane('labels').style.pointerEvents = 'none'

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'

// baseMap
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
	attribution,
}).addTo(map)

// mapLabels
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	attribution,
	pane: 'labels',
}).addTo(map)

const dialog = window.dialog = L.control.dialog({
	position: 'topright',
	anchor: [0, -310],
	size: [300, 350],
}
).addTo(map)

dialog.freeze()
const dialogEl = document.querySelector('.leaflet-control-dialog-contents')
updateDialog()

const geojson = L.geoJson(countries,
	{
		style: {
			color: 'black',
			fillColor: 0,
			fillOpacity: 0.7,
		},
		onEachFeature: function (feature, layer) {
			layer.on({
				mouseover: (e) => {
					const layer = e.target
					layer.setStyle({
						weight: 2,
						fillOpacity: 0.55,
						dashArray: '',
					})
					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
						layer.bringToFront()
					}
				},
				mouseout: (e) => { geojson.resetStyle(e.target) },
				click: (e) => { updateDialog(e.target.feature.id) },
			})
		},
  }).addTo(map)

geojson.eachLayer((layer) => {
	const country = deaths.find(count => count.Code === layer.feature.id)
	const popul = population.find(pop => pop.country === layer.feature.properties.name)
	const pop = popul ? Number(popul.population).toLocaleString() : 'N/A'
	const total = country ? `${country.Total.toLocaleString()}` : 'N/A'
	const percent = country && popul ? percentageOf(country.Total, Number(popul.population), 1) : 'N/A'
	layer.bindPopup(`${layer.feature.properties.name}, ${layer.feature.id}
	<br>population: ${pop}<br>total # of deaths:${total} (${percent}%)`)
})

function updateDialog(id) {
	if (!id) {
		dialog.setContent('<h4>Click on a country to see statistics here.</h4><h4  style="position:absolute;bottom:0px;">To see all the data in a table, <a href="./table.html">click here</a></h4>')
		if (window.matchMedia("(max-width: 480px)").matches) dialog.close()
	} else {
		const country = deaths.find(country => country.Code === id)
		const popul = country ? population.find(pop => pop.country === country.Entity) : 'N/A'
		const pop = popul ? Number(popul.population).toLocaleString() : 'N/A'
		if (country === undefined) {
			dialog.setContent(`<h4>${id} N/A</h4>`)
		} else {
			dialog.setContent(`<h4>${country.Entity}</h4>
			Population: ${pop}</br>
			${
				Object.keys(country)
					.splice(3)
					.sort((a, b) => country[b] - country[a])
					.map((key, i) => {
						if (i === 0) {
							const percent = country && popul ? percentageOf(country.Total, Number(popul.population), 1) : 'N/A'
							return `${key} # of deaths: ${country[key].toLocaleString()} (${percent}%)</br>`
						}
						return `${key.replace(' (deaths)', '')}: ${country[key].toLocaleString()} (${percentageOf(country[key], country.Total, 2)}%)`
          })
					.join('</br>')
  			}`)
			dialogEl.scrollTo(0, 0)
		}
	}
}
