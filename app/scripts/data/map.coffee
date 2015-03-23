global = this

if global.mapLoaded
  return

global.mapLoaded = true

global.dataLoaded = false
global.countryRequested = null
global.comparisonRequested = null
global.countryDetailOpened = false
global.comparisonOpened = false
global.wrapperCreated = false

global.cache = {
	"indicators": { }
}

global.isMobile = global.functions.isMobile()

################################################################################
#                                 PAGE STATE
################################################################################

setPageStateful = ->
	wesCountry.stateful.start({
		init: (parameters, selectors) ->
			# Update social links
			url = wesCountry.stateful.getFullURL()
			updateSocialLinks(url)

			if settings.debug then console.log "init #{url}"

			# Render Charts
			renderCharts()
		urlChanged: (parameters, selectors) ->
			url = wesCountry.stateful.getFullURL()

			if settings.debug then console.log url

			# Update social links
			updateSocialLinks(url)
		elements: [
			{
				name: "indicator",
				selector: "#indicator-selector",
				onChange: (index, value, parameters, selectors, initial) ->
					if settings.debug then console.log "indicator:onChange index:#{index} value:#{value}"

					option = selectors["#indicator-selector"]?.options?[index]

					global.selections.indicator = value
					global.selections.indicatorOption = option

					global.ref.countryIndicatorSelector.value = value

					# Render Charts
					#renderCharts()
			},
			{
				name: "country",
				selector: "#country-selector",
				removeIfEmpty: true,
				onChange: (index, value, parameters, selectors, initial) ->
					if settings.debug then console.log "country:onChange index:#{index} value:#{value}"

					option = selectors["#country-selector"]?.options?[index]

					global.selections.country = value
					global.selections.countryOption = option

					if index > 0
						if global.dataLoaded and initial == true
							loadCountryDetail(value)
						else
							global.countryRequested = value
			},
			{
				name: "compare",
				selector: "#country-compare-selector",
				removeIfEmpty: true,
				onChange: (index, value, parameters, selectors, initial) ->
					if settings.debug then console.log "compare:onChange index:#{index} value:#{value}"

					option = selectors["#country-compare-selector"]?.options?[index]

					global.selections.compare = value
					global.selections.compareOption = option

					if index > 0
						#if global.dataLoaded
						#	loadCountryComparison(value)
						#else
							global.comparisonRequested = value
			}
		]
	})

updateSocialLinks = (url) ->
	url = encodeURIComponent(url)
	links = document.querySelectorAll(".social-link")

	for link in links
		href = link.getAttribute("data-href")
		href = href.replace("{0}", url)
		link.setAttribute("href", href)

################################################################################
##                               WINDOW RESIZE
################################################################################

setPageHeight = ->
  if !global.functions.isMobile()
    charts = document.getElementById("charts")
    height = global.functions.getPageHeight()

    headerHeight = document.getElementById("Header")?.clientHeight

    if headerHeight
      height -= headerHeight

    headerHeight = document.getElementById("TopNav")?.clientHeight

    if headerHeight
      height -= headerHeight

    # Set height
    charts.style.height = height + "px"
    document.getElementById("map")?.style.height = Math.round(height * 1) + "px"
    document.getElementById("bars")?.style.height = Math.round(height * 0.2) + "px"

  if global.dataLoaded
    # Render Charts
    renderData()
    # Statistics
    showStatistics()

################################################################################
##                                   CHARTS
################################################################################

global.openCountry = (code, name) ->
  if code
    selectCountry(code)
    selectBar(code)
    global.functions.selectCountryInSelector(code)

    @hideRequestBox()
    global.sref.search.value = name
    global.previousSearch = name.toUpperCase()

    loadCountryDetail(code)

global.functions.selectCountryInSelector = (area) ->
  global.ref.country_selector.value = area
  global.ref.country_selector.refresh()
  loadCountryDetail(area)

unselectCountry = ->
	countries = global.ref.map.querySelectorAll(".country-selected")

	for country in countries
		className = country.getAttribute("class")
		country.setAttributeNS(null, "class", className.replace("country-selected", ""))

selectCountry = (area) ->
	unselectCountry()

	if !area then return

	country = global.ref.map.querySelector("##{area}")

	if !country then return

	className = country.getAttribute("class")
	country.setAttributeNS(null, "class", className + " country-selected")

unselectBar = (area) ->
	locators = global.ref.bars.querySelectorAll(".bar-locator")

	for locator in locators
		locator.parentNode.removeChild(locator)

selectBar = (area) ->
	unselectBar()

	bar = global.ref.bars.querySelector("[data-area=#{area}]")

	if !bar then return

	x = parseInt(bar.getAttribute("x"))
	y = parseInt(bar.getAttribute("y"))
	width = parseInt(bar.getAttribute("width"))
	halfWidth = Math.round(width / 3)
	style = bar.getAttribute("style")

	circle = document.createElementNS('http://www.w3.org/2000/svg', "circle")
	circle.setAttributeNS(null, 'class', "bar-locator")
	circle.setAttributeNS(null, 'id', "bar-locator")
	circle.setAttributeNS(null, 'style', style)
	circle.setAttributeNS(null, 'r', halfWidth)
	circle.setAttributeNS(null, 'cx', x + width / 2)
	circle.setAttributeNS(null, 'cy', y - width / 1.5)

	bar.parentNode?.appendChild(circle)

onCountryOver = (info, visor, options) ->
	unselectCountry()

	area = info['data-area']
	_name = info['data-area_name']
	val = if info['data-value'] then parseFloat(info['data-value']).toFixed(2) else "-"

	if (visor && area)
		visor.innerHTML = ''
		visor.className = 'visor visor-full'

		# Flag
		visor.appendChild(global.functions.getFlag(area))

		# Name
		name = document.createElement('span')
		name.innerHTML = _name
		name.className = 'name'
		visor.appendChild(name)

		# Value
		value = document.createElement('span')
		value.innerHTML = val
		value.className = 'value'
		visor.appendChild(value)

		area = info["data-area"]
		selectBar(area)
		selectCountry(area)

onBarOver = (info) ->
	text = String.format("Series '{0}': ({1}, {2})", info.serie, info.pos, info.value)
	onCountryOver(info, document.getElementById("country-visor"), null)

	area = info["data-area"]
	selectCountry(area)
	selectBar(area)

renderMap = (areas, developingColours, emergingColours, minDeveloping, minEmerging) ->
  is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  width = window.innerWidth

  border = 1.5

  if is_chrome
    border = if width < 1024 then 4.5 else 3.5

  container = "#map"
  c = document.querySelector(container)

  if ! c then return

  c?.innerHTML = ""

  isVisible = c.offsetWidth > 0 || c.offsetHeight > 0

  if !isVisible then return

  map = wesCountry.maps.createMap({
		container: container,
		countryCodeName: "area",
		"borderWidth": border,
		"landColour": "#e5e5e5",
		"borderColour": "#e5e5e5",
		countries: areas,
		download: true,
		zoom: false,
		"colourRange": [global.colours.emerging, global.colours.developing],
		visor: {
			value: global.labels.map
		},
		onCountryOver: onCountryOver,
		getElementColour: (options, country, value, rangeColours) ->
			value = Math.round(value)

			if country.area_type and country.area_type.toUpperCase() == "DEVELOPING"
				return developingColours[Math.abs(value - minDeveloping)]

			return emergingColours[Math.abs(value - minEmerging)]
		onCountryClick: (info) ->
			global.functions.selectCountryInSelector(info.iso3)
	})

renderBars = (areas, developingColours, emergingColours, minDeveloping, minEmerging) ->
  max = global.data?.statistics?.max

  for area in areas
    area.values = [ area.value ]

  container = "#bars"
  c = document.querySelector(container)

  if ! c then return

  c?.innerHTML = ""

  isVisible = c.offsetWidth > 0 || c.offsetHeight > 0

  if !isVisible then return

  maxValue = global.functions.getIndicatorTop(global.selections.indicator)

  global.charts.ranking = wesCountry.charts.chart({
    chartType: "bar",
    container: container,
    series: areas,
    legend: {
      show: false
    },
    xAxis: {
      title: "",
      margin: 30,
      values: [""]
    },
    yAxis: {
      title: "",
      tickColour: "#eee",
      margin: 3,
      tickNumber: 3,
      maxValue: maxValue
    },
    margins: [15, 0, 0, if max and max > 999 then 5 else 1],
    valueOnItem: {
      rotation: -20,
      "font-colour": "#aaa",
      "font-size": "10px",
      margin: 6
    },
    groupMargin: 0.5,
    barMargin: 5,
    backColor: "none",
    getElementColour: (options, element, index) ->
      value = Math.round(element.value)

      if (element.area_type and element.area_type.toUpperCase() == "DEVELOPING")
        return developingColours[Math.abs(value - minDeveloping)]

      return emergingColours[Math.abs(value - minEmerging)]
    getName: (element) ->
      return if element.short_name then element.short_name else element.name
    events: {
      "onmouseover": onBarOver,
      "onclick": (info) ->
        global.functions.selectCountryInSelector(info["data-area"])
    }
  })

  # Sort by rank
  global.ref.switch1_by_rank.onchange = (event) ->
    if !this.checked then return

    global.charts.ranking.sort((a, b) ->
      return b.value - a.value
    )

  # Sort by name
  global.ref.switch1_by_name.onchange = (event) ->
    if !this.checked then return

    global.charts.ranking.sort((a, b) ->
      a = a["short_name"].toLowerCase()
      b = b["short_name"].toLowerCase()

      if a < b
        return -1

      if a > b
        return  1

      return 0
    )

showLoading = ->
	bodyWrap()
	# Append 'loading' to body
	document.body.appendChild(global.ref.loading)
	global.ref.loading.style.display = "block"

hideLoading = ->
	bodyUnWrap()
	global.ref.loading?.style.display = "none"
	global.ref.blank?.style.display = "none"
	global.ref.country_list?.style.display = "block"
	global.ref.loading?.className = global.ref.loading.className.replace("initial", "")

renderCharts = () ->
	# Update indicator source
	option = global.selections.indicatorOption

	if option
		provider_name = option.getAttribute("data-provider_name")
		provider_url = option.getAttribute("data-provider_url")

		global.ref.source?.innerHTML = "<a href='#{provider_url}' target='_blank'>#{provider_name}</a>"

		# Update indicator scale
		scaleLabels = document.querySelectorAll(".indicator-scale")
		scale = option.getAttribute("data-scale")

		if scale
			for label in scaleLabels
				label.innerHTML = scale


	cached = global.cache.indicators[global.selections.indicator]

	if cached
		getObservationsCallback(cached)
		return

	showLoading()

	indicator = global.selections.indicator
	year = global.selections.year

	host = @settings.server.url

	url = "#{host}/visualisations/#{indicator}/ALL/#{year}?callback=getObservationsCallback"

	@processJSONP(url)

createOption = (code, data) ->
	option = document.createElement("option")
	option.value = code

	for attribute of data
		option.setAttribute("data-#{attribute}", data[attribute])

	option

setIndicatorOptions = (select, element, level, subindex) ->
	republish = if element.republish then element.republish else false
	type = if element.type then element.type else "Primary"
	description = if element.description then element.description else ""
	provider_name = if element.provider_name then element.provider_name else ""
	provider_url = if element.provider_url then element.provider_url else ""
	weight = if element.weight then element.weight else ""
	if !subindex then subindex = element.indicator
	indicator = if element.indicator then element.indicator.replace(/_/g, " ")  else ""
	code = if element.indicator then element.indicator  else ""
	name = if element.name then element.name  else ""
	is_percentage = if element.is_percentage then element.is_percentage  else false
	scale = if element.scale then element.scale else ""

	if level == 1 then subindex = code.toLowerCase()
	if !subindex then subindex = ""

	data =
		"republish": republish
		"type": type
		"name": name
		"subindex": subindex
		"description": description
		"provider_name": provider_name
		"provider_url": provider_url,
		"is_percentage": is_percentage,
		"scale": scale

	option = createOption(code, data)
	countryOption = createOption(code, data)

	space = Array(level * 3).join '&nbsp'
	option.innerHTML = countryOption.innerHTML = space + name

	select.appendChild(option)
	global.ref.countryIndicatorSelector.appendChild(countryOption)

	# Indicator table
	tr = document.createElement "tr"
	tr.className = "#{type} #{subindex}"
	tr.setAttribute("data-indicator", code)
	global.ref.indicator_table?.appendChild tr

	tr.onclick = (event) ->
		value = this.getAttribute("data-indicator")
		global.ref.indicatorSelector.value = value
		global.ref.indicatorSelector.refresh()
		hideIndicatorDetail()
		renderCharts()

	if level >= 2
		td = document.createElement "td"
		td.className = "code"
		td.innerHTML = code
		tr.appendChild td

	td = document.createElement "td"
	td.className = "description"
	td.innerHTML = name
	tr.appendChild td

	if level < 2
		td.setAttribute("colspan", 2)

	# Loop children
	count = 0
	max = element.children.length - 1

	for child in element.children
		setIndicatorOptions(select, child, level + 1, subindex)
		count++

################################################################################
##                                 AJAX CALLS
################################################################################

renderData = () ->
  areas = global.data.areas

  global.minMaxDeveloping = global.functions.getMinMaxValue(areas, "DEVELOPING")
  global.colours.developingColours = wesCountry.colourRange([global.colours.developing_light, global.colours.developing], global.minMaxDeveloping.length)

  global.minMaxEmerging = global.functions.getMinMaxValue(areas, "EMERGING")
  global.colours.emergingColours = wesCountry.colourRange([global.colours.emerging_light, global.colours.emerging], global.minMaxEmerging.length)

  # Sort areas
  areas.sort((a, b) ->
    return b.value - a.value
  )

  # Map
  renderMap(areas, global.colours.developingColours, global.colours.emergingColours, global.minMaxDeveloping.min, global.minMaxEmerging.min)

  # Bars
  renderBars(areas, global.colours.developingColours, global.colours.emergingColours, global.minMaxDeveloping.min, global.minMaxEmerging.min)

  # Table
  setTimeout(->
    global.listFunctions.renderTable(areas, global.colours.developingColours, global.colours.emergingColours, global.minMaxDeveloping.min, global.minMaxEmerging.min)
  , 100)

  # Load country detail
  if global.countryRequested or global.countryDetailOpened
    country = if global.countryRequested then global.countryRequested else global.selections.country
    global.countryRequested = null

    loadCountryDetail(country)

    if global.comparisonRequested or global.comparisonOpened
      loadCountryComparison(global.selections.compare)
      global.comparisonRequested = null

@getObservationsCallback = (data) ->
	hideLoading()

	global.cache.indicators[global.selections.indicator] = data

	# WI_B and WI_C must be multiplied by 100
	if global.selections.indicator == "WI_B" or global.selections.indicator == "WI_C"
		if !data.processed
			data.processed = true
			areas = data.data.observations

			for area in areas
				area.value = area.value * 100

			statistics = data.data.statistics_all_areas

			for statistic of statistics
				statistics[statistic] = statistics[statistic] * 100


	#bodyUnWrap()
	areas = []

	if data.success
		areas = data.data.observations
		statistics = data.data.statistics_all_areas

	global.data.areas = areas
	global.data.statistics = statistics
	global.dataLoaded = true

	# Area Dict
	global.data.areaDict = {}

	for area in areas
		areaCode = area.area
		global.data.areaDict[areaCode] = area

	renderData()

	showStatistics()

showStatistics = ->
	statistics = global.data.statistics

	averageEmerging = parseFloat(statistics.average_emerging).toFixed(2)
	averageDeveloping = parseFloat(statistics.average_developing).toFixed(2)

	# Global Pie Charts
	global.functions.renderPieChart("#pies-emerging", averageEmerging, global.colours.emerging, true, global.selections.indicator)
	global.functions.renderPieChart("#pies-developing", averageDeveloping, global.colours.developing, true, global.selections.indicator)

################################################################################
##                             LOAD INITIAL DATA
################################################################################

loadAreas = (data) ->
	if !data.success then return

	# Prepare Search Entries
	global.prepareSearchEntries(data.data)

	# Load country selectors
	for area in data.data
		if !area.area then continue

		iso3 = area.iso3
		short_name = area.short_name

		option = document.createElement "option"
		option.value = iso3
		option.innerHTML = short_name
		global.ref.country_selector.appendChild option

		option = document.createElement "option"
		option.value = iso3
		option.innerHTML = short_name
		global.ref.country_compare_selector.appendChild option

loadAreasInfo = (data) ->
	if !data.success then return

	global.data.areaInfo = data.data

loadIndexIndicator = (data) ->
	if !data.success then return

	setIndicatorOptions(global.ref.indicatorSelector, data.data, 0, null)

loadOneIndicator = (data, indicator) ->
	global.cache.indicators[indicator] = data

	observations = data?.data?.observations
	length = observations.length

	for observation in observations
		area = observation.area
		value = observation.value.toFixed(2)
		ranked = observation.ranking

		element = global.indexValues[area]

		if !element
			element = global.indexValues[area] = {}

		element[indicator] = {
			value: value,
			ranked: ranked
		}

loadIndicators = (index, access, infrastructure) ->
	if index.success
		loadOneIndicator(index, "INDEX")

	if access.success
		loadOneIndicator(access, "ACCESS")

	if infrastructure.success
		loadOneIndicator(infrastructure, "INFRASTRUCTURE")

################################################################################
##                              INDICATOR DETAIL
################################################################################

showIndicatorDetail = ->
	bodyWrap()
	global.ref.indicator_detail?.style.display = "block"

hideIndicatorDetail = ->
  bodyUnWrap()
  global.ref.indicator_detail?.style.display = "none"

################################################################################
##                               COUNTRY DETAIL
################################################################################

bodyWrap = ->
	if global.wrapperCreated
		global.ref.body_wrapper.className = "body-wrapper body-modal"
		return

	# Wrap body contents in div
	global.ref.body_wrapper = document.createElement("div")
	global.ref.body_wrapper.id = "body-wrapper"
	global.ref.body_wrapper.className = "body-wrapper body-modal"

	while (document.body.firstChild)
		global.ref.body_wrapper.appendChild(document.body.firstChild)

	document.body.appendChild(global.ref.body_wrapper);

	# Append 'country detail' to body
	document.body.appendChild(global.ref.country_detail)

	# Append 'indicator detail' to body
	document.body.appendChild(global.ref.indicator_detail)

	global.wrapperCreated = true

bodyUnWrap = ->
	global.ref.country_detail?.style.display = "none"
	global.ref.body_wrapper?.className = "body-wrapper"

getCountryColor = (area_type, value) ->
	if (area_type.toUpperCase() == "DEVELOPING")
		barColour = global.colours.developingColours[Math.abs(value - global.minMaxDeveloping.min)]
		fullColour = global.colours.developing
	else
		barColour = global.colours.emergingColours[Math.abs(value - global.minMaxEmerging.min)]
		fullColour = global.colours.emerging

	{
		barColour: barColour,
		fullColour: fullColour
	}

getExtraInfoValue = (code, name, container, decimals, prefix, sufix) ->
  info = global.data.areaInfo?[name]
  countryInfo = info?.values[code]

  if countryInfo
    value = global.functions.formatMoney(countryInfo?.value, decimals, '.', ',')
    year = countryInfo?.year
    provider_name = info?.provider?.provider_name
    provider_url = info?.provider?.provider_url
    value = "<abbr title='Source: #{provider_name} - #{provider_url} (#{year})'>#{prefix}#{value}#{sufix}</abbr>"
  else
    value = "-"

  container?.innerHTML = value

getCountryExtraInfo = (code, population, gni, broadband, poverty) ->
	getExtraInfoValue(code, "SP_POP_TOTL", population, 0, "", "")
	getExtraInfoValue(code, "NY_GNP_PCAP_PP_CD", gni, 2, "USD ", "")
	getExtraInfoValue(code, "mobile_broadband_percentage_GNI", broadband, 2, "", "%")
	getExtraInfoValue(code, "SI_POV_2DAY", poverty, 2, "", "%")

loadCountryDetail = (code) ->
  bodyWrap()

  global.ref.country_detail.style.display = "block"
  global.countryDetailOpened = true

  data = global.data.areaDict[code]

  name = data.short_name
  value = parseFloat(data.value)
  area_type = if data.area_type then data.area_type?.toUpperCase() else "EMERGING"
  colour = if area_type == "EMERGING" then global.colours.emerging else global.colours.developing
  ranking = data.ranking
  ranking_type = data.ranking_type
  continent = data.continent.toUpperCase()
  continentName = global.continents[continent]
  colour = getCountryColor(area_type, Math.round(value))

  # Extra info
  getCountryExtraInfo(code, global.ref.population_label_this, global.ref.gni_label_this, global.ref.broadband_label_this, global.ref.poverty_label_this)

  # Flag
  global.ref.country_flag?.src = global.functions.getFlag(code)?.src
  global.ref.country_name.innerHTML = name
  global.ref.country_continent.innerHTML = continentName

  # Pie
  global.ref.country_indicator_pie.innerHTML = ""
  global.functions.renderValuePieChart(global.ref.country_indicator_pie, value, colour.barColour, global.selections.indicator)

  # Bars
  global.ref.country_indicator_bar.innerHTML = ""

  data.values = [value]

  # Set legend
  global.ref.legend_this_country_circle.style.backgroundColor = colour.barColour
  global.ref.legend_this_country_name.innerHTML = name
  global.ref.legend_mean_name.innerHTML = "Mean #{area_type.toLowerCase()}"

  # Set ranking
  global.ref.ranking_this_country_label.innerHTML =
    global.ref.ranking_this_country_label.innerHTML.replace("{0}", global.data.areas.length)

  if area_type == "DEVELOPING"
    groupNumber = global.minMaxDeveloping.count + " developing"
    meanValue = global.data.statistics.average_developing
  else
    groupNumber = global.minMaxEmerging.count + " emerging"
    meanValue = global.data.statistics.average_emerging

  global.ref.ranking_mean_label.innerHTML =
    global.ref.ranking_mean_label.innerHTML.replace("{0}", groupNumber)

  global.ref.ranking_this_country_value.innerHTML = ranking
  global.ref.ranking_this_country_value.style.color = colour.fullColour
  global.ref.ranking_this_country_value.style.borderColor = colour.fullColour
  global.ref.ranking_mean_value.innerHTML = ranking_type

  wesCountry.charts.chart({
    chartType: "bar",
    container: "#country-indicator-bar",
    series: [data, {
      name: "Mean " + area_type.charAt(0).toUpperCase() + area_type.slice(1),
      value: meanValue
      values: [meanValue],
      area_type: "mean"
      }],
    legend: {
      show: false
    },
    xAxis: {
      title: "",
      margin: 0,
      values: [""]
    },
    yAxis: {
      title: "",
      tickColour: "transparent",
      margin: 3,
      tickNumber: 0,
      "font-colour": "transparent"
    },
    margins: [15, 0, 0, 0],
    valueOnItem: {
      show: false
    },
    nameUnderItem: {
      show: true,
      margin: 8
    }
    groupMargin: 20,
    barMargin: 0,
    maxBarWidth: 15,
    backColor: "none",
    getElementColour: (options, element, index) ->
      if element.area_type == "mean"
        return global.colours.mean

      value = Math.round(element.value)

      if (element.area_type and element.area_type.toUpperCase() == "DEVELOPING")
        return global.colours.developingColours[Math.abs(value - global.minMaxDeveloping.min)]

      return global.colours.emergingColours[Math.abs(value - global.minMaxEmerging.min)]

    getName: (element) ->
      return if element.short_name then element.short_name else element.name
  })

  # General status

  global.ref.country_this_index.innerHTML = ""
  global.ref.country_this_infrastructure.innerHTML = ""
  global.ref.country_this_access.innerHTML = ""

  global.functions.renderTheIndexPieChart(global.ref.country_this_index, code, colour.barColour)
  global.functions.renderInfrastructurePieChart(global.ref.country_this_infrastructure, code, colour.barColour)
  global.functions.renderAccessPieChart(global.ref.country_this_access, code, colour.barColour)

  # Compare to
  label = global.ref.compare_to?.getAttribute("data-label")
  global.ref.compare_to.innerHTML = label?.replace("{0}", name)

loadCountryComparison = (code) ->
	if !global.comparisonOpened
		global.ref.compare_section.style.display = "block"

		# Scroll to comparions section
		setTimeout(->
			top = $('#compare-section-bottom').position().top
			$(window).scrollTop(top)
		, 200)

		global.comparisonOpened = true

	# Show comparison data
	thisCountryData = global.data.areaDict[global.selections.country]

	data = global.data.areaDict[code]

	name = data.short_name
	value = parseFloat(data.value)
	area_type = if data.area_type then data.area_type?.toUpperCase() else "EMERGING"
	colour = if area_type == "EMERGING" then global.colours.emerging else global.colours.developing
	ranking = data.ranking
	ranking_type = data.ranking_type
	continent = data.continent.toUpperCase()
	continentName = global.continents[continent]
	colour = getCountryColor(area_type, Math.round(value))
	thisCountryColour = getCountryColor(thisCountryData.area_type, thisCountryData.value)

	# Extra info
	getCountryExtraInfo(code, global.ref.population_label_other, global.ref.gni_label_other, global.ref.broadband_label_other, global.ref.poverty_label_other)

	# Set ranking
	global.ref.ranking_other_country_label.innerHTML = thisCountryData.short_name
	global.ref.ranking_other_country_value.innerHTML = thisCountryData.ranking
	global.ref.ranking_other_country_value.style.color = thisCountryColour.fullColour
	global.ref.ranking_other_country_value.style.borderColor = thisCountryColour.fullColour

	global.ref.ranking_other_mean_value.style.color = colour.fullColour
	global.ref.ranking_other_mean_value.style.borderColor = colour.fullColour
	global.ref.ranking_other_mean_label.innerHTML = name
	global.ref.ranking_other_mean_value.innerHTML = ranking

	# General status

	global.ref.country_other_index.innerHTML = ""
	global.ref.country_other_infrastructure.innerHTML = ""
	global.ref.country_other_access.innerHTML = ""

	global.functions.renderTheIndexPieChart(global.ref.country_other_index, code, colour.barColour)
	global.functions.renderInfrastructurePieChart(global.ref.country_other_infrastructure, code, colour.barColour)
	global.functions.renderAccessPieChart(global.ref.country_other_access, code, colour.barColour)

	# Bar chart

	top = global.functions.getIndicatorTop(global.selections.indicator)
	max = parseFloat(global.data.statistics.max).toFixed(2)

	if !top
		top = max
	else
		top = Math.max(top, max)

	container = "#comparison-bar-chart"
	document.querySelector(container)?.innerHTML = ""

	wesCountry.charts.chart({
		chartType: "bar",
		container: container,
		series: [
			{
				name: name
				value: value
				values: [value],
				area_type: area_type
			},
			{
				name: thisCountryData.short_name
				value: Math.round(thisCountryData.value)
				values: [thisCountryData.value],
				area_type: thisCountryData.area_type
			}],
		legend: {
			show: false
		},
		xAxis: {
			title: "",
			margin: 0,
			values: [""]
		},
		yAxis: {
			title: "",
			tickColour: "#ccc",
			margin: 10,
			tickNumber: 2,
			"font-colour": "#ccc",
			"font-size": "8px"
			maxValue: top
    },
		margins: [5, 0, 10, 0],
		valueOnItem: {
			show: true,
			margin: 6
		},
		nameUnderItem: {
			show: true
		}
		groupMargin: 20,
		barMargin: 5,
		maxBarWidth: 15,
		backColor: "none",
		mean: {
			show: true,
			value: global.data.statistics.average_developing.toFixed(2),
			text: "Mean developing",
			colour: "#aaa",
			"font-family": "Helvetica",
			"font-colour": "#aaa",
			"font-size": "10px",
			position: "BOTTOM",
			side: "RIGHT"
		},
		median: {
			show: true,
			value: global.data.statistics.average_emerging.toFixed(2),
			text: "Mean emerging",
			colour: "#aaa",
			"font-family": "Helvetica",
			"font-colour": "#aaa",
			"font-size": "10px",
			position: "BOTTOM",
			side: "LEFT"
		}
		getElementColour: (options, element, index) ->
			value = Math.round(element.value)

			if (element.area_type and element.area_type.toUpperCase() == "DEVELOPING")
				return global.colours.developingColours[Math.abs(value - global.minMaxDeveloping.min)]

			return global.colours.emergingColours[Math.abs(value - global.minMaxEmerging.min)]
  })

################################################################################
##                             EVENT HANDLERS
################################################################################

loadEventHandlers = ->
  global.ref.btn_indicator?.onclick = (event) ->
    renderCharts()

  global.ref.indicator_info_button?.onclick = (event) ->
    showIndicatorDetail()
    false

  global.ref.close_indicator?.onclick = (event) ->
    hideIndicatorDetail()
    false

  global.ref.countryIndicatorSelector?.onchange = ->
    value = global.ref.countryIndicatorSelector.value
    global.ref.indicatorSelector.value = value
    global.ref.indicatorSelector.refresh()

  global.ref.close?.onclick = (event) ->
    bodyUnWrap()
    global.ref.compare_section.style.display = "none"
    global.ref.country_selector.selectedIndex = 0
    global.ref.country_selector.refresh()
    global.ref.country_compare_selector.selectedIndex = 0
    global.ref.country_compare_selector.refresh()
    global.countryDetailOpened = false
    global.comparisonOpened = false
    global.countryRequested = null
    global.comparisonRequested = null

    false

  global.ref.btn_compare?.onclick = (event) ->
    if global.selections.compare != ""
      loadCountryComparison(global.selections.compare)

  global.ref.btn_country_indicator?.onclick = (event) ->
    renderCharts()

  global.ref.btn_country?.onclick = (event) ->
    loadCountryDetail(global.ref.country_selector.value)

  if global.isMobile == false
    window.onresize = ->
      global.listFunctions.clearTable()
      setPageHeight()

################################################################################
##                                   START
################################################################################

@loadInitialData = (data) ->
  setPageHeight()
  @loadReferences()

  showLoading()

  loadEventHandlers()

  loadAreas(data.areas)
  loadAreasInfo(data.areasInfo)
  loadIndexIndicator(data.index)
  loadIndicators(data.obs_index, data.obs_access, data.obs_infrastructure)

  global.ref.pies?.style?.display = "block"

  setPageStateful()
