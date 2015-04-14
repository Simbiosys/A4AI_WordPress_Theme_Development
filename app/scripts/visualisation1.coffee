global = this

################################################################################
##                                  SETTINGS
################################################################################

global.visualisation = {
  container: ".visualisation-container svg",
  svg: null,
  bubbles: null,
  margins: [7, 10, 20, 2],
  title: document.getElementById("title1-label")?.value,
  indicator1: {
    code: "ACCESS",
    name: "Access",
    icon: "usd"
  },
  indicator2: {
    code: "INFRASTRUCTURE"
    name: "Communications Infrastructure",
    icon: "wifi33"
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
    min: 12,
    max: 80
  },
  yAxis: {
    values: [25, 50, 75],
    width: 20,
    max: 100,
		lowToHigh: true
  },
  radius: {
    min: 5,
    max: 150,
    default: 20
  },
  divisions: {
    show: false,
    texts: ["NOT AFFORDABLE", "MORE AFFORDABLE", "PROHIBITIVE", "AFFORDABLE"]
  },
  labelMargin: 15,
  hasInnerBubble: false,
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
	  getDataCallback(global.indicators)
	getObservations: (observations, data, indicator1, indicator2) ->
	  observation1 = null
	  observation2 = null

	  for observation in observations
	    if observation.indicator == indicator1
	      observation1 = observation

	    if observation.indicator == indicator2
	      observation2 = observation

	  [
	    observation1,
	    observation2
	  ]
	getObservationsByCountry: (data, indicator1, indicator2) ->
		observationsByCountry = {}

		for country of data
			if country.length != 3 then continue

			info = data[country].observations
			observations = global.visualisation.getObservations(info, data, indicator1, indicator2)

			observationsByCountry[country] = observations

		observationsByCountry
}
