################################################################################
##                               COUNTRY SEARCH
################################################################################

global = this

global.search = []
global.previousSearch = ""

global.sref = {
  search: document.getElementById("search"),
  requestBox: document.getElementById("request-box")
}

global.slabels = {
  "no-result": document.getElementById("no-result-label").value
}

global.prepareSearchEntries = (areas) ->
	search = []

	for area in areas
    code = area.iso3.toUpperCase()
    continent = area.area

    search_value = "#{area.iso3.toUpperCase()};#{area.search.toUpperCase()}"
    name = area.short_name

    search.push({
      search: search_value,
      name: name,
      code: code
    })

  global.search = search

@hideRequestBox = ->
	global.sref.requestBox.style.display = "none"

showRequestBox = ->
	global.sref.requestBox.style.display = "block"

setRowAsActive = (tbody, index) ->
	activeRows = tbody.querySelectorAll("tr.active")

	for row in activeRows
		row.className = ""

	tbody.querySelectorAll("tr")[index].className = "active"

global.sref.search.onblur = (event) ->
	setTimeout(->
		hideRequestBox()
	, 200)

global.sref.search.onfocus = (event) ->
	value = this.value.trim()

	if value != "" then showRequestBox()

global.sref.search.onkeyup = (event) ->
	value = this.value.toUpperCase().trim()

	if value == global.previousSearch then return

	global.previousSearch = value

	requestBox = global.sref.requestBox

	if value == ""
		hideRequestBox()
		return

	results = []

	for entry in global.search
		search = entry.search

		if search.indexOf(value) != -1
			results.push entry

			if results.length == 10 then break

	showRequestBox()
	requestBox.innerHTML = ''

	table = document.createElement "table"
	requestBox.appendChild table

	tbody = document.createElement "tbody"
	table.appendChild tbody

	if results.length == 0
		tr = document.createElement "tr"
		tr.className = "no-result"
		tbody.appendChild tr

		td = document.createElement "td"
		td.innerHTML = global.slabels["no-result"]
		tr.appendChild td

		return

	for result in results
		name = result.name
		code = result.code

		tr = document.createElement "tr"
		tr.setAttribute("data-iso3", code)
		tr.setAttribute("data-name", name)
		tbody.appendChild tr

		tr.onclick = (event) ->
			global.openCountry(this.getAttribute("data-iso3"), this.getAttribute("data-name"))
			event.stopPropagation()

		# Flag
		td = document.createElement "td"
		td.className = "flag"
		tr.appendChild td

		td.appendChild global.functions.getFlag(code)

		# Name
		td = document.createElement "td"
		td.className = "name"
		td.innerHTML = name
		tr.appendChild td

	# Arrow keys
	index = -1

	global.sref.search.onkeydown = (event) ->
		key = event.keyCode

		switch key
			when 40 # Down key
				rows = document.querySelectorAll(".request-box tr")
				length = rows.length

				if index < length - 1
					index++
					setRowAsActive(tbody, index)

				return false
			when 38 # Up key
				if index >= 1
					index--
					setRowAsActive(tbody, index)

				return false
			when 13 # Enter key
				# Set country
				row = tbody.querySelectorAll("tr")[index]

				if row
					global.openCountry(row.getAttribute("data-iso3"), row.getAttribute("data-name"))
