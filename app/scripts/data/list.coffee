global = this

if global.listLoaded
  return

global.listLoaded = true

global.listFunctions = {}

sortTableRows = (areas, positions) ->
  index = 0

  isMobile = global.functions.isMobile()

  list = []

  for area in areas
    tr = global.ref.countryListBody.querySelector("tr[data-area=#{area.area}]")

    if tr
      if isMobile
        list.push(tr)
      else
        tr.style.top = positions[index] + "px"
        tr.style.position = "absolute"

    index++

  if isMobile
    seeMore = global.ref.countryListBody.querySelector("tr.see-more")
    global.ref.countryListBody.innerHTML = ""

    count = 1

    for tr in list
      global.ref.countryListBody.appendChild tr

      tr.style.display = if count > 5 then "none" else "block"

      count++

    global.ref.countryListBody.appendChild seeMore

sortAreasByRank = (areas, positions) ->
	areas.sort((a, b) ->
		aRanking = if a.ranking then a.ranking else 100
		bRanking = if b.ranking then b.ranking else 100

		if aRanking != bRanking
			return aRanking - bRanking

		aIndex = global.indexValues[a.area]?["INDEX"]?.value
		bIndex = global.indexValues[b.area]?["INDEX"]?.value

		return bIndex - aIndex
	)

	if positions
		sortTableRows(areas, positions)

sortAreasByName = (areas, positions) ->
	areas.sort((a, b) ->
		a = a["short_name"].toLowerCase()
		b = b["short_name"].toLowerCase()

		if a < b
			return -1

		if a > b
			return  1

		return 0
	)

	if positions
		sortTableRows(areas, positions)

global.listFunctions.clearTable = ->
	countryListBody = global.ref.countryListBody
	countryListBody?.innerHTML = ""

global.listFunctions.renderTable = (areas, developingColours, emergingColours, minDeveloping, minEmerging) ->
  countryListBody = global.ref.countryListBody

  isMobile = global.functions.isMobile()

  count = 1
  top = 0

  positions = []

  sortAreasByRank(areas)

  # Scale
  scale = global.selections.indicatorOption?.getAttribute("data-scale")

  for area in areas
    name = area.short_name
    code = area.area.toUpperCase()
    continent = area.continent.toUpperCase()
    continentName = global.continents[continent]
    value = if area.value then parseFloat(area.value).toFixed(2) else null
    area_type = if area.area_type then area.area_type?.toUpperCase() else "EMERGING"
    colour = if area_type == "EMERGING" then global.colours.emerging else global.colours.developing
    rank = area.ranking

    positions.push(top)

    tr = countryListBody.querySelector("tr[data-area='#{code}']")

    trExists = if tr then true else false

    if !trExists
      tr = document.createElement "tr"
      tr.setAttribute("data-area", code)
      countryListBody.appendChild tr

      tr.onclick = (event) ->
        global.functions.selectCountryInSelector(this.getAttribute("data-area"))

    tr.style.top = top + "px"

    # Ranking
    if trExists
      td = tr.querySelector("td.ranking")
    else
      td = document.createElement "td"
      td.className = "ranking " + area_type + (if rank then "" else " empty")
      tr.appendChild td

    td?.innerHTML = if rank then rank else "-"

    # Flag

    if trExists
      td = tr.querySelector("td.flag")
    else
      td = document.createElement "td"
      td.className = "flag"
      tr.appendChild td
      td.appendChild global.functions.getFlag(code)

    # Name

    if !trExists
      td = document.createElement "td"
      td.className = "name"
      tr.appendChild td

      p = document.createElement "p"
      p.innerHTML = name
      p.className = "name"
      td.appendChild p

      p = document.createElement "p"
      p.innerHTML = continentName
      p.className = "continent"
      td.appendChild p

    # Value
    if trExists
      tdValue = tr.querySelector("td.pie.value")
    else
      tdValue = document.createElement "td"
      tdValue.className = "pie value"
      tr.appendChild tdValue

      tdValue.id = "v" + wesCountry.guid()

    tdValue.innerHTML = ""
    global.functions.renderValuePieChart(tdValue, value, colour, global.selections.indicator)

    # Scale

    if scale
      p = document.createElement "p"
      p.className = "scale"
      p.innerHTML = scale
      tdValue.appendChild p

    # Affordability Index
    if trExists
      tdIndex = tr.querySelector("td.pie.index")
    else
      tdIndex = document.createElement "td"
      tdIndex.className = "pie index-values index"
      tr.appendChild tdIndex

      tdIndex.id = "v" + wesCountry.guid()
      global.functions.renderTheIndexPieChart(tdIndex, code, colour)

    # Communications Infrastructure subindex
    if trExists
      tdSubindex1 = tr.querySelector("td.pie.subindex1")
    else
      tdSubindex1 = document.createElement "td"
      tdSubindex1.className = "pie index-values subindex1"
      tr.appendChild tdSubindex1

      tdSubindex1.id = "v" + wesCountry.guid()
      global.functions.renderInfrastructurePieChart(tdSubindex1, code, colour)

    # Access and Affordability subindex
    if trExists
      tdSubindex2 = tr.querySelector("td.pie.subindex2")
    else
      tdSubindex2 = document.createElement "td"
      tdSubindex2.className = "pie index-values subindex2"
      tr.appendChild tdSubindex2

      tdSubindex2.id = "v" + wesCountry.guid()
      global.functions.renderAccessPieChart(tdSubindex2, code, colour)

    top += tr.offsetHeight

    count++

  if isMobile
    tr = countryListBody.querySelector("tr.see-more")

    trExists = if tr then true else false

    if !trExists
      tr = document.createElement "tr"
      tr.className = "see-more"
      countryListBody.appendChild tr

      td = document.createElement "td"
      td.innerHTML = '<span>SEE MORE</span> <i class="fa fa-angle-down"></i>'
      tr.appendChild td

      tr.opened = false

      tr.onclick = (event) ->
        opened = !this.opened
        this.opened = opened

        if opened
          rows = this.parentNode?.querySelectorAll("tr")
        else
          rows = this.parentNode?.querySelectorAll("tr:nth-child(n + 6)")

        for row in rows
          row.style.display = if opened then "block" else "none"

        this.style.display = "block"

        td = this.children[0]

        td.innerHTML = if opened then '<span>SEE LESS</span> <i class="fa fa-angle-up"></i>' else '<span>SEE MORE</span> <i class="fa fa-angle-down"></i>'

  # Set height

  if !global.functions.isMobile()
    countryListBody.style.minHeight = countryListBody.clientHeight + "px"

  # Sorting

  global.ref.switch2_by_name.onchange = (event) ->
    if !this.checked then return

    sortAreasByName(areas, positions)

  global.ref.switch2_by_rank.onchange = (event) ->
    if !this.checked then return

    sortAreasByRank(areas, positions)

  sortAreasByRank(areas, positions)
