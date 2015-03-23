(function() {
  var bodyUnWrap, bodyWrap, createOption, getCountryColor, getCountryExtraInfo, getExtraInfoValue, global, hideIndicatorDetail, hideLoading, loadAreas, loadAreasInfo, loadCountryComparison, loadCountryDetail, loadEventHandlers, loadIndexIndicator, loadIndicators, loadOneIndicator, onBarOver, onCountryOver, renderBars, renderCharts, renderData, renderMap, selectBar, selectCountry, setIndicatorOptions, setPageHeight, setPageStateful, showIndicatorDetail, showLoading, showStatistics, unselectBar, unselectCountry, updateSocialLinks;

  global = this;

  if (global.mapLoaded) {
    return;
  }

  global.mapLoaded = true;

  global.dataLoaded = false;

  global.countryRequested = null;

  global.comparisonRequested = null;

  global.countryDetailOpened = false;

  global.comparisonOpened = false;

  global.wrapperCreated = false;

  global.cache = {
    "indicators": {}
  };

  global.isMobile = global.functions.isMobile();

  setPageStateful = function() {
    return wesCountry.stateful.start({
      init: function(parameters, selectors) {
        var url;
        url = wesCountry.stateful.getFullURL();
        updateSocialLinks(url);
        if (settings.debug) {
          console.log("init " + url);
        }
        return renderCharts();
      },
      urlChanged: function(parameters, selectors) {
        var url;
        url = wesCountry.stateful.getFullURL();
        if (settings.debug) {
          console.log(url);
        }
        return updateSocialLinks(url);
      },
      elements: [
        {
          name: "indicator",
          selector: "#indicator-selector",
          onChange: function(index, value, parameters, selectors, initial) {
            var option, _ref, _ref1;
            if (settings.debug) {
              console.log("indicator:onChange index:" + index + " value:" + value);
            }
            option = (_ref = selectors["#indicator-selector"]) != null ? (_ref1 = _ref.options) != null ? _ref1[index] : void 0 : void 0;
            global.selections.indicator = value;
            global.selections.indicatorOption = option;
            return global.ref.countryIndicatorSelector.value = value;
          }
        }, {
          name: "country",
          selector: "#country-selector",
          removeIfEmpty: true,
          onChange: function(index, value, parameters, selectors, initial) {
            var option, _ref, _ref1;
            if (settings.debug) {
              console.log("country:onChange index:" + index + " value:" + value);
            }
            option = (_ref = selectors["#country-selector"]) != null ? (_ref1 = _ref.options) != null ? _ref1[index] : void 0 : void 0;
            global.selections.country = value;
            global.selections.countryOption = option;
            if (index > 0) {
              if (global.dataLoaded && initial === true) {
                return loadCountryDetail(value);
              } else {
                return global.countryRequested = value;
              }
            }
          }
        }, {
          name: "compare",
          selector: "#country-compare-selector",
          removeIfEmpty: true,
          onChange: function(index, value, parameters, selectors, initial) {
            var option, _ref, _ref1;
            if (settings.debug) {
              console.log("compare:onChange index:" + index + " value:" + value);
            }
            option = (_ref = selectors["#country-compare-selector"]) != null ? (_ref1 = _ref.options) != null ? _ref1[index] : void 0 : void 0;
            global.selections.compare = value;
            global.selections.compareOption = option;
            if (index > 0) {
              return global.comparisonRequested = value;
            }
          }
        }
      ]
    });
  };

  updateSocialLinks = function(url) {
    var href, link, links, _i, _len, _results;
    url = encodeURIComponent(url);
    links = document.querySelectorAll(".social-link");
    _results = [];
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      link = links[_i];
      href = link.getAttribute("data-href");
      href = href.replace("{0}", url);
      _results.push(link.setAttribute("href", href));
    }
    return _results;
  };

  setPageHeight = function() {
    var charts, headerHeight, height, _ref, _ref1, _ref2, _ref3;
    if (!global.functions.isMobile()) {
      charts = document.getElementById("charts");
      height = global.functions.getPageHeight();
      headerHeight = (_ref = document.getElementById("Header")) != null ? _ref.clientHeight : void 0;
      if (headerHeight) {
        height -= headerHeight;
      }
      headerHeight = (_ref1 = document.getElementById("TopNav")) != null ? _ref1.clientHeight : void 0;
      if (headerHeight) {
        height -= headerHeight;
      }
      charts.style.height = height + "px";
      if ((_ref2 = document.getElementById("map")) != null) {
        _ref2.style.height = Math.round(height * 1) + "px";
      }
      if ((_ref3 = document.getElementById("bars")) != null) {
        _ref3.style.height = Math.round(height * 0.2) + "px";
      }
    }
    if (global.dataLoaded) {
      renderData();
      return showStatistics();
    }
  };

  global.openCountry = function(code, name) {
    if (code) {
      selectCountry(code);
      selectBar(code);
      global.functions.selectCountryInSelector(code);
      this.hideRequestBox();
      global.sref.search.value = name;
      global.previousSearch = name.toUpperCase();
      return loadCountryDetail(code);
    }
  };

  global.functions.selectCountryInSelector = function(area) {
    global.ref.country_selector.value = area;
    global.ref.country_selector.refresh();
    return loadCountryDetail(area);
  };

  unselectCountry = function() {
    var className, countries, country, _i, _len, _results;
    countries = global.ref.map.querySelectorAll(".country-selected");
    _results = [];
    for (_i = 0, _len = countries.length; _i < _len; _i++) {
      country = countries[_i];
      className = country.getAttribute("class");
      _results.push(country.setAttributeNS(null, "class", className.replace("country-selected", "")));
    }
    return _results;
  };

  selectCountry = function(area) {
    var className, country;
    unselectCountry();
    if (!area) {
      return;
    }
    country = global.ref.map.querySelector("#" + area);
    if (!country) {
      return;
    }
    className = country.getAttribute("class");
    return country.setAttributeNS(null, "class", className + " country-selected");
  };

  unselectBar = function(area) {
    var locator, locators, _i, _len, _results;
    locators = global.ref.bars.querySelectorAll(".bar-locator");
    _results = [];
    for (_i = 0, _len = locators.length; _i < _len; _i++) {
      locator = locators[_i];
      _results.push(locator.parentNode.removeChild(locator));
    }
    return _results;
  };

  selectBar = function(area) {
    var bar, circle, halfWidth, style, width, x, y, _ref;
    unselectBar();
    bar = global.ref.bars.querySelector("[data-area=" + area + "]");
    if (!bar) {
      return;
    }
    x = parseInt(bar.getAttribute("x"));
    y = parseInt(bar.getAttribute("y"));
    width = parseInt(bar.getAttribute("width"));
    halfWidth = Math.round(width / 3);
    style = bar.getAttribute("style");
    circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    circle.setAttributeNS(null, 'class', "bar-locator");
    circle.setAttributeNS(null, 'id', "bar-locator");
    circle.setAttributeNS(null, 'style', style);
    circle.setAttributeNS(null, 'r', halfWidth);
    circle.setAttributeNS(null, 'cx', x + width / 2);
    circle.setAttributeNS(null, 'cy', y - width / 1.5);
    return (_ref = bar.parentNode) != null ? _ref.appendChild(circle) : void 0;
  };

  onCountryOver = function(info, visor, options) {
    var area, name, val, value, _name;
    unselectCountry();
    area = info['data-area'];
    _name = info['data-area_name'];
    val = info['data-value'] ? parseFloat(info['data-value']).toFixed(2) : "-";
    if (visor && area) {
      visor.innerHTML = '';
      visor.className = 'visor visor-full';
      visor.appendChild(global.functions.getFlag(area));
      name = document.createElement('span');
      name.innerHTML = _name;
      name.className = 'name';
      visor.appendChild(name);
      value = document.createElement('span');
      value.innerHTML = val;
      value.className = 'value';
      visor.appendChild(value);
      area = info["data-area"];
      selectBar(area);
      return selectCountry(area);
    }
  };

  onBarOver = function(info) {
    var area, text;
    text = String.format("Series '{0}': ({1}, {2})", info.serie, info.pos, info.value);
    onCountryOver(info, document.getElementById("country-visor"), null);
    area = info["data-area"];
    selectCountry(area);
    return selectBar(area);
  };

  renderMap = function(areas, developingColours, emergingColours, minDeveloping, minEmerging) {
    var border, c, container, isVisible, is_chrome, map, width;
    is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    width = window.innerWidth;
    border = 1.5;
    if (is_chrome) {
      border = width < 1024 ? 4.5 : 3.5;
    }
    container = "#map";
    c = document.querySelector(container);
    if (!c) {
      return;
    }
    if (c != null) {
      c.innerHTML = "";
    }
    isVisible = c.offsetWidth > 0 || c.offsetHeight > 0;
    if (!isVisible) {
      return;
    }
    return map = wesCountry.maps.createMap({
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
      getElementColour: function(options, country, value, rangeColours) {
        value = Math.round(value);
        if (country.area_type && country.area_type.toUpperCase() === "DEVELOPING") {
          return developingColours[Math.abs(value - minDeveloping)];
        }
        return emergingColours[Math.abs(value - minEmerging)];
      },
      onCountryClick: function(info) {
        return global.functions.selectCountryInSelector(info.iso3);
      }
    });
  };

  renderBars = function(areas, developingColours, emergingColours, minDeveloping, minEmerging) {
    var area, c, container, isVisible, max, maxValue, _i, _len, _ref, _ref1;
    max = (_ref = global.data) != null ? (_ref1 = _ref.statistics) != null ? _ref1.max : void 0 : void 0;
    for (_i = 0, _len = areas.length; _i < _len; _i++) {
      area = areas[_i];
      area.values = [area.value];
    }
    container = "#bars";
    c = document.querySelector(container);
    if (!c) {
      return;
    }
    if (c != null) {
      c.innerHTML = "";
    }
    isVisible = c.offsetWidth > 0 || c.offsetHeight > 0;
    if (!isVisible) {
      return;
    }
    maxValue = global.functions.getIndicatorTop(global.selections.indicator);
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
      margins: [15, 0, 0, max && max > 999 ? 5 : 1],
      valueOnItem: {
        rotation: -20,
        "font-colour": "#aaa",
        "font-size": "10px",
        margin: 6
      },
      groupMargin: 0.5,
      barMargin: 5,
      backColor: "none",
      getElementColour: function(options, element, index) {
        var value;
        value = Math.round(element.value);
        if (element.area_type && element.area_type.toUpperCase() === "DEVELOPING") {
          return developingColours[Math.abs(value - minDeveloping)];
        }
        return emergingColours[Math.abs(value - minEmerging)];
      },
      getName: function(element) {
        if (element.short_name) {
          return element.short_name;
        } else {
          return element.name;
        }
      },
      events: {
        "onmouseover": onBarOver,
        "onclick": function(info) {
          return global.functions.selectCountryInSelector(info["data-area"]);
        }
      }
    });
    global.ref.switch1_by_rank.onchange = function(event) {
      if (!this.checked) {
        return;
      }
      return global.charts.ranking.sort(function(a, b) {
        return b.value - a.value;
      });
    };
    return global.ref.switch1_by_name.onchange = function(event) {
      if (!this.checked) {
        return;
      }
      return global.charts.ranking.sort(function(a, b) {
        a = a["short_name"].toLowerCase();
        b = b["short_name"].toLowerCase();
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    };
  };

  showLoading = function() {
    bodyWrap();
    document.body.appendChild(global.ref.loading);
    return global.ref.loading.style.display = "block";
  };

  hideLoading = function() {
    var _ref, _ref1, _ref2, _ref3;
    bodyUnWrap();
    if ((_ref = global.ref.loading) != null) {
      _ref.style.display = "none";
    }
    if ((_ref1 = global.ref.blank) != null) {
      _ref1.style.display = "none";
    }
    if ((_ref2 = global.ref.country_list) != null) {
      _ref2.style.display = "block";
    }
    return (_ref3 = global.ref.loading) != null ? _ref3.className = global.ref.loading.className.replace("initial", "") : void 0;
  };

  renderCharts = function() {
    var cached, host, indicator, label, option, provider_name, provider_url, scale, scaleLabels, url, year, _i, _len, _ref;
    option = global.selections.indicatorOption;
    if (option) {
      provider_name = option.getAttribute("data-provider_name");
      provider_url = option.getAttribute("data-provider_url");
      if ((_ref = global.ref.source) != null) {
        _ref.innerHTML = "<a href='" + provider_url + "' target='_blank'>" + provider_name + "</a>";
      }
      scaleLabels = document.querySelectorAll(".indicator-scale");
      scale = option.getAttribute("data-scale");
      if (scale) {
        for (_i = 0, _len = scaleLabels.length; _i < _len; _i++) {
          label = scaleLabels[_i];
          label.innerHTML = scale;
        }
      }
    }
    cached = global.cache.indicators[global.selections.indicator];
    if (cached) {
      getObservationsCallback(cached);
      return;
    }
    showLoading();
    indicator = global.selections.indicator;
    year = global.selections.year;
    host = this.settings.server.url;
    url = "" + host + "/visualisations/" + indicator + "/ALL/" + year + "?callback=getObservationsCallback";
    return this.processJSONP(url);
  };

  createOption = function(code, data) {
    var attribute, option;
    option = document.createElement("option");
    option.value = code;
    for (attribute in data) {
      option.setAttribute("data-" + attribute, data[attribute]);
    }
    return option;
  };

  setIndicatorOptions = function(select, element, level, subindex) {
    var child, code, count, countryOption, data, description, indicator, is_percentage, max, name, option, provider_name, provider_url, republish, scale, space, td, tr, type, weight, _i, _len, _ref, _ref1, _results;
    republish = element.republish ? element.republish : false;
    type = element.type ? element.type : "Primary";
    description = element.description ? element.description : "";
    provider_name = element.provider_name ? element.provider_name : "";
    provider_url = element.provider_url ? element.provider_url : "";
    weight = element.weight ? element.weight : "";
    if (!subindex) {
      subindex = element.indicator;
    }
    indicator = element.indicator ? element.indicator.replace(/_/g, " ") : "";
    code = element.indicator ? element.indicator : "";
    name = element.name ? element.name : "";
    is_percentage = element.is_percentage ? element.is_percentage : false;
    scale = element.scale ? element.scale : "";
    if (level === 1) {
      subindex = code.toLowerCase();
    }
    if (!subindex) {
      subindex = "";
    }
    data = {
      "republish": republish,
      "type": type,
      "name": name,
      "subindex": subindex,
      "description": description,
      "provider_name": provider_name,
      "provider_url": provider_url,
      "is_percentage": is_percentage,
      "scale": scale
    };
    option = createOption(code, data);
    countryOption = createOption(code, data);
    space = Array(level * 3).join('&nbsp');
    option.innerHTML = countryOption.innerHTML = space + name;
    select.appendChild(option);
    global.ref.countryIndicatorSelector.appendChild(countryOption);
    tr = document.createElement("tr");
    tr.className = "" + type + " " + subindex;
    tr.setAttribute("data-indicator", code);
    if ((_ref = global.ref.indicator_table) != null) {
      _ref.appendChild(tr);
    }
    tr.onclick = function(event) {
      var value;
      value = this.getAttribute("data-indicator");
      global.ref.indicatorSelector.value = value;
      global.ref.indicatorSelector.refresh();
      hideIndicatorDetail();
      return renderCharts();
    };
    if (level >= 2) {
      td = document.createElement("td");
      td.className = "code";
      td.innerHTML = code;
      tr.appendChild(td);
    }
    td = document.createElement("td");
    td.className = "description";
    td.innerHTML = name;
    tr.appendChild(td);
    if (level < 2) {
      td.setAttribute("colspan", 2);
    }
    count = 0;
    max = element.children.length - 1;
    _ref1 = element.children;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      setIndicatorOptions(select, child, level + 1, subindex);
      _results.push(count++);
    }
    return _results;
  };

  renderData = function() {
    var areas, country;
    areas = global.data.areas;
    global.minMaxDeveloping = global.functions.getMinMaxValue(areas, "DEVELOPING");
    global.colours.developingColours = wesCountry.colourRange([global.colours.developing_light, global.colours.developing], global.minMaxDeveloping.length);
    global.minMaxEmerging = global.functions.getMinMaxValue(areas, "EMERGING");
    global.colours.emergingColours = wesCountry.colourRange([global.colours.emerging_light, global.colours.emerging], global.minMaxEmerging.length);
    areas.sort(function(a, b) {
      return b.value - a.value;
    });
    renderMap(areas, global.colours.developingColours, global.colours.emergingColours, global.minMaxDeveloping.min, global.minMaxEmerging.min);
    renderBars(areas, global.colours.developingColours, global.colours.emergingColours, global.minMaxDeveloping.min, global.minMaxEmerging.min);
    setTimeout(function() {
      return global.listFunctions.renderTable(areas, global.colours.developingColours, global.colours.emergingColours, global.minMaxDeveloping.min, global.minMaxEmerging.min);
    }, 100);
    if (global.countryRequested || global.countryDetailOpened) {
      country = global.countryRequested ? global.countryRequested : global.selections.country;
      global.countryRequested = null;
      loadCountryDetail(country);
      if (global.comparisonRequested || global.comparisonOpened) {
        loadCountryComparison(global.selections.compare);
        return global.comparisonRequested = null;
      }
    }
  };

  this.getObservationsCallback = function(data) {
    var area, areaCode, areas, statistic, statistics, _i, _j, _len, _len1;
    hideLoading();
    global.cache.indicators[global.selections.indicator] = data;
    if (global.selections.indicator === "WI_B" || global.selections.indicator === "WI_C") {
      if (!data.processed) {
        data.processed = true;
        areas = data.data.observations;
        for (_i = 0, _len = areas.length; _i < _len; _i++) {
          area = areas[_i];
          area.value = area.value * 100;
        }
        statistics = data.data.statistics_all_areas;
        for (statistic in statistics) {
          statistics[statistic] = statistics[statistic] * 100;
        }
      }
    }
    areas = [];
    if (data.success) {
      areas = data.data.observations;
      statistics = data.data.statistics_all_areas;
    }
    global.data.areas = areas;
    global.data.statistics = statistics;
    global.dataLoaded = true;
    global.data.areaDict = {};
    for (_j = 0, _len1 = areas.length; _j < _len1; _j++) {
      area = areas[_j];
      areaCode = area.area;
      global.data.areaDict[areaCode] = area;
    }
    renderData();
    return showStatistics();
  };

  showStatistics = function() {
    var averageDeveloping, averageEmerging, statistics;
    statistics = global.data.statistics;
    averageEmerging = parseFloat(statistics.average_emerging).toFixed(2);
    averageDeveloping = parseFloat(statistics.average_developing).toFixed(2);
    global.functions.renderPieChart("#pies-emerging", averageEmerging, global.colours.emerging, true, global.selections.indicator);
    return global.functions.renderPieChart("#pies-developing", averageDeveloping, global.colours.developing, true, global.selections.indicator);
  };

  loadAreas = function(data) {
    var area, iso3, option, short_name, _i, _len, _ref, _results;
    if (!data.success) {
      return;
    }
    global.prepareSearchEntries(data.data);
    _ref = data.data;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      area = _ref[_i];
      if (!area.area) {
        continue;
      }
      iso3 = area.iso3;
      short_name = area.short_name;
      option = document.createElement("option");
      option.value = iso3;
      option.innerHTML = short_name;
      global.ref.country_selector.appendChild(option);
      option = document.createElement("option");
      option.value = iso3;
      option.innerHTML = short_name;
      _results.push(global.ref.country_compare_selector.appendChild(option));
    }
    return _results;
  };

  loadAreasInfo = function(data) {
    if (!data.success) {
      return;
    }
    return global.data.areaInfo = data.data;
  };

  loadIndexIndicator = function(data) {
    if (!data.success) {
      return;
    }
    return setIndicatorOptions(global.ref.indicatorSelector, data.data, 0, null);
  };

  loadOneIndicator = function(data, indicator) {
    var area, element, length, observation, observations, ranked, value, _i, _len, _ref, _results;
    global.cache.indicators[indicator] = data;
    observations = data != null ? (_ref = data.data) != null ? _ref.observations : void 0 : void 0;
    length = observations.length;
    _results = [];
    for (_i = 0, _len = observations.length; _i < _len; _i++) {
      observation = observations[_i];
      area = observation.area;
      value = observation.value.toFixed(2);
      ranked = observation.ranking;
      element = global.indexValues[area];
      if (!element) {
        element = global.indexValues[area] = {};
      }
      _results.push(element[indicator] = {
        value: value,
        ranked: ranked
      });
    }
    return _results;
  };

  loadIndicators = function(index, access, infrastructure) {
    if (index.success) {
      loadOneIndicator(index, "INDEX");
    }
    if (access.success) {
      loadOneIndicator(access, "ACCESS");
    }
    if (infrastructure.success) {
      return loadOneIndicator(infrastructure, "INFRASTRUCTURE");
    }
  };

  showIndicatorDetail = function() {
    var _ref;
    bodyWrap();
    return (_ref = global.ref.indicator_detail) != null ? _ref.style.display = "block" : void 0;
  };

  hideIndicatorDetail = function() {
    var _ref;
    bodyUnWrap();
    return (_ref = global.ref.indicator_detail) != null ? _ref.style.display = "none" : void 0;
  };

  bodyWrap = function() {
    if (global.wrapperCreated) {
      global.ref.body_wrapper.className = "body-wrapper body-modal";
      return;
    }
    global.ref.body_wrapper = document.createElement("div");
    global.ref.body_wrapper.id = "body-wrapper";
    global.ref.body_wrapper.className = "body-wrapper body-modal";
    while (document.body.firstChild) {
      global.ref.body_wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(global.ref.body_wrapper);
    document.body.appendChild(global.ref.country_detail);
    document.body.appendChild(global.ref.indicator_detail);
    return global.wrapperCreated = true;
  };

  bodyUnWrap = function() {
    var _ref, _ref1;
    if ((_ref = global.ref.country_detail) != null) {
      _ref.style.display = "none";
    }
    return (_ref1 = global.ref.body_wrapper) != null ? _ref1.className = "body-wrapper" : void 0;
  };

  getCountryColor = function(area_type, value) {
    var barColour, fullColour;
    if (area_type.toUpperCase() === "DEVELOPING") {
      barColour = global.colours.developingColours[Math.abs(value - global.minMaxDeveloping.min)];
      fullColour = global.colours.developing;
    } else {
      barColour = global.colours.emergingColours[Math.abs(value - global.minMaxEmerging.min)];
      fullColour = global.colours.emerging;
    }
    return {
      barColour: barColour,
      fullColour: fullColour
    };
  };

  getExtraInfoValue = function(code, name, container, decimals, prefix, sufix) {
    var countryInfo, info, provider_name, provider_url, value, year, _ref, _ref1, _ref2;
    info = (_ref = global.data.areaInfo) != null ? _ref[name] : void 0;
    countryInfo = info != null ? info.values[code] : void 0;
    if (countryInfo) {
      value = global.functions.formatMoney(countryInfo != null ? countryInfo.value : void 0, decimals, '.', ',');
      year = countryInfo != null ? countryInfo.year : void 0;
      provider_name = info != null ? (_ref1 = info.provider) != null ? _ref1.provider_name : void 0 : void 0;
      provider_url = info != null ? (_ref2 = info.provider) != null ? _ref2.provider_url : void 0 : void 0;
      value = "<abbr title='Source: " + provider_name + " - " + provider_url + " (" + year + ")'>" + prefix + value + sufix + "</abbr>";
    } else {
      value = "-";
    }
    return container != null ? container.innerHTML = value : void 0;
  };

  getCountryExtraInfo = function(code, population, gni, broadband, poverty) {
    getExtraInfoValue(code, "SP_POP_TOTL", population, 0, "", "");
    getExtraInfoValue(code, "NY_GNP_PCAP_PP_CD", gni, 2, "USD ", "");
    getExtraInfoValue(code, "mobile_broadband_percentage_GNI", broadband, 2, "", "%");
    return getExtraInfoValue(code, "SI_POV_2DAY", poverty, 2, "", "%");
  };

  loadCountryDetail = function(code) {
    var area_type, colour, continent, continentName, data, groupNumber, label, meanValue, name, ranking, ranking_type, value, _ref, _ref1, _ref2, _ref3;
    bodyWrap();
    global.ref.country_detail.style.display = "block";
    global.countryDetailOpened = true;
    data = global.data.areaDict[code];
    name = data.short_name;
    value = parseFloat(data.value);
    area_type = data.area_type ? (_ref = data.area_type) != null ? _ref.toUpperCase() : void 0 : "EMERGING";
    colour = area_type === "EMERGING" ? global.colours.emerging : global.colours.developing;
    ranking = data.ranking;
    ranking_type = data.ranking_type;
    continent = data.continent.toUpperCase();
    continentName = global.continents[continent];
    colour = getCountryColor(area_type, Math.round(value));
    getCountryExtraInfo(code, global.ref.population_label_this, global.ref.gni_label_this, global.ref.broadband_label_this, global.ref.poverty_label_this);
    if ((_ref1 = global.ref.country_flag) != null) {
      _ref1.src = (_ref2 = global.functions.getFlag(code)) != null ? _ref2.src : void 0;
    }
    global.ref.country_name.innerHTML = name;
    global.ref.country_continent.innerHTML = continentName;
    global.ref.country_indicator_pie.innerHTML = "";
    global.functions.renderValuePieChart(global.ref.country_indicator_pie, value, colour.barColour, global.selections.indicator);
    global.ref.country_indicator_bar.innerHTML = "";
    data.values = [value];
    global.ref.legend_this_country_circle.style.backgroundColor = colour.barColour;
    global.ref.legend_this_country_name.innerHTML = name;
    global.ref.legend_mean_name.innerHTML = "Mean " + (area_type.toLowerCase());
    global.ref.ranking_this_country_label.innerHTML = global.ref.ranking_this_country_label.innerHTML.replace("{0}", global.data.areas.length);
    if (area_type === "DEVELOPING") {
      groupNumber = global.minMaxDeveloping.count + " developing";
      meanValue = global.data.statistics.average_developing;
    } else {
      groupNumber = global.minMaxEmerging.count + " emerging";
      meanValue = global.data.statistics.average_emerging;
    }
    global.ref.ranking_mean_label.innerHTML = global.ref.ranking_mean_label.innerHTML.replace("{0}", groupNumber);
    global.ref.ranking_this_country_value.innerHTML = ranking;
    global.ref.ranking_this_country_value.style.color = colour.fullColour;
    global.ref.ranking_this_country_value.style.borderColor = colour.fullColour;
    global.ref.ranking_mean_value.innerHTML = ranking_type;
    wesCountry.charts.chart({
      chartType: "bar",
      container: "#country-indicator-bar",
      series: [
        data, {
          name: "Mean " + area_type.charAt(0).toUpperCase() + area_type.slice(1),
          value: meanValue,
          values: [meanValue],
          area_type: "mean"
        }
      ],
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
      },
      groupMargin: 20,
      barMargin: 0,
      maxBarWidth: 15,
      backColor: "none",
      getElementColour: function(options, element, index) {
        if (element.area_type === "mean") {
          return global.colours.mean;
        }
        value = Math.round(element.value);
        if (element.area_type && element.area_type.toUpperCase() === "DEVELOPING") {
          return global.colours.developingColours[Math.abs(value - global.minMaxDeveloping.min)];
        }
        return global.colours.emergingColours[Math.abs(value - global.minMaxEmerging.min)];
      },
      getName: function(element) {
        if (element.short_name) {
          return element.short_name;
        } else {
          return element.name;
        }
      }
    });
    global.ref.country_this_index.innerHTML = "";
    global.ref.country_this_infrastructure.innerHTML = "";
    global.ref.country_this_access.innerHTML = "";
    global.functions.renderTheIndexPieChart(global.ref.country_this_index, code, colour.barColour);
    global.functions.renderInfrastructurePieChart(global.ref.country_this_infrastructure, code, colour.barColour);
    global.functions.renderAccessPieChart(global.ref.country_this_access, code, colour.barColour);
    label = (_ref3 = global.ref.compare_to) != null ? _ref3.getAttribute("data-label") : void 0;
    return global.ref.compare_to.innerHTML = label != null ? label.replace("{0}", name) : void 0;
  };

  loadCountryComparison = function(code) {
    var area_type, colour, container, continent, continentName, data, max, name, ranking, ranking_type, thisCountryColour, thisCountryData, top, value, _ref, _ref1;
    if (!global.comparisonOpened) {
      global.ref.compare_section.style.display = "block";
      setTimeout(function() {
        var top;
        top = $('#compare-section-bottom').position().top;
        return $(window).scrollTop(top);
      }, 200);
      global.comparisonOpened = true;
    }
    thisCountryData = global.data.areaDict[global.selections.country];
    data = global.data.areaDict[code];
    name = data.short_name;
    value = parseFloat(data.value);
    area_type = data.area_type ? (_ref = data.area_type) != null ? _ref.toUpperCase() : void 0 : "EMERGING";
    colour = area_type === "EMERGING" ? global.colours.emerging : global.colours.developing;
    ranking = data.ranking;
    ranking_type = data.ranking_type;
    continent = data.continent.toUpperCase();
    continentName = global.continents[continent];
    colour = getCountryColor(area_type, Math.round(value));
    thisCountryColour = getCountryColor(thisCountryData.area_type, thisCountryData.value);
    getCountryExtraInfo(code, global.ref.population_label_other, global.ref.gni_label_other, global.ref.broadband_label_other, global.ref.poverty_label_other);
    global.ref.ranking_other_country_label.innerHTML = thisCountryData.short_name;
    global.ref.ranking_other_country_value.innerHTML = thisCountryData.ranking;
    global.ref.ranking_other_country_value.style.color = thisCountryColour.fullColour;
    global.ref.ranking_other_country_value.style.borderColor = thisCountryColour.fullColour;
    global.ref.ranking_other_mean_value.style.color = colour.fullColour;
    global.ref.ranking_other_mean_value.style.borderColor = colour.fullColour;
    global.ref.ranking_other_mean_label.innerHTML = name;
    global.ref.ranking_other_mean_value.innerHTML = ranking;
    global.ref.country_other_index.innerHTML = "";
    global.ref.country_other_infrastructure.innerHTML = "";
    global.ref.country_other_access.innerHTML = "";
    global.functions.renderTheIndexPieChart(global.ref.country_other_index, code, colour.barColour);
    global.functions.renderInfrastructurePieChart(global.ref.country_other_infrastructure, code, colour.barColour);
    global.functions.renderAccessPieChart(global.ref.country_other_access, code, colour.barColour);
    top = global.functions.getIndicatorTop(global.selections.indicator);
    max = parseFloat(global.data.statistics.max).toFixed(2);
    if (!top) {
      top = max;
    } else {
      top = Math.max(top, max);
    }
    container = "#comparison-bar-chart";
    if ((_ref1 = document.querySelector(container)) != null) {
      _ref1.innerHTML = "";
    }
    return wesCountry.charts.chart({
      chartType: "bar",
      container: container,
      series: [
        {
          name: name,
          value: value,
          values: [value],
          area_type: area_type
        }, {
          name: thisCountryData.short_name,
          value: Math.round(thisCountryData.value),
          values: [thisCountryData.value],
          area_type: thisCountryData.area_type
        }
      ],
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
        "font-size": "8px",
        maxValue: top
      },
      margins: [5, 0, 10, 0],
      valueOnItem: {
        show: true,
        margin: 6
      },
      nameUnderItem: {
        show: true
      },
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
      },
      getElementColour: function(options, element, index) {
        value = Math.round(element.value);
        if (element.area_type && element.area_type.toUpperCase() === "DEVELOPING") {
          return global.colours.developingColours[Math.abs(value - global.minMaxDeveloping.min)];
        }
        return global.colours.emergingColours[Math.abs(value - global.minMaxEmerging.min)];
      }
    });
  };

  loadEventHandlers = function() {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    if ((_ref = global.ref.btn_indicator) != null) {
      _ref.onclick = function(event) {
        return renderCharts();
      };
    }
    if ((_ref1 = global.ref.indicator_info_button) != null) {
      _ref1.onclick = function(event) {
        showIndicatorDetail();
        return false;
      };
    }
    if ((_ref2 = global.ref.close_indicator) != null) {
      _ref2.onclick = function(event) {
        hideIndicatorDetail();
        return false;
      };
    }
    if ((_ref3 = global.ref.countryIndicatorSelector) != null) {
      _ref3.onchange = function() {
        var value;
        value = global.ref.countryIndicatorSelector.value;
        global.ref.indicatorSelector.value = value;
        return global.ref.indicatorSelector.refresh();
      };
    }
    if ((_ref4 = global.ref.close) != null) {
      _ref4.onclick = function(event) {
        bodyUnWrap();
        global.ref.compare_section.style.display = "none";
        global.ref.country_selector.selectedIndex = 0;
        global.ref.country_selector.refresh();
        global.ref.country_compare_selector.selectedIndex = 0;
        global.ref.country_compare_selector.refresh();
        global.countryDetailOpened = false;
        global.comparisonOpened = false;
        global.countryRequested = null;
        global.comparisonRequested = null;
        return false;
      };
    }
    if ((_ref5 = global.ref.btn_compare) != null) {
      _ref5.onclick = function(event) {
        if (global.selections.compare !== "") {
          return loadCountryComparison(global.selections.compare);
        }
      };
    }
    if ((_ref6 = global.ref.btn_country_indicator) != null) {
      _ref6.onclick = function(event) {
        return renderCharts();
      };
    }
    if ((_ref7 = global.ref.btn_country) != null) {
      _ref7.onclick = function(event) {
        return loadCountryDetail(global.ref.country_selector.value);
      };
    }
    if (global.isMobile === false) {
      return window.onresize = function() {
        global.listFunctions.clearTable();
        return setPageHeight();
      };
    }
  };

  this.loadInitialData = function(data) {
    var _ref, _ref1;
    setPageHeight();
    this.loadReferences();
    showLoading();
    loadEventHandlers();
    loadAreas(data.areas);
    loadAreasInfo(data.areasInfo);
    loadIndexIndicator(data.index);
    loadIndicators(data.obs_index, data.obs_access, data.obs_infrastructure);
    if ((_ref = global.ref.pies) != null) {
      if ((_ref1 = _ref.style) != null) {
        _ref1.display = "block";
      }
    }
    return setPageStateful();
  };

}).call(this);
