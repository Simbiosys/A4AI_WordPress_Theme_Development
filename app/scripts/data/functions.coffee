global = this

if global.functionsLoaded
  return

global.functionsLoaded = true

@loadReferences = ->
  global.ref = {
    path: document.getElementById("path")?.value,
    bars: document.getElementById("bars"),
    map: document.getElementById("map"),
    indicatorSelector: document.getElementById("indicator-selector"),
    countryIndicatorSelector: document.getElementById("country-indicator-selector"),
    path: document.getElementById("path")?.value,
    switch1_by_rank: document.getElementById("switch1_by_rank"),
    switch1_by_name: document.getElementById("switch1_by_name"),
    country_list: document.getElementById("country-list"),
    countryListBody: document.getElementById("country-list-body"),
    switch2_by_rank: document.getElementById("switch2_by_rank"),
    switch2_by_name: document.getElementById("switch2_by_name"),
    country_indicator_pie: document.getElementById("country-indicator-pie"),
    country_indicator_bar: document.getElementById("country-indicator-bar"),
    legend_this_country_circle: document.getElementById("legend-this-country-circle"),
    legend_this_country_name: document.getElementById("legend-this-country-name"),
    legend_mean_circle: document.getElementById("legend-mean-circle"),
    legend_mean_name: document.getElementById("legend-mean-name"),
    ranking_this_country_value: document.getElementById("ranking-this-country-value"),
    ranking_this_country_label: document.getElementById("ranking-this-country-label"),
    ranking_mean_value: document.getElementById("ranking-mean-value"),
    ranking_mean_label: document.getElementById("ranking-mean-label"),
    country_flag: document.getElementById("country-flag"),
    country_name: document.getElementById("country-name"),
    country_continent: document.getElementById("country-continent"),
    close: document.getElementById("close"),
    country_detail: document.getElementById("country-detail"),
    country_this_index: document.getElementById("country-this-index"),
    country_this_infrastructure: document.getElementById("country-this-infrastructure"),
    country_this_access: document.getElementById("country-this-access"),
    country_other_index: document.getElementById("country-other-index"),
    country_other_infrastructure: document.getElementById("country-other-infrastructure"),
    country_other_access: document.getElementById("country-other-access"),
    compare_to: document.getElementById("compare-to"),
    country_selector: document.getElementById("country-selector"),
    country_compare_selector: document.getElementById("country-compare-selector"),
    ranking_other_country_value: document.getElementById("ranking-other-country-value"),
    ranking_other_country_label: document.getElementById("ranking-other-country-label"),
    ranking_other_mean_value: document.getElementById("ranking-other-mean-value"),
    ranking_other_mean_label: document.getElementById("ranking-other-mean-label"),
    compare_section: document.getElementById("compare-section"),
    btn_compare: document.getElementById("btn-compare"),
    btn_indicator: document.getElementById("btn-indicator"),
    btn_country_indicator: document.getElementById("btn-country-indicator"),
    population_label_this: document.getElementById("population_label_this"),
    gni_label_this: document.getElementById("gni_label_this"),
    broadband_label_this: document.getElementById("broadband_label_this"),
    poverty_label_this: document.getElementById("poverty_label_this"),
    population_label_other: document.getElementById("population_label_other"),
    gni_label_other: document.getElementById("gni_label_other"),
    broadband_label_other: document.getElementById("broadband_label_other"),
    poverty_label_other: document.getElementById("poverty_label_other"),
    loading: document.getElementById("loading"),
    source: document.getElementById("source"),
    blank: document.getElementById("blank"),
    indicator_table: document.getElementById("indicator-table"),
    indicator_detail: document.getElementById("indicator-detail"),
    indicator_info_button: document.getElementById("indicator-info-button"),
    close_indicator: document.getElementById("close-indicator"),
    btn_country: document.getElementById("btn-country"),
    pies: document.getElementById("pies"),
    body_wrapper: null
  }

global.labels = {
	map: document.getElementById("map-label")?.value,
	"no-result": document.getElementById("no-result-label")?.value,
	value: document.getElementById("value-label")?.value,
	ranking: document.getElementById("ranking-label")?.value
}

global.charts = {}

global.continents = {
  "AFR": "Africa",
  "EAS": "East Asia & Pacific",
  "ECS": "Europe & Central Asia",
  "LCN": "Latin America & Caribbean",
  "MEA": "Middle East",
  "SAS": "South Asia"
}

global.data = {}

global.colours = {
  emerging: "#EC962E",
  developing: "#35B4B0",
  emerging_light: "#F3DDBF",
  developing_light: "#B4EBEA",
  mean: "#AAAAAA"
}

global.minMaxDeveloping = null
global.minMaxEmerging = null

global.indexValues = {}

global.selections = {
	indicator: "INDEX",
	year: "LATEST"
}

################################################################################
##                                    AUX
################################################################################

global.functions = {}

global.functions.isMobile = ->
  check = false
  ((a, b) ->
    if /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) or /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
      check = true
    return
  ) navigator.userAgent or navigator.vendor or window.opera
  check

global.functions.getPageHeight = () ->
  myWidth = 0
  myHeight = 0

  if typeof(window.innerWidth) == 'number'
    # Non-IE
    myWidth = window.innerWidth
    myHeight = window.innerHeight
  else if document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)
    # IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth
    myHeight = document.documentElement.clientHeight
  else if document.body && (document.body.clientWidth || document.body.clientHeight)
    # IE 4 compatible
    myWidth = document.body.clientWidth
    myHeight = document.body.clientHeight

  myHeight

global.functions.getMinMaxValue = (areas, income) ->
  income = income.toUpperCase()
  found = false
  absoluteMax = 0
  max = 0
  min = Number.MAX_VALUE
  count = 0

  for area in areas
    value = area.value
    type = if area.area_type then area.area_type.toUpperCase() else ""

    if value > absoluteMax
      absoluteMax = value

    if type == income
      found = true

      if value > max
        max = value

      if value < min
        min = value

      count++

  min = Math.floor(min)
  max = Math.ceil(max + 1)

  if !found
    min = 0
    max = absoluteMax

  return {
    min: min,
    max: max,
    length: (max - min + 1),
    count: count
  }

global.functions.getFlag = (code) ->
  img = document.createElement "img"
  img.className = "flag flag-#{code}"

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

global.functions.getIndexValue = (code) ->
  element = global.indexValues[code]

  if !element
    element = { }

  aux = {
    value: 0,
    ranked: 0
  }

  if !element["INDEX"]
    element["INDEX"] = aux

  if !element["ACCESS"]
    element["ACCESS"] = aux

  if !element["INFRASTRUCTURE"]
    element["INFRASTRUCTURE"] = aux

  element

global.functions.getIndicatorTop = (code) ->
  code = document.querySelector("#indicator-selector option[value='#{code}']")

  if !code then return null

  option = global.selections.indicatorOption
  type = option?.getAttribute("data-type")?.toUpperCase()
  is_percentage = option?.getAttribute("data-is_percentage")

  if type == "PRIMARY" then return 10

  if is_percentage == "true" or type == "INDEX" or type == "SUBINDEX"
    return 100

  return null

global.functions.formatMoney = (number, c, d, t) ->
  n = number
  c = if isNaN(c = Math.abs(c)) then 2 else c
  d = if d == undefined then "." else d
  t = if t == undefined then "," else t
  s = if n < 0 then "-" else ""
  i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + ""
  j = if (j = i.length) > 3 then j % 3 else 0

  s + (if j then i.substr(0, j) + t else "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (if c then d + Math.abs(n - i).toFixed(c).slice(2) else "");

################################################################################
##                                  CHARTS
################################################################################

global.functions.renderPieChart = (container, value, colour, showLabel, code, maxValue) ->
  div = document.createElement "div"
  div.id = "d" + wesCountry.guid()
  div.className = "pie-wrapper"
  c = document.querySelector(container)
  c?.innerHTML = ""
  c?.appendChild div

  if !maxValue
    maxValue = global.functions.getIndicatorTop(code)

  if maxValue
    wesCountry.charts.chart({
      chartType: "pie",
      container: "##{div.id}",
      series: [{ name: "REMAINDER", values: [ maxValue - value ] }, { name: "EMERGING", values: [ value ] }],
      valueOnItem: {
        show: false
      },
      legend: {
        show: false
      },
      xAxis: {
        values: [""],
        margin: 0
      },
      serieColours: ["#ddd", colour],
      margins: [0, 0, 0, 0],
      showOverColour: false
    })
  else
    div.style.display = "none"

  if showLabel
    parent = c?.parentNode
    label = parent?.querySelector("label")

    if !label
      label = document.createElement "label"
      parent?.appendChild label

    label.className = if maxValue then "value" else "value no-pie"
    label.innerHTML = parseFloat(value).toFixed(2)

  div

global.functions.renderValuePieChart = (container, value, colour, indicator_code) ->
  container.id = "c" + wesCountry.guid()
  wrapper = global.functions.renderPieChart("##{container.id}", value, colour, false, indicator_code)

  label = document.createElement "label"
  label.className = "value"
  label.innerHTML = if value then parseFloat(value).toFixed(2) else "-"
  container.appendChild label

global.functions.renderIndexPieChart = (container, code, title, field, colour) ->
  indexValues = global.functions.getIndexValue(code)

  if !indexValues then return

  value = indexValues[field].value
  rank = indexValues[field].ranked

  label = document.createElement "label"
  label.className = "title #{field.toLowerCase()}"
  label.innerHTML = title
  container.appendChild label

  pieContainer = document.createElement("div")
  pieContainer.id = "p" + wesCountry.guid()
  container.appendChild(pieContainer)

  container.id = "c" + wesCountry.guid()
  wrapper = global.functions.renderPieChart("##{pieContainer.id}", value, colour, false, field, 100)

  div = document.createElement "div"
  div.className = "values"
  container.appendChild div

  label = document.createElement "label"
  label.className = "value-label"
  label.innerHTML = global.labels.value
  div.appendChild label

  label = document.createElement "label"
  label.className = "value"
  label.innerHTML = value
  div.appendChild label

  label = document.createElement "label"
  label.className = "ranking-label"
  label.innerHTML = global.labels.ranking
  div.appendChild label

  label = document.createElement "label"
  label.className = "ranking"
  label.innerHTML = rank
  div.appendChild label

global.functions.renderTheIndexPieChart = (container, code, colour) ->
  global.functions.renderIndexPieChart(container, code, "Affordability Index", "INDEX", colour)

global.functions.renderInfrastructurePieChart = (container, code, colour) ->
  global.functions.renderIndexPieChart(container, code, "Communications Infrastructure sub-index", "INFRASTRUCTURE", colour)

global.functions.renderAccessPieChart = (container, code, colour) ->
  global.functions.renderIndexPieChart(container, code, "Access sub-index", "ACCESS", colour)
