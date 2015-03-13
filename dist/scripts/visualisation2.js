(function() {
  var global, _ref;

  global = this;

  global.visualisation = {
    container: ".visualisation-container svg",
    svg: null,
    bubbles: null,
    margins: [22, 10, 15, 2],
    title: (_ref = document.getElementById("title2-label")) != null ? _ref.value : void 0,
    indicator1: {
      code: "NY_GNP_PCAP_PP_CD",
      name: "GNI per capita",
      icon: "usd"
    },
    indicator2: {
      code: "mobile_broadband_percentage_GNI",
      name: "Mobile broadband cost",
      icon: "iphone26"
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
      lowToHigh: false
    },
    radius: {
      min: 5,
      max: 150,
      "default": 20
    },
    divisions: {
      show: true,
      texts: ["PROHIBITIVE", "AFFORDABLE", "NOT AFFORDABLE", "MORE AFFORDABLE"]
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
    loadData: function(indicator1, indicator2) {
      return getDataCallback({
        success: true,
        data: global.visualisation.areas
      });
    },
    getObservationsByCountry: function(data, indicator1, indicator2) {
      var code, country, fifth, i, indicator1Max, indicator1Min, indicator2Max, indicator2Min, info, max, observationsByCountry, _i, _j, _len, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      observationsByCountry = {};
      indicator1Min = Number.MAX_VALUE;
      indicator1Max = 0;
      indicator2Min = Number.MAX_VALUE;
      indicator2Max = 0;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        country = data[_i];
        code = country.iso3;
        info = country.info;
        indicator1 = (_ref1 = global.areasInfo) != null ? (_ref2 = _ref1[global.visualisation.indicator1.code]) != null ? (_ref3 = _ref2.values) != null ? (_ref4 = _ref3[code]) != null ? _ref4.value : void 0 : void 0 : void 0 : void 0;
        indicator2 = (_ref5 = global.areasInfo) != null ? (_ref6 = _ref5[global.visualisation.indicator2.code]) != null ? (_ref7 = _ref6.values) != null ? (_ref8 = _ref7[code]) != null ? _ref8.value : void 0 : void 0 : void 0 : void 0;
        if (indicator1) {
          indicator1 = parseFloat(indicator1);
        }
        if (indicator2) {
          indicator2 = parseFloat(indicator2);
        }
        if (indicator1 && indicator1 > indicator1Max) {
          indicator1Max = indicator1;
        }
        if (indicator1 && indicator1 < indicator1Min) {
          indicator1Min = indicator1;
        }
        if (indicator2 && indicator2 > indicator2Max) {
          indicator2Max = indicator2;
        }
        if (indicator2 && indicator2 < indicator2Min) {
          indicator2Min = indicator2;
        }
        observationsByCountry[code] = [
          {
            value: indicator1
          }, {
            value: indicator2
          }
        ];
      }
      max = Math.ceil(indicator1Max / 5000.0) * 5000;
      global.visualisation.xAxis.max = max;
      fifth = max / 5;
      for (i = _j = 0; _j < 5; i = ++_j) {
        global.visualisation.xAxis.values[i] = fifth * i;
      }
      return observationsByCountry;
    }
  };

}).call(this);
