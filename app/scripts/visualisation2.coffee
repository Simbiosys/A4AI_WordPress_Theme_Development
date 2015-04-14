global = this

################################################################################
##                                  SETTINGS
################################################################################

global.visualisation = {
  container: ".visualisation-container svg",
  svg: null,
  bubbles: null,
  margins: [22, 10, 15, 2],
  title: document.getElementById("title2-label")?.value,
  indicator1: {
    code: "NY_GNP_PCAP_PP_CD",
    name: "GNI per capita",
    icon: "usd"
  },
  indicator2: {
    code: "mobile_broadband_percentage_GNI"
    name: "Mobile broadband cost",
    icon: "iphone26"
  },
  colours: {
    background: "#fff",
    emerging: "rgba(236, 150, 46, 0.6)",
    developing: "rgba(53, 180, 176, 0.6)",
    country_name: "#777",
    country_background: "rgba(224, 224, 224, 0.6)"
    axis: "#ddd",
    axis_text: "#aaa",
    division: "#dfdfdf"
  },
  xAxis: {
    values: [25, 50, 75],
    width: 20,
    min: 0,
    max: 100
  },
  yAxis: {
    values: [25, 50],
    width: 20,
    max: 60,
    lowToHigh: false
  },
  radius: {
    min: 5,
    max: 150,
    default: 20
  },
  divisions: {
    show: true,
    texts: ["NOT AFFORDABLE", "AFFORDABLE", "LESS AFFORDABLE", "MORE AFFORDABLE"]
  },
  labelMargin: 15,
  hasInnerBubble: true,
  data: {
    info: {},
    population: {
      name: "SP_POP_TOTL",
      max: 0,
      min: Number.MAX_VALUE,
      top: 1000000000,
      factor: 3,
      byCountry: {},
      list: []
    },
    gni: {
      name: "NY_GNP_PCAP_PP_CD"
    },
    poverty: {
      name: "SI_POV_2DAY"
    }
  },
	loadData: (indicator1, indicator2) ->
	  getDataCallback({
      success: true,
      data: global.visualisation.areas
      })
	getObservationsByCountry: (data, indicator1, indicator2) ->
    observationsByCountry = {}

    indicator1Min = Number.MAX_VALUE
    indicator1Max = 0

    indicator2Min = Number.MAX_VALUE
    indicator2Max = 0

    for country in data
      code = country.iso3

      info = country.info
      indicator1 = global.areasInfo?[global.visualisation.indicator1.code]?.values?[code]?.value
      indicator2 = global.areasInfo?[global.visualisation.indicator2.code]?.values?[code]?.value

      if indicator1 then indicator1 = parseFloat(indicator1)
      if indicator2 then indicator2 = parseFloat(indicator2)

      if indicator1 and indicator1 > indicator1Max
        indicator1Max = indicator1

      if indicator1 and indicator1 < indicator1Min
        indicator1Min = indicator1

      if indicator2 and indicator2 > indicator2Max
        indicator2Max = indicator2

      if indicator2 and indicator2 < indicator2Min
        indicator2Min = indicator2

      observationsByCountry[code] = [
        { value: indicator1 },
        { value: indicator2 }
      ]

    # Max to nearest multiple of 5000
    max = Math.ceil(indicator1Max / 5000.0) * 5000
    global.visualisation.xAxis.max = max

    fifth = max / 5

    for i in [0...5]
      global.visualisation.xAxis.values[i] = fifth * i

    observationsByCountry
}
