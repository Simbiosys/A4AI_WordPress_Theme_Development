(function() {
  var getPath, getScreenWidth, internetDisparity, isSmall, renderCharts, serie1, serie2, serie3;

  getScreenWidth = function() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  };

  isSmall = function() {
    return getScreenWidth() < 780;
  };

  serie1 = {
    container: "#affordability-index-chart",
    chartType: "scatter",
    showFitLine: {
      show: true,
      colour: "#31799F",
      stroke: 3
    },
    legend: {
      show: false
    },
    margins: [5, (isSmall() ? 5 : 1), 10, (isSmall() ? 5 : 1)],
    xAxis: {
      title: "2014 Affordability Index scores",
      margin: 10,
      "font-size": "10pt"
    },
    yAxis: {
      title: "Price of mobile broadband, prepaid hand-set based (500MB)",
      "font-size": "8pt",
      pow: 10,
      margin: isSmall() ? 20 : 10
    },
    sizeByValueMinRadius: isSmall() ? 2 : 0.5,
    title: "Figure 2. Affordability Index Scores and Broadband Prices",
    "foot": "Sources: A4AI, ITU",
    getElementColour: function(options, element, index, subindex) {
      var info;
      info = element.values[subindex] ? element.values[subindex][2] : null;
      if (info && info.type === "DEVELOPING") {
        return "#35B4B0";
      } else {
        return "#EC962E";
      }
    },
    series: [
      {
        name: "First",
        values: [
          [
            51.4432640075684, 2.7, {
              "iso3": "ARG",
              "ITUS": 2.7,
              "type": "EMERGING",
              "name": "Argentina",
              "affordability": 51.4432640075684
            }
          ], [
            37.1354675292969, 16.8, {
              "iso3": "BGD",
              "ITUS": 16.8,
              "type": "DEVELOPING",
              "name": "Bangladesh",
              "affordability": 37.1354675292969
            }
          ], [
            42.5473709106445, 9, {
              "iso3": "BWA",
              "ITUS": 9,
              "type": "EMERGING",
              "name": "Botswana",
              "affordability": 42.5473709106445
            }
          ], [
            57.1397857666016, 4, {
              "iso3": "BRA",
              "ITUS": 4,
              "type": "EMERGING",
              "name": "Brazil",
              "affordability": 57.1397857666016
            }
          ], [
            42.872932434082, 3.8, {
              "iso3": "CHN",
              "ITUS": 3.8,
              "type": "EMERGING",
              "name": "China",
              "affordability": 42.872932434082
            }
          ], [
            62.576416015625, 5.8, {
              "iso3": "COL",
              "ITUS": 5.8,
              "type": "EMERGING",
              "name": "Colombia",
              "affordability": 62.576416015625
            }
          ], [
            62.815357208252, 2.8, {
              "iso3": "CRI",
              "ITUS": 2.8,
              "type": "EMERGING",
              "name": "Costa Rica",
              "affordability": 62.815357208252
            }
          ], [
            44.1999206542969, 26.1, {
              "iso3": "DOM",
              "ITUS": 26.1,
              "type": "EMERGING",
              "name": "Dominican Republic",
              "affordability": 44.1999206542969
            }
          ], [
            51.9889640808106, 6.3, {
              "iso3": "ECU",
              "ITUS": 6.3,
              "type": "EMERGING",
              "name": "Ecuador",
              "affordability": 51.9889640808106
            }
          ], [
            38.1091079711914, 3.9, {
              "iso3": "EGY",
              "ITUS": 3.9,
              "type": "DEVELOPING",
              "name": "Egypt",
              "affordability": 38.1091079711914
            }
          ], [
            13.9589700698853, 0.811914893617021, {
              "iso3": "ETH",
              "ITUS": 0.811914893617021,
              "type": "DEVELOPING",
              "name": "Ethiopia",
              "affordability": 13.9589700698853
            }
          ], [
            41.4240455627441, 9, {
              "iso3": "GHA",
              "ITUS": 9,
              "type": "DEVELOPING",
              "name": "Ghana",
              "affordability": 41.4240455627441
            }
          ], [
            13.3221940994263, 16.9, {
              "iso3": "HTI",
              "ITUS": 16.9,
              "type": "DEVELOPING",
              "name": "Haiti",
              "affordability": 13.3221940994263
            }
          ], [
            39.0794258117676, 2.9, {
              "iso3": "IND",
              "ITUS": 2.9,
              "type": "DEVELOPING",
              "name": "India",
              "affordability": 39.0794258117676
            }
          ], [
            40.707275390625, 2.3, {
              "iso3": "IDN",
              "ITUS": 2.3,
              "type": "DEVELOPING",
              "name": "Indonesia",
              "affordability": 40.707275390625
            }
          ], [
            47.0530166625977, 4.9, {
              "iso3": "JAM",
              "ITUS": 4.9,
              "type": "EMERGING",
              "name": "Jamaica",
              "affordability": 47.0530166625977
            }
          ], [
            33.6228103637695, 2.3, {
              "iso3": "JOR",
              "ITUS": 2.3,
              "type": "EMERGING",
              "name": "Jordan",
              "affordability": 33.6228103637695
            }
          ], [
            36.3558578491211, 1, {
              "iso3": "KAZ",
              "ITUS": 1,
              "type": "EMERGING",
              "name": "Kazakhstan",
              "affordability": 36.3558578491211
            }
          ], [
            43.8111724853516, 8.2, {
              "iso3": "KEN",
              "ITUS": 8.2,
              "type": "DEVELOPING",
              "name": "Kenya",
              "affordability": 43.8111724853516
            }
          ], [
            19.5261764526367, 45.1, {
              "iso3": "MWI",
              "ITUS": 45.1,
              "type": "DEVELOPING",
              "name": "Malawi",
              "affordability": 19.5261764526367
            }
          ], [
            61.0045318603516, 0.0178846153846154, {
              "iso3": "MYS",
              "ITUS": 0.0178846153846154,
              "type": "EMERGING",
              "name": "Malaysia",
              "affordability": 61.0045318603516
            }
          ], [
            31.4916152954102, 19.6, {
              "iso3": "MLI",
              "ITUS": 19.6,
              "type": "DEVELOPING",
              "name": "Mali",
              "affordability": 31.4916152954102
            }
          ], [
            56.7538871765137, 1.8, {
              "iso3": "MUS",
              "ITUS": 1.8,
              "type": "EMERGING",
              "name": "Mauritius",
              "affordability": 56.7538871765137
            }
          ], [
            48.2403259277344, 2.5, {
              "iso3": "MEX",
              "ITUS": 2.5,
              "type": "EMERGING",
              "name": "Mexico",
              "affordability": 48.2403259277344
            }
          ], [
            50.5414123535156, 20, {
              "iso3": "MAR",
              "ITUS": 20,
              "type": "DEVELOPING",
              "name": "Morocco",
              "affordability": 50.5414123535156
            }
          ], [
            30.5827445983887, 65.9, {
              "iso3": "MOZ",
              "ITUS": 65.9,
              "type": "DEVELOPING",
              "name": "Mozambique",
              "affordability": 30.5827445983887
            }
          ], [
            38.1872711181641, 8.8, {
              "iso3": "NAM",
              "ITUS": 8.8,
              "type": "EMERGING",
              "name": "Namibia",
              "affordability": 38.1872711181641
            }
          ], [
            25.0163173675537, 0.420821917808219, {
              "iso3": "NPL",
              "ITUS": 0.420821917808219,
              "type": "DEVELOPING",
              "name": "Nepal",
              "affordability": 25.0163173675537
            }
          ], [
            50.9437713623047, 13, {
              "iso3": "NGA",
              "ITUS": 13,
              "type": "DEVELOPING",
              "name": "Nigeria",
              "affordability": 50.9437713623047
            }
          ], [
            42.4568786621094, 3.1, {
              "iso3": "PAK",
              "ITUS": 3.1,
              "type": "DEVELOPING",
              "name": "Pakistan",
              "affordability": 42.4568786621094
            }
          ], [
            59.111026763916, 3.2, {
              "iso3": "PER",
              "ITUS": 3.2,
              "type": "EMERGING",
              "name": "Peru",
              "affordability": 59.111026763916
            }
          ], [
            39.6114959716797, 6.3, {
              "iso3": "PHL",
              "ITUS": 6.3,
              "type": "DEVELOPING",
              "name": "Philippines",
              "affordability": 39.6114959716797
            }
          ], [
            51.3382339477539, 17.5, {
              "iso3": "RWA",
              "ITUS": 17.5,
              "type": "DEVELOPING",
              "name": "Rwanda",
              "affordability": 51.3382339477539
            }
          ], [
            32.2092666625977, 35.7, {
              "iso3": "SEN",
              "ITUS": 35.7,
              "type": "DEVELOPING",
              "name": "Senegal",
              "affordability": 32.2092666625977
            }
          ], [
            13.7271194458008, 109.1, {
              "iso3": "SLE",
              "ITUS": 109.1,
              "type": "DEVELOPING",
              "name": "Sierra Leone",
              "affordability": 13.7271194458008
            }
          ], [
            43.3131408691406, 3.8, {
              "iso3": "ZAF",
              "ITUS": 3.8,
              "type": "EMERGING",
              "name": "South Africa",
              "affordability": 43.3131408691406
            }
          ], [
            49.5743942260742, 0.0263687150837989, {
              "iso3": "THA",
              "ITUS": 0.0263687150837989,
              "type": "EMERGING",
              "name": "Thailand",
              "affordability": 49.5743942260742
            }
          ], [
            44.9300498962402, 1, {
              "iso3": "TUN",
              "ITUS": 1,
              "type": "EMERGING",
              "name": "Tunisia",
              "affordability": 44.9300498962402
            }
          ], [
            61.888053894043, 2, {
              "iso3": "TUR",
              "ITUS": 2,
              "type": "EMERGING",
              "name": "Turkey",
              "affordability": 61.888053894043
            }
          ], [
            47.7720489501953, 23.3, {
              "iso3": "UGA",
              "ITUS": 23.3,
              "type": "DEVELOPING",
              "name": "Uganda",
              "affordability": 47.7720489501953
            }
          ], [
            40.6727485656738, 11.3, {
              "iso3": "TZA",
              "ITUS": 11.3,
              "type": "DEVELOPING",
              "name": "United Republic Of Tanzania",
              "affordability": 40.6727485656738
            }
          ], [
            33.8526840209961, 1.4, {
              "iso3": "VEN",
              "ITUS": 1.4,
              "type": "EMERGING",
              "name": "Venezuela (Bolivarian Republic Of)",
              "affordability": 33.8526840209961
            }
          ], [
            43.1876373291016, 2, {
              "iso3": "VNM",
              "ITUS": 2,
              "type": "DEVELOPING",
              "name": "Viet Nam",
              "affordability": 43.1876373291016
            }
          ], [
            0.802389204502106, 26.2, {
              "iso3": "YEM",
              "ITUS": 26.2,
              "type": "DEVELOPING",
              "name": "Yemen",
              "affordability": 0.802389204502106
            }
          ], [
            36.4380416870117, 22.3, {
              "iso3": "ZMB",
              "ITUS": 22.3,
              "type": "DEVELOPING",
              "name": "Zambia",
              "affordability": 36.4380416870117
            }
          ], [
            24.9548187255859, 101.3, {
              "iso3": "ZWE",
              "ITUS": 101.3,
              "type": "DEVELOPING",
              "name": "Zimbabwe",
              "affordability": 24.9548187255859
            }
          ]
        ]
      }
    ],
    events: {
      "onmouseover": function(info) {
        var ITUS, affordability, iso, name, text;
        iso = info["data-iso3"];
        name = info["data-name"];
        affordability = parseFloat(info["data-affordability"]).toFixed(2);
        ITUS = parseFloat(info["data-ITUS"]).toFixed(2);
        text = "<div class='chart-tooltip'><img class='flag' src='" + (getPath()) + "/images/flags/" + iso + ".png' />";
        text += "<span class='country'>" + name + "</span>";
        text += "<span class='text'>Score: </span><span class='value'>" + affordability + "</span>";
        text += "<span class='text'>Broadband price: </span><span class='value'>" + ITUS + "</span></div>";
        return wesCountry.charts.showTooltip(text, info.event);
      }
    }
  };

  serie2 = {
    container: "#itus-cluster-chart",
    chartType: "scatter",
    showFitLine: {
      show: true,
      colour: "#31799F",
      stroke: 3
    },
    legend: {
      show: false
    },
    margins: [5, (isSmall() ? 5 : 1), 10, (isSmall() ? 5 : 1)],
    xAxis: {
      title: "Effective Broadband Strategies",
      margin: 10,
      "font-size": "10pt"
    },
    yAxis: {
      title: "Price of mobile broadband, prepaid hand-set based (500MB)",
      "font-size": "8pt",
      pow: 10,
      margin: isSmall() ? 20 : 10
    },
    sizeByValueMinRadius: isSmall() ? 2 : 0.5,
    title: "Figure 4. Broadband Strategies and Prices",
    "foot": "Sources: A4AI, ITU",
    getElementColour: function(options, element, index, subindex) {
      var info;
      info = element.values[subindex] ? element.values[subindex][2] : null;
      if (info && info.type === "DEVELOPING") {
        return "#35B4B0";
      } else {
        return "#EC962E";
      }
    },
    series: [
      {
        name: "First",
        values: [
          [
            7.33333333333333, 2.7, {
              "cluster2": 7.33333333333333,
              "iso3": "ARG",
              "type": "EMERGING",
              "name": "Argentina",
              "ITUS": 2.7
            }
          ], [
            4.66666666666667, 16.8, {
              "cluster2": 4.66666666666667,
              "iso3": "BGD",
              "type": "DEVELOPING",
              "name": "Bangladesh",
              "ITUS": 16.8
            }
          ], [
            5.5, 9, {
              "cluster2": 5.5,
              "iso3": "BWA",
              "type": "EMERGING",
              "name": "Botswana",
              "ITUS": 9
            }
          ], [
            5.16666666666667, 4, {
              "cluster2": 5.16666666666667,
              "iso3": "BRA",
              "type": "EMERGING",
              "name": "Brazil",
              "ITUS": 4
            }
          ], [
            5.5, 3.8, {
              "cluster2": 5.5,
              "iso3": "CHN",
              "type": "EMERGING",
              "name": "China",
              "ITUS": 3.8
            }
          ], [
            7.66666666666667, 5.8, {
              "cluster2": 7.66666666666667,
              "iso3": "COL",
              "type": "EMERGING",
              "name": "Colombia",
              "ITUS": 5.8
            }
          ], [
            7.16666666666667, 2.8, {
              "cluster2": 7.16666666666667,
              "iso3": "CRI",
              "type": "EMERGING",
              "name": "Costa Rica",
              "ITUS": 2.8
            }
          ], [
            5, 26.1, {
              "cluster2": 5,
              "iso3": "DOM",
              "type": "EMERGING",
              "name": "Dominican Republic",
              "ITUS": 26.1
            }
          ], [
            5.5, 6.3, {
              "cluster2": 5.5,
              "iso3": "ECU",
              "type": "EMERGING",
              "name": "Ecuador",
              "ITUS": 6.3
            }
          ], [
            5.75, 3.9, {
              "cluster2": 5.75,
              "iso3": "EGY",
              "type": "DEVELOPING",
              "name": "Egypt",
              "ITUS": 3.9
            }
          ], [
            3.5, 0.811914893617021, {
              "cluster2": 3.5,
              "iso3": "ETH",
              "type": "DEVELOPING",
              "name": "Ethiopia",
              "ITUS": 0.811914893617021
            }
          ], [
            4.33333333333333, 9, {
              "cluster2": 4.33333333333333,
              "iso3": "GHA",
              "type": "DEVELOPING",
              "name": "Ghana",
              "ITUS": 9
            }
          ], [
            0.5, 16.9, {
              "cluster2": 0.5,
              "iso3": "HTI",
              "type": "DEVELOPING",
              "name": "Haiti",
              "ITUS": 16.9
            }
          ], [
            4.83333333333333, 2.9, {
              "cluster2": 4.83333333333333,
              "iso3": "IND",
              "type": "DEVELOPING",
              "name": "India",
              "ITUS": 2.9
            }
          ], [
            4.5, 2.3, {
              "cluster2": 4.5,
              "iso3": "IDN",
              "type": "DEVELOPING",
              "name": "Indonesia",
              "ITUS": 2.3
            }
          ], [
            4.75, 4.9, {
              "cluster2": 4.75,
              "iso3": "JAM",
              "type": "EMERGING",
              "name": "Jamaica",
              "ITUS": 4.9
            }
          ], [
            4, 2.3, {
              "cluster2": 4,
              "iso3": "JOR",
              "type": "EMERGING",
              "name": "Jordan",
              "ITUS": 2.3
            }
          ], [
            5.5, 1, {
              "cluster2": 5.5,
              "iso3": "KAZ",
              "type": "EMERGING",
              "name": "Kazakhstan",
              "ITUS": 1
            }
          ], [
            5.33333333333333, 8.2, {
              "cluster2": 5.33333333333333,
              "iso3": "KEN",
              "type": "DEVELOPING",
              "name": "Kenya",
              "ITUS": 8.2
            }
          ], [
            0.75, 45.1, {
              "cluster2": 0.75,
              "iso3": "MWI",
              "type": "DEVELOPING",
              "name": "Malawi",
              "ITUS": 45.1
            }
          ], [
            7.5, 0.0178846153846154, {
              "cluster2": 7.5,
              "iso3": "MYS",
              "type": "EMERGING",
              "name": "Malaysia",
              "ITUS": 0.0178846153846154
            }
          ], [
            3.5, 19.6, {
              "cluster2": 3.5,
              "iso3": "MLI",
              "type": "DEVELOPING",
              "name": "Mali",
              "ITUS": 19.6
            }
          ], [
            6, 1.8, {
              "cluster2": 6,
              "iso3": "MUS",
              "type": "EMERGING",
              "name": "Mauritius",
              "ITUS": 1.8
            }
          ], [
            5.5, 2.5, {
              "cluster2": 5.5,
              "iso3": "MEX",
              "type": "EMERGING",
              "name": "Mexico",
              "ITUS": 2.5
            }
          ], [
            4.66666666666667, 20, {
              "cluster2": 4.66666666666667,
              "iso3": "MAR",
              "type": "DEVELOPING",
              "name": "Morocco",
              "ITUS": 20
            }
          ], [
            4.75, 65.9, {
              "cluster2": 4.75,
              "iso3": "MOZ",
              "type": "DEVELOPING",
              "name": "Mozambique",
              "ITUS": 65.9
            }
          ], [
            2.75, 8.8, {
              "cluster2": 2.75,
              "iso3": "NAM",
              "type": "EMERGING",
              "name": "Namibia",
              "ITUS": 8.8
            }
          ], [
            4, 0.420821917808219, {
              "cluster2": 4,
              "iso3": "NPL",
              "type": "DEVELOPING",
              "name": "Nepal",
              "ITUS": 0.420821917808219
            }
          ], [
            6, 13, {
              "cluster2": 6,
              "iso3": "NGA",
              "type": "DEVELOPING",
              "name": "Nigeria",
              "ITUS": 13
            }
          ], [
            3.66666666666667, 3.1, {
              "cluster2": 3.66666666666667,
              "iso3": "PAK",
              "type": "DEVELOPING",
              "name": "Pakistan",
              "ITUS": 3.1
            }
          ], [
            7.5, 3.2, {
              "cluster2": 7.5,
              "iso3": "PER",
              "type": "EMERGING",
              "name": "Peru",
              "ITUS": 3.2
            }
          ], [
            4.5, 6.3, {
              "cluster2": 4.5,
              "iso3": "PHL",
              "type": "DEVELOPING",
              "name": "Philippines",
              "ITUS": 6.3
            }
          ], [
            7.5, 17.5, {
              "cluster2": 7.5,
              "iso3": "RWA",
              "type": "DEVELOPING",
              "name": "Rwanda",
              "ITUS": 17.5
            }
          ], [
            2.33333333333333, 35.7, {
              "cluster2": 2.33333333333333,
              "iso3": "SEN",
              "type": "DEVELOPING",
              "name": "Senegal",
              "ITUS": 35.7
            }
          ], [
            3.83333333333333, 109.1, {
              "cluster2": 3.83333333333333,
              "iso3": "SLE",
              "type": "DEVELOPING",
              "name": "Sierra Leone",
              "ITUS": 109.1
            }
          ], [
            4.75, 3.8, {
              "cluster2": 4.75,
              "iso3": "ZAF",
              "type": "EMERGING",
              "name": "South Africa",
              "ITUS": 3.8
            }
          ], [
            4.83333333333333, 0.0263687150837989, {
              "cluster2": 4.83333333333333,
              "iso3": "THA",
              "type": "EMERGING",
              "name": "Thailand",
              "ITUS": 0.0263687150837989
            }
          ], [
            3.83333333333333, 1, {
              "cluster2": 3.83333333333333,
              "iso3": "TUN",
              "type": "EMERGING",
              "name": "Tunisia",
              "ITUS": 1
            }
          ], [
            6.75, 2, {
              "cluster2": 6.75,
              "iso3": "TUR",
              "type": "EMERGING",
              "name": "Turkey",
              "ITUS": 2
            }
          ], [
            6.33333333333333, 23.3, {
              "cluster2": 6.33333333333333,
              "iso3": "UGA",
              "type": "DEVELOPING",
              "name": "Uganda",
              "ITUS": 23.3
            }
          ], [
            4.5, 11.3, {
              "cluster2": 4.5,
              "iso3": "TZA",
              "type": "DEVELOPING",
              "name": "United Republic Of Tanzania",
              "ITUS": 11.3
            }
          ], [
            4.16666666666667, 1.4, {
              "cluster2": 4.16666666666667,
              "iso3": "VEN",
              "type": "EMERGING",
              "name": "Venezuela (Bolivarian Republic Of)",
              "ITUS": 1.4
            }
          ], [
            4.33333333333333, 2, {
              "cluster2": 4.33333333333333,
              "iso3": "VNM",
              "type": "DEVELOPING",
              "name": "Viet Nam",
              "ITUS": 2
            }
          ], [
            1.5, 26.2, {
              "cluster2": 1.5,
              "iso3": "YEM",
              "type": "DEVELOPING",
              "name": "Yemen",
              "ITUS": 26.2
            }
          ], [
            3.75, 22.3, {
              "cluster2": 3.75,
              "iso3": "ZMB",
              "type": "DEVELOPING",
              "name": "Zambia",
              "ITUS": 22.3
            }
          ], [
            2.25, 101.3, {
              "cluster2": 2.25,
              "iso3": "ZWE",
              "type": "DEVELOPING",
              "name": "Zimbabwe",
              "ITUS": 101.3
            }
          ]
        ]
      }
    ],
    events: {
      "onmouseover": function(info) {
        var ITUS, cluster2, iso, name, text;
        iso = info["data-iso3"];
        name = info["data-name"];
        cluster2 = parseFloat(info["data-cluster2"]).toFixed(2);
        ITUS = parseFloat(info["data-ITUS"]).toFixed(2);
        text = "<div class='chart-tooltip'><img class='flag' src='" + (getPath()) + "/images/flags/" + iso + ".png' />";
        text += "<span class='country'>" + name + "</span>";
        text += "<span class='text'>Broadband strategy: </span><span class='value'>" + cluster2 + "</span>";
        text += "<span class='text'>Broadband price: </span><span class='value'>" + ITUS + "</span></div>";
        return wesCountry.charts.showTooltip(text, info.event);
      }
    }
  };

  serie3 = {
    container: "#itus-ieaa-chart",
    chartType: "scatter",
    showFitLine: {
      show: true,
      colour: "#31799F",
      stroke: 3
    },
    legend: {
      show: false
    },
    margins: [5, (isSmall() ? 5 : 1), 10, (isSmall() ? 5 : 1)],
    xAxis: {
      title: "Rate of electrification",
      margin: 10,
      tickNumber: 11,
      "font-size": "10pt"
    },
    yAxis: {
      title: "Price of mobile broadband, prepaid hand-set based (500MB)",
      "font-size": "8pt",
      pow: 10,
      margin: isSmall() ? 20 : 10
    },
    sizeByValueMinRadius: isSmall() ? 2 : 0.5,
    title: "Figure 5. Electrification Rates and Broadband Prices",
    "foot": "Sources: ITU, International Energy Agency",
    getElementColour: function(options, element, index, subindex) {
      var info;
      info = element.values[subindex] ? element.values[subindex][2] : null;
      if (info && info.type === "DEVELOPING") {
        return "#35B4B0";
      } else {
        return "#EC962E";
      }
    },
    series: [
      {
        name: "First",
        values: [
          [
            97.2, 2.7, {
              "IEAA": 97.2,
              "iso3": "ARG",
              "type": "EMERGING",
              "name": "Argentina",
              "ITUS": 2.7
            }
          ], [
            59.6, 16.8, {
              "IEAA": 59.6,
              "iso3": "BGD",
              "type": "DEVELOPING",
              "name": "Bangladesh",
              "ITUS": 16.8
            }
          ], [
            45.7, 9, {
              "IEAA": 45.7,
              "iso3": "BWA",
              "type": "EMERGING",
              "name": "Botswana",
              "ITUS": 9
            }
          ], [
            99.3, 4, {
              "IEAA": 99.3,
              "iso3": "BRA",
              "type": "EMERGING",
              "name": "Brazil",
              "ITUS": 4
            }
          ], [
            99.8, 3.8, {
              "IEAA": 99.8,
              "iso3": "CHN",
              "type": "EMERGING",
              "name": "China",
              "ITUS": 3.8
            }
          ], [
            97.4, 5.8, {
              "IEAA": 97.4,
              "iso3": "COL",
              "type": "EMERGING",
              "name": "Colombia",
              "ITUS": 5.8
            }
          ], [
            99.1, 2.8, {
              "IEAA": 99.1,
              "iso3": "CRI",
              "type": "EMERGING",
              "name": "Costa Rica",
              "ITUS": 2.8
            }
          ], [
            96.1, 26.1, {
              "IEAA": 96.1,
              "iso3": "DOM",
              "type": "EMERGING",
              "name": "Dominican Republic",
              "ITUS": 26.1
            }
          ], [
            95.5, 6.3, {
              "IEAA": 95.5,
              "iso3": "ECU",
              "type": "EMERGING",
              "name": "Ecuador",
              "ITUS": 6.3
            }
          ], [
            99.6, 3.9, {
              "IEAA": 99.6,
              "iso3": "EGY",
              "type": "DEVELOPING",
              "name": "Egypt",
              "ITUS": 3.9
            }
          ], [
            23.3, 0.811914893617021, {
              "IEAA": 23.3,
              "iso3": "ETH",
              "type": "DEVELOPING",
              "name": "Ethiopia",
              "ITUS": 0.811914893617021
            }
          ], [
            72, 9, {
              "IEAA": 72,
              "iso3": "GHA",
              "type": "DEVELOPING",
              "name": "Ghana",
              "ITUS": 9
            }
          ], [
            27.9, 16.9, {
              "IEAA": 27.9,
              "iso3": "HTI",
              "type": "DEVELOPING",
              "name": "Haiti",
              "ITUS": 16.9
            }
          ], [
            75.3, 2.9, {
              "IEAA": 75.3,
              "iso3": "IND",
              "type": "DEVELOPING",
              "name": "India",
              "ITUS": 2.9
            }
          ], [
            72.9, 2.3, {
              "IEAA": 72.9,
              "iso3": "IDN",
              "type": "DEVELOPING",
              "name": "Indonesia",
              "ITUS": 2.3
            }
          ], [
            92.8, 4.9, {
              "IEAA": 92.8,
              "iso3": "JAM",
              "type": "EMERGING",
              "name": "Jamaica",
              "ITUS": 4.9
            }
          ], [
            99.4, 2.3, {
              "IEAA": 99.4,
              "iso3": "JOR",
              "type": "EMERGING",
              "name": "Jordan",
              "ITUS": 2.3
            }
          ], [
            19.2, 8.2, {
              "IEAA": 19.2,
              "iso3": "KEN",
              "type": "DEVELOPING",
              "name": "Kenya",
              "ITUS": 8.2
            }
          ], [
            7, 45.1, {
              "IEAA": 7,
              "iso3": "MWI",
              "type": "DEVELOPING",
              "name": "Malawi",
              "ITUS": 45.1
            }
          ], [
            99.5, 0.0178846153846154, {
              "IEAA": 99.5,
              "iso3": "MYS",
              "type": "EMERGING",
              "name": "Malaysia",
              "ITUS": 0.0178846153846154
            }
          ], [
            99.4, 1.8, {
              "IEAA": 99.4,
              "iso3": "MUS",
              "type": "EMERGING",
              "name": "Mauritius",
              "ITUS": 1.8
            }
          ], [
            98.9, 20, {
              "IEAA": 98.9,
              "iso3": "MAR",
              "type": "DEVELOPING",
              "name": "Morocco",
              "ITUS": 20
            }
          ], [
            20.2, 65.9, {
              "IEAA": 20.2,
              "iso3": "MOZ",
              "type": "DEVELOPING",
              "name": "Mozambique",
              "ITUS": 65.9
            }
          ], [
            60, 8.8, {
              "IEAA": 60,
              "iso3": "NAM",
              "type": "EMERGING",
              "name": "Namibia",
              "ITUS": 8.8
            }
          ], [
            76.3, 0.420821917808219, {
              "IEAA": 76.3,
              "iso3": "NPL",
              "type": "DEVELOPING",
              "name": "Nepal",
              "ITUS": 0.420821917808219
            }
          ], [
            48, 13, {
              "IEAA": 48,
              "iso3": "NGA",
              "type": "DEVELOPING",
              "name": "Nigeria",
              "ITUS": 13
            }
          ], [
            68.6, 3.1, {
              "IEAA": 68.6,
              "iso3": "PAK",
              "type": "DEVELOPING",
              "name": "Pakistan",
              "ITUS": 3.1
            }
          ], [
            89.7, 3.2, {
              "IEAA": 89.7,
              "iso3": "PER",
              "type": "EMERGING",
              "name": "Peru",
              "ITUS": 3.2
            }
          ], [
            70.2, 6.3, {
              "IEAA": 70.2,
              "iso3": "PHL",
              "type": "DEVELOPING",
              "name": "Philippines",
              "ITUS": 6.3
            }
          ], [
            56.5, 35.7, {
              "IEAA": 56.5,
              "iso3": "SEN",
              "type": "DEVELOPING",
              "name": "Senegal",
              "ITUS": 35.7
            }
          ], [
            84.7, 3.8, {
              "IEAA": 84.7,
              "iso3": "ZAF",
              "type": "EMERGING",
              "name": "South Africa",
              "ITUS": 3.8
            }
          ], [
            99, 0.0263687150837989, {
              "IEAA": 99,
              "iso3": "THA",
              "type": "EMERGING",
              "name": "Thailand",
              "ITUS": 0.0263687150837989
            }
          ], [
            99.5, 1, {
              "IEAA": 99.5,
              "iso3": "TUN",
              "type": "EMERGING",
              "name": "Tunisia",
              "ITUS": 1
            }
          ], [
            14.6, 23.3, {
              "IEAA": 14.6,
              "iso3": "UGA",
              "type": "DEVELOPING",
              "name": "Uganda",
              "ITUS": 23.3
            }
          ], [
            15, 11.3, {
              "IEAA": 15,
              "iso3": "TZA",
              "type": "DEVELOPING",
              "name": "United Republic Of Tanzania",
              "ITUS": 11.3
            }
          ], [
            99.6, 1.4, {
              "IEAA": 99.6,
              "iso3": "VEN",
              "type": "EMERGING",
              "name": "Venezuela (Bolivarian Republic Of)",
              "ITUS": 1.4
            }
          ], [
            96.1, 2, {
              "IEAA": 96.1,
              "iso3": "VNM",
              "type": "DEVELOPING",
              "name": "Viet Nam",
              "ITUS": 2
            }
          ], [
            39.9, 26.2, {
              "IEAA": 39.9,
              "iso3": "YEM",
              "type": "DEVELOPING",
              "name": "Yemen",
              "ITUS": 26.2
            }
          ], [
            22, 22.3, {
              "IEAA": 22,
              "iso3": "ZMB",
              "type": "DEVELOPING",
              "name": "Zambia",
              "ITUS": 22.3
            }
          ], [
            37.2, 101.3, {
              "IEAA": 37.2,
              "iso3": "ZWE",
              "type": "DEVELOPING",
              "name": "Zimbabwe",
              "ITUS": 101.3
            }
          ]
        ]
      }
    ],
    events: {
      "onmouseover": function(info) {
        var IEAA, ITUS, iso, name, text;
        iso = info["data-iso3"];
        name = info["data-name"];
        IEAA = parseFloat(info["data-IEAA"]).toFixed(2);
        ITUS = parseFloat(info["data-ITUS"]).toFixed(2);
        text = "<div class='chart-tooltip'><img class='flag' src='" + (getPath()) + "/images/flags/" + iso + ".png' />";
        text += "<span class='country'>" + name + "</span>";
        text += "<span class='text'>Electrification: </span><span class='value'>" + IEAA + "</span>";
        text += "<span class='text'>Broadband price: </span><span class='value'>" + ITUS + "</span></div>";
        return wesCountry.charts.showTooltip(text, info.event);
      }
    }
  };

  internetDisparity = {
    chartType: "bar",
    container: "#internet-disparity-chart",
    "title": "Figure 1. Internet Users: Urban vs Rural",
    "foot": "Source: Research ICT Africa Household Survey Data, 2012",
    serieColours: ["#DE645C", "#619EDE"],
    groupMargin: 20,
    xAxis: {
      values: ["Uganda", "Tanzania", "South Africa", "Rwanda", "Namibia", "Mozambique", "Ghana", "Ethiopia", "Cameroon", "Botswana"],
      title: "",
      "font-size": "8pt",
      rotation: isSmall() ? -90 : 0,
      margin: isSmall() ? 15 : 10
    },
    margins: [5, 10, 5, isSmall() ? 10 : 3],
    yAxis: {
      title: "% of Internet users",
      margin: isSmall() ? 20 : 10
    },
    nameUnderItem: {
      show: true
    },
    valueOnItem: {
      show: false
    },
    legend: {
      itemSize: isSmall() ? 2 : 0.5,
      margin: isSmall() ? 4 : 2
    },
    series: [
      {
        name: "Rural",
        values: [6.5, 1.7, 21.8, 14.7, 5.7, 3.2, 9.7, 1.3, 2.5, 19.3]
      }, {
        name: "Urban",
        values: [17.3, 8.5, 41.7, 3.5, 37.6, 26.1, 15.9, 9.2, 22.4, 35.1]
      }
    ],
    info: [
      {
        name: "Uganda",
        code: "UGA"
      }, {
        name: "Tanzania",
        code: "TZA"
      }, {
        name: "South Africa",
        code: "ZAF"
      }, {
        name: "Rwanda",
        code: "RWA"
      }, {
        name: "Namibia",
        code: "NAM"
      }, {
        name: "Mozambique",
        code: "MOZ"
      }, {
        name: "Ghana",
        code: "GHA"
      }, {
        name: "Ethiopia",
        code: "ETH"
      }, {
        name: "Cameroon",
        code: "CAM"
      }, {
        name: "Botswana",
        code: "BWA"
      }
    ],
    events: {
      "onmouseover": function(info) {
        var data, iso, name, pos, text;
        pos = info["serie_pos"];
        data = internetDisparity.info[pos];
        iso = data.code;
        name = data.name;
        text = "<div class='chart-tooltip'><img class='flag' src='" + (getPath()) + "/images/flags/" + iso + ".png' />";
        text += "<span class='country'>" + name + "</span>";
        text += "<span class='text'>" + info.serie + "</span><span class='value'>" + info.value + "</span></div>";
        return wesCountry.charts.showTooltip(text, info.event);
      }
    }
  };

  getPath = function() {
    return document.getElementById("path").value;
  };

  window.onresize = function() {
    return renderCharts();
  };

  renderCharts = function() {
    var container, containers, _i, _len;
    containers = document.querySelectorAll("div.charts");
    for (_i = 0, _len = containers.length; _i < _len; _i++) {
      container = containers[_i];
      container.innerHTML = "";
    }
    wesCountry.charts.chart(internetDisparity);
    wesCountry.charts.chart(serie1);
    wesCountry.charts.chart(serie2);
    return wesCountry.charts.chart(serie3);
  };

  renderCharts();

}).call(this);
