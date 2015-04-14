global = this

################################################################################
##                                   AUX
################################################################################

if !global.ref then global.ref = {}

global.ref.path = document.getElementById("path").value
global.ref.info = document.querySelector(".info")
global.ref.flag = document.querySelector(".info .flag")
global.ref.close = document.querySelector(".info .close")
global.ref.country_name = document.querySelector(".info .country-name")
global.ref.value_x = document.querySelector(".info .value-x")
global.ref.value_y = document.querySelector(".info .value-y")
global.ref.value_population = document.querySelector(".info .value-population")
global.ref.value_poverty = document.querySelector(".info .value-poverty")
global.ref.value_gni = document.querySelector(".info .value-gni")
global.ref.country_selector = document.getElementById("country-selector")
global.ref.go = document.querySelector(".country-search-wrapper .button-wrapper button")
global.ref.loading = document.getElementById("loading")

global.minWidthForLabels = 480
global.screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

if !global.functions then global.functions = {}

global.functions.getFlag = (code, img) ->
  append = false

  if !img
    img = document.createElement "img"
    append = true

  img.className = "flag flag-#{code}"

  if append
    document.body.appendChild img

  style = window.getComputedStyle(img)
  content = style.getPropertyValue('content')

  if content
    if content.indexOf('url("') != -1
      content = content.replace('url("', '')
      content = content.substring(0, content.length - 2)
    else
      content = content.replace('url(', '')
      content = content.substring(0, content.length - 1)

    img.src = content

  img

global.openCountry = (code, name) ->
  container = document.querySelector(global.visualisation.container)

  hideCountryInfo(null, global.visualisation.bubbles)

  if code and container
    bubble = global.visualisation.svg.select("g[data-code='#{code}']")

    showCountryInfo(bubble, global.visualisation.bubbles)

formatMoney = (n, c, d, t) ->
  c = if isNaN(c = Math.abs(c)) then 2 else c
  d = if d == undefined then "." else d
  t = if t == undefined then "," else t
  s = if n < 0 then "-" else ""
  i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + ""
  j = if (j = i.length) > 3 then j % 3 else 0

  s + (if j then i.substr(0, j) + t else "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (if c then d + Math.abs(n - i).toFixed(c).slice(2) else "")

################################################################################
##                                  GET DATA
################################################################################

loadAreas = (data, areasInfo) ->
	if !data.success then return
	if !areasInfo.success then return

	areas = data.data
	areasInfo = areasInfo.data
	global.visualisation.areas = areas

	# Prepare Search Entries
	global.prepareSearchEntries(areas)

	populationName = global.visualisation.data.population.name
	gniName = global.visualisation.data.gni.name
	povertyName = global.visualisation.data.poverty.name

	for area in areas
		iso3 = area.iso3
		short_name = area.short_name
		type = area.type

		# Set selector options
		option = document.createElement "option"
		option.value = iso3
		option.innerHTML = short_name
		global.ref.country_selector.appendChild option

		totalPopulation = population = areasInfo?[populationName]?.values?[iso3]?.value
		poverty = areasInfo?[povertyName]?.values?[iso3]?.value
		gni = areasInfo?[gniName]?[iso3]?.values?.value

		global.visualisation.data.info[iso3] = {
			totalPopulation: totalPopulation,
			poverty: poverty,
			gni: gni
		}

		if population
			population = parseFloat(population)

			if population > global.visualisation.data.population.top
				population = population / global.visualisation.data.population.factor

			global.visualisation.data.population.byCountry[iso3] = population
			global.visualisation.data.population.list.push({
				iso3: iso3,
				short_name: short_name,
				type: type,
				population: population,
				totalPopulation: totalPopulation,
				gni: gni,
				poverty: poverty
				})

			if population > global.visualisation.data.population.max
				global.visualisation.data.population.max = population

			if population < global.visualisation.data.population.min
				global.visualisation.data.population.min = population

	# Sort
	global.visualisation.data.population.list.sort((a, b) ->
		return b.population - a.population
	)

	global.visualisation.loadData(global.visualisation.indicator1.code, global.visualisation.indicator2.code)

@getDataCallback = (data) ->
	if !data.success then return

	data = data.data

	container = document.querySelector(".visualisation-container")

	loadChecks(container)
	setTitles(container)

	renderVisualisation(data, global.visualisation.indicator1.code, global.visualisation.indicator2.code)

	global.ref.loading?.style?.display = "none"

################################################################################
##                                  CHECKS
################################################################################

loadChecks = (container) ->
	checks = document.querySelectorAll(".type-checks input[type=checkbox]")

	svg = container?.querySelector("svg")

	for check in checks
		check.onchange = ->
			show = this.checked
			value = this.value

			bubbles = svg?.querySelectorAll("[data-group-type=#{value}]")

			for bubble in bubbles
				bubble.style.display = if show then "" else "none"

			className = if show then "" else " hidden"

			global.visualisation.svg.select("g.texts g.#{value}").attr(
				"class": "#{value}#{className}"
			)

	check = document.querySelector(".other-checks input[type=checkbox]")

	check?.onchange = ->
		proportion = this.checked

		global.visualisation.svg.selectAll("[data-group-type] circle").forEach((element, i) ->
			element.attr(
				"r": if proportion then element.attr("data-radio") else element.attr("data-radio-default")
				)
			)

		global.visualisation.svg.selectAll("g.texts text").forEach((element, i) ->
			element.attr(
				"y": if proportion then element.attr("data-posY-default") else element.attr("data-posY")
				)
			)


################################################################################
##                                CHARTS
################################################################################

setTitles = (container) ->
  label = container.querySelector(".title-x span.text")
  label?.innerHTML = global.visualisation.indicator1.name
  icon = container.querySelector(".title-x span.glyph-icon")
  icon?.className = "glyph-icon flaticon-#{global.visualisation.indicator1.icon}"

  label = container.querySelector(".title-y span.text")
  label?.innerHTML = global.visualisation.indicator2.name
  icon = container.querySelector(".title-y span.glyph-icon")
  icon?.className = "glyph-icon flaticon-#{global.visualisation.indicator2.icon}"

getXCoordinate = (value, innerWidth, leftMargin) ->
  leftMargin + (value - global.visualisation.xAxis.min) * innerWidth / (global.visualisation.xAxis.max - global.visualisation.xAxis.min)

getYCoordinate = (value, innerHeight, topMargin) ->
	if global.visualisation.yAxis.lowToHigh
  	topMargin + innerHeight - (value * innerHeight / global.visualisation.yAxis.max)
	else
		topMargin + (value * innerHeight / global.visualisation.yAxis.max)

setDivisionText = (x, y, text, innerWidth, leftMargin, innerHeight, topMargin) ->
  x = getXCoordinate(x, innerWidth, leftMargin)
  y = getYCoordinate(y, innerHeight, topMargin)

  global.visualisation.svg.text(x, y, text).attr({
      fill: global.visualisation.colours.division,
      "text-anchor": "middle",
      "class": "division-text"
    })

showCountryInfo = (element, bubbles) ->
	name = element.attr("data-name")
	code = element.attr("data-code")
	valueX = parseFloat(element.attr("data-valueX")).toFixed(2)
	valueY = parseFloat(element.attr("data-valueY")).toFixed(2)

	population = element.attr("data-population")
	gni = element.attr("data-gni")
	poverty = element.attr("data-poverty")

	global.ref.info?.style?.display = "block"

	global.functions.getFlag(code, global.ref.flag)

	global.ref.country_name?.innerHTML = name
	global.ref.value_x?.innerHTML = "<span class='text'>#{global.visualisation.indicator1.name}</span><span class='value'>#{valueX}</span>"
	global.ref.value_y?.innerHTML = "<span class='text'>#{global.visualisation.indicator2.name}</span><span class='value'>#{valueY}</span>"

	if population
		population = formatMoney(population, 2, '.', ',')
		global.ref.value_population?.innerHTML = "<span class='text'>Population</span><span class='value'>#{population}</span>"

	if gni
		gni = if gni != "-" then "$" + formatMoney(gni, 2, '.', ',') else "-"
		global.ref.value_gni?.innerHTML = "<span class='text'>GNI per capita</span><span class='value'>#{gni}</span>"

	if poverty
		if poverty != "-"
			poverty += "%"
		global.ref.value_poverty?.innerHTML = "<span class='text'>Population at less than $2</span><span class='value'>#{poverty}</span>"

	for bubble of bubbles
		group = bubbles[bubble]

		if group == element
			continue

		group?.addClass("empty opened")

	global.visualisation.svg.select("g.texts")?.addClass("opened")
	global.visualisation.svg.select("g.texts text[data-iso3='#{code}']")?.addClass("opened-selected")

hideCountryInfo = (element, bubbles) ->
	global.ref.info?.style?.display = "none"

	for bubble of bubbles
		group = bubbles[bubble]

		group.removeClass("empty opened")

	global.visualisation.svg.select("g.texts").removeClass("opened")
	global.visualisation.svg.select("g.texts text.opened-selected")?.removeClass("opened-selected")

overCountry = (element, bubbles) ->
	element?.addClass("over")
	code = element?.attr("data-code")

	for bubble of bubbles
		group = bubbles[bubble]

		if group == element
			continue

		group?.addClass("over-empty")

	global.visualisation.svg.select("g.texts")?.addClass("over")
	global.visualisation.svg.select("g.texts text[data-iso3='#{code}']")?.addClass("over-selected")

outCountry = (element, bubbles) ->
	for bubble of bubbles
		group = bubbles[bubble]
		group.removeClass("over over-empty")

	global.visualisation.svg.select("g.texts").removeClass("over")
	global.visualisation.svg.select("g.texts text.over-selected")?.removeClass("over-selected")

renderVisualisation = (data, indicator1, indicator2) ->
	observationsByCountry = global.visualisation.getObservationsByCountry(data, indicator1, indicator2)
	dimensions = renderAxis()
	renderBubbles(data, observationsByCountry, indicator1, indicator2, dimensions)

	window.onresize = ->
		dimensions = renderAxis()
		renderBubbles(data, observationsByCountry, indicator1, indicator2, dimensions)

renderAxis = ->
	svg = global.visualisation.container

	# Dimensions
	s_canvas = document.querySelector(svg)
	c = s_canvas?.parentNode?.parentNode

	# Clear SVG
	while (s_canvas.lastChild)
		s_canvas.removeChild(s_canvas.lastChild)

	width = c.clientWidth
	height = c.clientHeight

	if global.screenWidth > global.minWidthForLabels
		height = c.clientHeight

		footerHeight = document.querySelector("footer.visualisation-footer")?.clientHeight
		if footerHeight then height -= footerHeight

		titleHeight = document.querySelector("div.title-x")?.clientHeight
		if titleHeight then height -= titleHeight

	s_canvas.setAttribute("width", width + "px")
	s_canvas.setAttribute("height", height + "px")

	global.visualisation.svg = Snap(svg)

	margins = []

	for margin, i in global.visualisation.margins
		dimension = if i % 2 == 0 then height else width
		margins.push(dimension * (margin / 100))

	# Adjust right margin for mobile
	margins[1] = if global.screenWidth > global.minWidthForLabels then margins[1] else margins[1] * 2.9

	innerWidth = width - margins[1] - margins[3]
	innerHeight = height - margins[0] - margins[2]
	topMargin = margins[0]
	leftMargin = margins[3]
	bottomMargin = margins[2]
	rightMargin = margins[1]

	# X axis

	xAxisY1 = topMargin + innerHeight + bottomMargin * 0.5
	xAxisY2 = xAxisY1 - global.visualisation.xAxis.width
	xAxisX1 = leftMargin
	xAxisX2 = leftMargin + innerWidth

	global.visualisation.svg.path("M#{xAxisX1} #{xAxisY1}L#{xAxisX2} #{xAxisY1}L#{xAxisX2} #{xAxisY2}Z").attr({
		fill: global.visualisation.colours.axis,
		stroke: "none"
	})

	xAxisTextY = xAxisY1 + global.visualisation.xAxis.width * 0.8
	xAxisValueY = xAxisY1 - global.visualisation.xAxis.width * 1.1

	# WORSE
	global.visualisation.svg.text(xAxisX1, xAxisTextY, "WORSE").attr({
		fill: global.visualisation.colours.axis_text,
		"text-anchor": "start",
		"class": "better-worse"
	})

	# BETTER
	global.visualisation.svg.text(xAxisX2, xAxisTextY, "BETTER").attr({
		fill: global.visualisation.colours.axis_text,
		"text-anchor": "end",
		"class": "better-worse"
	})

	# Values

	for value in global.visualisation.xAxis.values
		posX = getXCoordinate(value, innerWidth, leftMargin)

		global.visualisation.svg.text(posX, xAxisValueY, value).attr({
			fill: global.visualisation.colours.axis_text,
			"text-anchor": "middle"
			})

	# Y axis

	yAxisY1 = topMargin
	yAxisY2 = topMargin + innerHeight
	yAxisX = leftMargin + innerWidth + rightMargin * 0.3
	yAxisX1 = yAxisX - global.visualisation.yAxis.width / 2
	yAxisX2 = yAxisX + global.visualisation.yAxis.width / 2

	if global.visualisation.yAxis.lowToHigh
		global.visualisation.svg.path("M#{yAxisX1} #{yAxisY1}L#{yAxisX2} #{yAxisY1}L#{yAxisX} #{yAxisY2}Z").attr({
			fill: global.visualisation.colours.axis,
			stroke: "none"
		})
	else
		global.visualisation.svg.path("M#{yAxisX1} #{yAxisY2}L#{yAxisX2} #{yAxisY2}L#{yAxisX} #{yAxisY1}Z").attr({
			fill: global.visualisation.colours.axis,
			stroke: "none"
		})

	yAxisTextY1 = yAxisY1 - global.visualisation.yAxis.width * 0.3

	if global.screenWidth < global.minWidthForLabels
		if yAxisTextY1 < 10 then yAxisTextY1 = 10

	yAxisTextY2 = yAxisY2 + global.visualisation.yAxis.width * 0.8
	yAxisValueX = yAxisX1 - global.visualisation.yAxis.width * 0.9

	# BETTER
	global.visualisation.svg.text(yAxisX, yAxisTextY1, "BETTER").attr({
		fill: global.visualisation.colours.axis_text,
		"text-anchor": "middle",
		"class": "better-worse"
	})

	# WORSE
	global.visualisation.svg.text(yAxisX, yAxisTextY2, "WORSE").attr({
		fill: global.visualisation.colours.axis_text,
		"text-anchor": "middle",
		"class": "better-worse"
	})

	# Values

	for value in global.visualisation.yAxis.values
		posY = getYCoordinate(value, innerHeight, topMargin)

		global.visualisation.svg.text(yAxisValueX, posY, value).attr({
			fill: global.visualisation.colours.axis_text,
			"text-anchor": "middle"
		})

	# Background

	###global.visualisation.svg.rect(leftMargin, topMargin, innerWidth, innerHeight).attr({
		fill: global.visualisation.colours.background,
		stroke: "none"
	}) ###

	if global.visualisation.divisions.show
		# Vertical line

		x = global.visualisation.xAxis.max / 2
		x = getXCoordinate(x, innerWidth, leftMargin)

		y1 = getYCoordinate(0, innerHeight, topMargin)
		y2 = getYCoordinate(global.visualisation.yAxis.max, innerHeight, topMargin)

		global.visualisation.svg.line(x, y1, x, y2).attr({
			stroke: global.visualisation.colours.axis
		})

		# Horizontal line

		y = global.visualisation.yAxis.max / 2
		y = getYCoordinate(y, innerHeight, topMargin)

		x1 = getXCoordinate(0, innerWidth, leftMargin)
		x2 = getXCoordinate(global.visualisation.xAxis.max, innerWidth, leftMargin)

		global.visualisation.svg.line(x1, y, x2, y).attr({
			stroke: global.visualisation.colours.axis
		})

		# First text

		text = global.visualisation.divisions.texts[0]

		x = global.visualisation.xAxis.max / 4
		y = global.visualisation.yAxis.max * 3 / 4
		setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin)

		# Second text

		text = global.visualisation.divisions.texts[1]

		x = global.visualisation.xAxis.max * 3 / 4
		y = global.visualisation.yAxis.max * 3 / 4
		setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin)

		# Third text

		text = global.visualisation.divisions.texts[2]

		x = global.visualisation.xAxis.max / 4
		y = global.visualisation.yAxis.max / 4
		setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin)

		# Forth text

		text = global.visualisation.divisions.texts[3]

		x = global.visualisation.xAxis.max * 3 / 4
		y = global.visualisation.yAxis.max / 4
		setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin)

	{
		innerWidth: innerWidth,
		innerHeight: innerHeight,
		margins: margins
	}

renderBubbles = (data, observationsByCountry, indicator1, indicator2, dimensions) ->
	innerWidth = dimensions.innerWidth
	innerHeight = dimensions.innerHeight
	topMargin = dimensions.margins[0]
	leftMargin = dimensions.margins[3]
	bottomMargin = dimensions.margins[2]
	rightMargin = dimensions.margins[1]

	global.visualisation.bubbles = {}

	populationName = global.visualisation.data.population.name

	OldRange = (global.visualisation.data.population.max - global.visualisation.data.population.min)
	NewRange = (global.visualisation.radius.max - global.visualisation.radius.min)

	texts = []

	for country in global.visualisation.data.population.list
		population = country.population
		totalPopulation = country.totalPopulation
		poverty = country.poverty
		gni = country.gni
		observations = observationsByCountry[country.iso3]

		if poverty
			poverty = parseFloat(poverty).toFixed(2)

		if !population
			radius = global.visualisation.radius.min
		else
			radius = (((population - global.visualisation.data.population.min) * NewRange) / OldRange) + global.visualisation.radius.min

		valueX = observations[0].value
		valueY = observations[1].value

		if !valueX or !valueY
			continue

		cX = getXCoordinate(valueX, innerWidth, leftMargin)
		cY = getYCoordinate(valueY, innerHeight, topMargin)

		# Data
		area_type = country.type.toLowerCase()
		short_name = country.short_name

		# Country background
		innerRadius = radius
		factor = 1

		if poverty
			factor = poverty / 100

		g = global.visualisation.svg.g().attr({
			"data-group-type": area_type,
			"data-code": country.iso3,
			"data-name": short_name,
			"data-type": area_type,
			"data-valueX": valueX,
			"data-valueY": valueY,
			"data-population": totalPopulation,
			"data-gni": if gni then gni else "-"
			"data-poverty": if poverty then poverty else "-",
			"class": "bubble"
			})

		if global.visualisation.hasInnerBubble
			bubble = global.visualisation.svg.circle(cX, cY, radius).attr({
				fill: global.visualisation.colours.country_background,
				stroke: "none",
				"data-colour": global.visualisation.colours.country_background,
				"data-type": "back",
				"data-area-type": area_type,
				"data-radio": radius,
				"data-radio-default": global.visualisation.radius.default
				})

			g.add(bubble)

			innerRadius = radius * factor

		# Country foreground

		defaultRadius = global.visualisation.radius.default

		bubble = global.visualisation.svg.circle(cX, cY, innerRadius).attr({
			fill: global.visualisation.colours[area_type],
			stroke: "none",
			"data-type": "fore",
			"data-colour": global.visualisation.colours[area_type],
			"data-area-type": area_type,
			"data-radio": innerRadius,
			"data-radio-default": defaultRadius
			})

		g.mouseover(->
			overCountry(this, global.visualisation.bubbles)
		).mouseout(->
			outCountry(this, global.visualisation.bubbles)
		)

		g.click(->
			hideCountryInfo(this, global.visualisation.bubbles)
			showCountryInfo(this, global.visualisation.bubbles)
			)

		g.add(bubble)

		global.visualisation.bubbles[country.iso3] = g

		# Country text
		texts.push({
				cX: cX,
				cY: cY + radius + global.visualisation.labelMargin,
				iso3: country.iso3,
				name: country.short_name,
				fill: global.visualisation.colours.country_name,
				g: g,
				"data-posY": cY + defaultRadius + global.visualisation.labelMargin,
				"data-posY-default": cY + radius + global.visualisation.labelMargin,
				"area-type": area_type
			})

	g = global.visualisation.svg.g().attr({
		class: "texts"
		})

	gEmerging = g.g().attr({
		class: "emerging"
		})

	gDeveloping = g.g().attr({
		class: "developing"
		})

	if global.screenWidth > global.minWidthForLabels
		for text in texts
			area_type = text["area-type"]
			group = if area_type == "emerging" then gEmerging else gDeveloping

			group.text(text.cX, text.cY, text.iso3).attr({
				"text-anchor": "middle",
				fill: text.fill,
				"data-iso3": text.iso3,
				"data-posY": text["data-posY"],
				"data-posY-default": text["data-posY-default"]
			})

################################################################################
##                                   INIT
################################################################################

global.ref.go.onclick = (event) ->
	code = global.ref?.country_selector?.options[global.ref?.country_selector?.selectedIndex]?.value

	if code
		bubble = global.visualisation.bubbles[code]

		if bubble
			hideCountryInfo(bubble, global.visualisation.bubbles)
			showCountryInfo(bubble, global.visualisation.bubbles)

@loadInitialData = (data) ->
	# Set title
	document.getElementById("visualisation-title")?.innerHTML = global.visualisation.title

	# Set Max and Min radius
	max = global.screenWidth / 12
	min = max / 30
	_default = max / 15
	global.visualisation.radius.max = Math.round(max)
	global.visualisation.radius.min = Math.round(min)
	global.visualisation.radius.default = Math.round(_default)

	if data.indicators
		global.indicators = data.indicators

	global.areasInfo = data.areasInfo?.data

	# Load areas
	loadAreas(data.areas, data.areasInfo)

	global.ref.close?.onclick = ->
		hideCountryInfo(null, global.visualisation.bubbles)
