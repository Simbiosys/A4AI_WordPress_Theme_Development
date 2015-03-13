(function() {
  var global, _ref;

  global = this;

  global.visualisation = {
    container: ".visualisation-container svg",
    svg: null,
    bubbles: null,
    margins: [7, 10, 20, 2],
    title: (_ref = document.getElementById("title1-label")) != null ? _ref.value : void 0,
    indicator1: {
      code: "ACCESS",
      name: "Access",
      icon: "usd"
    },
    indicator2: {
      code: "INFRASTRUCTURE",
      name: "Communications Infrastructure",
      icon: "wifi33"
    },
    colours: {
      background: "#fff",
      emerging: "rgba(236, 150, 46, 0.6)",
      developing: "rgba(53, 180, 176, 0.6)",
      country_name: "#777",
      country_background: "rgba(224, 224, 224, 0.6)",
      axis: "#ddd",
      axis_text: "#aaa",
      division: "#dfdfdf"
    },
    xAxis: {
      values: [25, 50, 75],
      width: 20,
      max: 100
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
      "default": 20
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
    loadData: function(indicator1, indicator2) {
      return getDataCallback(global.indicators);
    },
    getObservations: function(observations, data, indicator1, indicator2) {
      var observation, observation1, observation2, _i, _len;
      observation1 = null;
      observation2 = null;
      for (_i = 0, _len = observations.length; _i < _len; _i++) {
        observation = observations[_i];
        if (observation.indicator === indicator1) {
          observation1 = observation;
        }
        if (observation.indicator === indicator2) {
          observation2 = observation;
        }
      }
      return [observation1, observation2];
    },
    getObservationsByCountry: function(data, indicator1, indicator2) {
      var country, info, observations, observationsByCountry;
      observationsByCountry = {};
      for (country in data) {
        if (country.length !== 3) {
          continue;
        }
        info = data[country].observations;
        observations = global.visualisation.getObservations(info, data, indicator1, indicator2);
        observationsByCountry[country] = observations;
      }
      return observationsByCountry;
    }
  };

}).call(this);
