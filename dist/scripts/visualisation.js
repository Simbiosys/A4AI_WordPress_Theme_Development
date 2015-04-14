(function() {
  var formatMoney, getXCoordinate, getYCoordinate, global, hideCountryInfo, loadAreas, loadChecks, outCountry, overCountry, renderAxis, renderBubbles, renderVisualisation, setDivisionText, setTitles, showCountryInfo;

  global = this;

  if (!global.ref) {
    global.ref = {};
  }

  global.ref.path = document.getElementById("path").value;

  global.ref.info = document.querySelector(".info");

  global.ref.flag = document.querySelector(".info .flag");

  global.ref.close = document.querySelector(".info .close");

  global.ref.country_name = document.querySelector(".info .country-name");

  global.ref.value_x = document.querySelector(".info .value-x");

  global.ref.value_y = document.querySelector(".info .value-y");

  global.ref.value_population = document.querySelector(".info .value-population");

  global.ref.value_poverty = document.querySelector(".info .value-poverty");

  global.ref.value_gni = document.querySelector(".info .value-gni");

  global.ref.country_selector = document.getElementById("country-selector");

  global.ref.go = document.querySelector(".country-search-wrapper .button-wrapper button");

  global.ref.loading = document.getElementById("loading");

  global.minWidthForLabels = 480;

  global.screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  if (!global.functions) {
    global.functions = {};
  }

  global.functions.getFlag = function(code, img) {
    var append, content, style;
    append = false;
    if (!img) {
      img = document.createElement("img");
      append = true;
    }
    img.className = "flag flag-" + code;
    if (append) {
      document.body.appendChild(img);
    }
    style = window.getComputedStyle(img);
    content = style.getPropertyValue('content');
    if (content) {
      if (content.indexOf('url("') !== -1) {
        content = content.replace('url("', '');
        content = content.substring(0, content.length - 2);
      } else {
        content = content.replace('url(', '');
        content = content.substring(0, content.length - 1);
      }
      img.src = content;
    }
    return img;
  };

  global.openCountry = function(code, name) {
    var bubble, container;
    container = document.querySelector(global.visualisation.container);
    hideCountryInfo(null, global.visualisation.bubbles);
    if (code && container) {
      bubble = global.visualisation.svg.select("g[data-code='" + code + "']");
      return showCountryInfo(bubble, global.visualisation.bubbles);
    }
  };

  formatMoney = function(n, c, d, t) {
    var i, j, s;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === void 0 ? "." : d;
    t = t === void 0 ? "," : t;
    s = n < 0 ? "-" : "";
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

  loadAreas = function(data, areasInfo) {
    var area, areas, gni, gniName, iso3, option, population, populationName, poverty, povertyName, short_name, totalPopulation, type, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    if (!data.success) {
      return;
    }
    if (!areasInfo.success) {
      return;
    }
    areas = data.data;
    areasInfo = areasInfo.data;
    global.visualisation.areas = areas;
    global.prepareSearchEntries(areas);
    populationName = global.visualisation.data.population.name;
    gniName = global.visualisation.data.gni.name;
    povertyName = global.visualisation.data.poverty.name;
    for (_i = 0, _len = areas.length; _i < _len; _i++) {
      area = areas[_i];
      iso3 = area.iso3;
      short_name = area.short_name;
      type = area.type;
      option = document.createElement("option");
      option.value = iso3;
      option.innerHTML = short_name;
      global.ref.country_selector.appendChild(option);
      totalPopulation = population = areasInfo != null ? (_ref = areasInfo[populationName]) != null ? (_ref1 = _ref.values) != null ? (_ref2 = _ref1[iso3]) != null ? _ref2.value : void 0 : void 0 : void 0 : void 0;
      poverty = areasInfo != null ? (_ref3 = areasInfo[povertyName]) != null ? (_ref4 = _ref3.values) != null ? (_ref5 = _ref4[iso3]) != null ? _ref5.value : void 0 : void 0 : void 0 : void 0;
      gni = areasInfo != null ? (_ref6 = areasInfo[gniName]) != null ? (_ref7 = _ref6[iso3]) != null ? (_ref8 = _ref7.values) != null ? _ref8.value : void 0 : void 0 : void 0 : void 0;
      global.visualisation.data.info[iso3] = {
        totalPopulation: totalPopulation,
        poverty: poverty,
        gni: gni
      };
      if (population) {
        population = parseFloat(population);
        if (population > global.visualisation.data.population.top) {
          population = population / global.visualisation.data.population.factor;
        }
        global.visualisation.data.population.byCountry[iso3] = population;
        global.visualisation.data.population.list.push({
          iso3: iso3,
          short_name: short_name,
          type: type,
          population: population,
          totalPopulation: totalPopulation,
          gni: gni,
          poverty: poverty
        });
        if (population > global.visualisation.data.population.max) {
          global.visualisation.data.population.max = population;
        }
        if (population < global.visualisation.data.population.min) {
          global.visualisation.data.population.min = population;
        }
      }
    }
    global.visualisation.data.population.list.sort(function(a, b) {
      return b.population - a.population;
    });
    return global.visualisation.loadData(global.visualisation.indicator1.code, global.visualisation.indicator2.code);
  };

  this.getDataCallback = function(data) {
    var container, _ref, _ref1;
    if (!data.success) {
      return;
    }
    data = data.data;
    container = document.querySelector(".visualisation-container");
    loadChecks(container);
    setTitles(container);
    renderVisualisation(data, global.visualisation.indicator1.code, global.visualisation.indicator2.code);
    return (_ref = global.ref.loading) != null ? (_ref1 = _ref.style) != null ? _ref1.display = "none" : void 0 : void 0;
  };

  loadChecks = function(container) {
    var check, checks, svg, _i, _len;
    checks = document.querySelectorAll(".type-checks input[type=checkbox]");
    svg = container != null ? container.querySelector("svg") : void 0;
    for (_i = 0, _len = checks.length; _i < _len; _i++) {
      check = checks[_i];
      check.onchange = function() {
        var bubble, bubbles, className, show, value, _j, _len1;
        show = this.checked;
        value = this.value;
        bubbles = svg != null ? svg.querySelectorAll("[data-group-type=" + value + "]") : void 0;
        for (_j = 0, _len1 = bubbles.length; _j < _len1; _j++) {
          bubble = bubbles[_j];
          bubble.style.display = show ? "" : "none";
        }
        className = show ? "" : " hidden";
        return global.visualisation.svg.select("g.texts g." + value).attr({
          "class": "" + value + className
        });
      };
    }
    check = document.querySelector(".other-checks input[type=checkbox]");
    return check != null ? check.onchange = function() {
      var proportion;
      proportion = this.checked;
      global.visualisation.svg.selectAll("[data-group-type] circle").forEach(function(element, i) {
        return element.attr({
          "r": proportion ? element.attr("data-radio") : element.attr("data-radio-default")
        });
      });
      return global.visualisation.svg.selectAll("g.texts text").forEach(function(element, i) {
        return element.attr({
          "y": proportion ? element.attr("data-posY-default") : element.attr("data-posY")
        });
      });
    } : void 0;
  };

  setTitles = function(container) {
    var icon, label;
    label = container.querySelector(".title-x span.text");
    if (label != null) {
      label.innerHTML = global.visualisation.indicator1.name;
    }
    icon = container.querySelector(".title-x span.glyph-icon");
    if (icon != null) {
      icon.className = "glyph-icon flaticon-" + global.visualisation.indicator1.icon;
    }
    label = container.querySelector(".title-y span.text");
    if (label != null) {
      label.innerHTML = global.visualisation.indicator2.name;
    }
    icon = container.querySelector(".title-y span.glyph-icon");
    return icon != null ? icon.className = "glyph-icon flaticon-" + global.visualisation.indicator2.icon : void 0;
  };

  getXCoordinate = function(value, innerWidth, leftMargin) {
    return leftMargin + (value - global.visualisation.xAxis.min) * innerWidth / (global.visualisation.xAxis.max - global.visualisation.xAxis.min);
  };

  getYCoordinate = function(value, innerHeight, topMargin) {
    if (global.visualisation.yAxis.lowToHigh) {
      return topMargin + innerHeight - (value * innerHeight / global.visualisation.yAxis.max);
    } else {
      return topMargin + (value * innerHeight / global.visualisation.yAxis.max);
    }
  };

  setDivisionText = function(x, y, text, innerWidth, leftMargin, innerHeight, topMargin) {
    x = getXCoordinate(x, innerWidth, leftMargin);
    y = getYCoordinate(y, innerHeight, topMargin);
    return global.visualisation.svg.text(x, y, text).attr({
      fill: global.visualisation.colours.division,
      "text-anchor": "middle",
      "class": "division-text"
    });
  };

  showCountryInfo = function(element, bubbles) {
    var bubble, code, gni, group, name, population, poverty, valueX, valueY, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    name = element.attr("data-name");
    code = element.attr("data-code");
    valueX = parseFloat(element.attr("data-valueX")).toFixed(2);
    valueY = parseFloat(element.attr("data-valueY")).toFixed(2);
    population = element.attr("data-population");
    gni = element.attr("data-gni");
    poverty = element.attr("data-poverty");
    if ((_ref = global.ref.info) != null) {
      if ((_ref1 = _ref.style) != null) {
        _ref1.display = "block";
      }
    }
    global.functions.getFlag(code, global.ref.flag);
    if ((_ref2 = global.ref.country_name) != null) {
      _ref2.innerHTML = name;
    }
    if ((_ref3 = global.ref.value_x) != null) {
      _ref3.innerHTML = "<span class='text'>" + global.visualisation.indicator1.name + "</span><span class='value'>" + valueX + "</span>";
    }
    if ((_ref4 = global.ref.value_y) != null) {
      _ref4.innerHTML = "<span class='text'>" + global.visualisation.indicator2.name + "</span><span class='value'>" + valueY + "</span>";
    }
    if (population) {
      population = formatMoney(population, 2, '.', ',');
      if ((_ref5 = global.ref.value_population) != null) {
        _ref5.innerHTML = "<span class='text'>Population</span><span class='value'>" + population + "</span>";
      }
    }
    if (gni) {
      gni = gni !== "-" ? "$" + formatMoney(gni, 2, '.', ',') : "-";
      if ((_ref6 = global.ref.value_gni) != null) {
        _ref6.innerHTML = "<span class='text'>GNI per capita</span><span class='value'>" + gni + "</span>";
      }
    }
    if (poverty) {
      if (poverty !== "-") {
        poverty += "%";
      }
      if ((_ref7 = global.ref.value_poverty) != null) {
        _ref7.innerHTML = "<span class='text'>Population at less than $2</span><span class='value'>" + poverty + "</span>";
      }
    }
    for (bubble in bubbles) {
      group = bubbles[bubble];
      if (group === element) {
        continue;
      }
      if (group != null) {
        group.addClass("empty opened");
      }
    }
    if ((_ref8 = global.visualisation.svg.select("g.texts")) != null) {
      _ref8.addClass("opened");
    }
    return (_ref9 = global.visualisation.svg.select("g.texts text[data-iso3='" + code + "']")) != null ? _ref9.addClass("opened-selected") : void 0;
  };

  hideCountryInfo = function(element, bubbles) {
    var bubble, group, _ref, _ref1, _ref2;
    if ((_ref = global.ref.info) != null) {
      if ((_ref1 = _ref.style) != null) {
        _ref1.display = "none";
      }
    }
    for (bubble in bubbles) {
      group = bubbles[bubble];
      group.removeClass("empty opened");
    }
    global.visualisation.svg.select("g.texts").removeClass("opened");
    return (_ref2 = global.visualisation.svg.select("g.texts text.opened-selected")) != null ? _ref2.removeClass("opened-selected") : void 0;
  };

  overCountry = function(element, bubbles) {
    var bubble, code, group, _ref, _ref1;
    if (element != null) {
      element.addClass("over");
    }
    code = element != null ? element.attr("data-code") : void 0;
    for (bubble in bubbles) {
      group = bubbles[bubble];
      if (group === element) {
        continue;
      }
      if (group != null) {
        group.addClass("over-empty");
      }
    }
    if ((_ref = global.visualisation.svg.select("g.texts")) != null) {
      _ref.addClass("over");
    }
    return (_ref1 = global.visualisation.svg.select("g.texts text[data-iso3='" + code + "']")) != null ? _ref1.addClass("over-selected") : void 0;
  };

  outCountry = function(element, bubbles) {
    var bubble, group, _ref;
    for (bubble in bubbles) {
      group = bubbles[bubble];
      group.removeClass("over over-empty");
    }
    global.visualisation.svg.select("g.texts").removeClass("over");
    return (_ref = global.visualisation.svg.select("g.texts text.over-selected")) != null ? _ref.removeClass("over-selected") : void 0;
  };

  renderVisualisation = function(data, indicator1, indicator2) {
    var dimensions, observationsByCountry;
    observationsByCountry = global.visualisation.getObservationsByCountry(data, indicator1, indicator2);
    dimensions = renderAxis();
    renderBubbles(data, observationsByCountry, indicator1, indicator2, dimensions);
    return window.onresize = function() {
      dimensions = renderAxis();
      return renderBubbles(data, observationsByCountry, indicator1, indicator2, dimensions);
    };
  };

  renderAxis = function() {
    var bottomMargin, c, dimension, footerHeight, height, i, innerHeight, innerWidth, leftMargin, margin, margins, posX, posY, rightMargin, s_canvas, svg, text, titleHeight, topMargin, value, width, x, x1, x2, xAxisTextY, xAxisValueY, xAxisX1, xAxisX2, xAxisY1, xAxisY2, y, y1, y2, yAxisTextY1, yAxisTextY2, yAxisValueX, yAxisX, yAxisX1, yAxisX2, yAxisY1, yAxisY2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    svg = global.visualisation.container;
    s_canvas = document.querySelector(svg);
    c = s_canvas != null ? (_ref = s_canvas.parentNode) != null ? _ref.parentNode : void 0 : void 0;
    while (s_canvas.lastChild) {
      s_canvas.removeChild(s_canvas.lastChild);
    }
    width = c.clientWidth;
    height = c.clientHeight;
    if (global.screenWidth > global.minWidthForLabels) {
      height = c.clientHeight;
      footerHeight = (_ref1 = document.querySelector("footer.visualisation-footer")) != null ? _ref1.clientHeight : void 0;
      if (footerHeight) {
        height -= footerHeight;
      }
      titleHeight = (_ref2 = document.querySelector("div.title-x")) != null ? _ref2.clientHeight : void 0;
      if (titleHeight) {
        height -= titleHeight;
      }
    }
    s_canvas.setAttribute("width", width + "px");
    s_canvas.setAttribute("height", height + "px");
    global.visualisation.svg = Snap(svg);
    margins = [];
    _ref3 = global.visualisation.margins;
    for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
      margin = _ref3[i];
      dimension = i % 2 === 0 ? height : width;
      margins.push(dimension * (margin / 100));
    }
    margins[1] = global.screenWidth > global.minWidthForLabels ? margins[1] : margins[1] * 2.9;
    innerWidth = width - margins[1] - margins[3];
    innerHeight = height - margins[0] - margins[2];
    topMargin = margins[0];
    leftMargin = margins[3];
    bottomMargin = margins[2];
    rightMargin = margins[1];
    xAxisY1 = topMargin + innerHeight + bottomMargin * 0.5;
    xAxisY2 = xAxisY1 - global.visualisation.xAxis.width;
    xAxisX1 = leftMargin;
    xAxisX2 = leftMargin + innerWidth;
    global.visualisation.svg.path("M" + xAxisX1 + " " + xAxisY1 + "L" + xAxisX2 + " " + xAxisY1 + "L" + xAxisX2 + " " + xAxisY2 + "Z").attr({
      fill: global.visualisation.colours.axis,
      stroke: "none"
    });
    xAxisTextY = xAxisY1 + global.visualisation.xAxis.width * 0.8;
    xAxisValueY = xAxisY1 - global.visualisation.xAxis.width * 1.1;
    global.visualisation.svg.text(xAxisX1, xAxisTextY, "WORSE").attr({
      fill: global.visualisation.colours.axis_text,
      "text-anchor": "start",
      "class": "better-worse"
    });
    global.visualisation.svg.text(xAxisX2, xAxisTextY, "BETTER").attr({
      fill: global.visualisation.colours.axis_text,
      "text-anchor": "end",
      "class": "better-worse"
    });
    _ref4 = global.visualisation.xAxis.values;
    for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
      value = _ref4[_j];
      posX = getXCoordinate(value, innerWidth, leftMargin);
      global.visualisation.svg.text(posX, xAxisValueY, value).attr({
        fill: global.visualisation.colours.axis_text,
        "text-anchor": "middle"
      });
    }
    yAxisY1 = topMargin;
    yAxisY2 = topMargin + innerHeight;
    yAxisX = leftMargin + innerWidth + rightMargin * 0.3;
    yAxisX1 = yAxisX - global.visualisation.yAxis.width / 2;
    yAxisX2 = yAxisX + global.visualisation.yAxis.width / 2;
    if (global.visualisation.yAxis.lowToHigh) {
      global.visualisation.svg.path("M" + yAxisX1 + " " + yAxisY1 + "L" + yAxisX2 + " " + yAxisY1 + "L" + yAxisX + " " + yAxisY2 + "Z").attr({
        fill: global.visualisation.colours.axis,
        stroke: "none"
      });
    } else {
      global.visualisation.svg.path("M" + yAxisX1 + " " + yAxisY2 + "L" + yAxisX2 + " " + yAxisY2 + "L" + yAxisX + " " + yAxisY1 + "Z").attr({
        fill: global.visualisation.colours.axis,
        stroke: "none"
      });
    }
    yAxisTextY1 = yAxisY1 - global.visualisation.yAxis.width * 0.3;
    if (global.screenWidth < global.minWidthForLabels) {
      if (yAxisTextY1 < 10) {
        yAxisTextY1 = 10;
      }
    }
    yAxisTextY2 = yAxisY2 + global.visualisation.yAxis.width * 0.8;
    yAxisValueX = yAxisX1 - global.visualisation.yAxis.width * 0.9;
    global.visualisation.svg.text(yAxisX, yAxisTextY1, "BETTER").attr({
      fill: global.visualisation.colours.axis_text,
      "text-anchor": "middle",
      "class": "better-worse"
    });
    global.visualisation.svg.text(yAxisX, yAxisTextY2, "WORSE").attr({
      fill: global.visualisation.colours.axis_text,
      "text-anchor": "middle",
      "class": "better-worse"
    });
    _ref5 = global.visualisation.yAxis.values;
    for (_k = 0, _len2 = _ref5.length; _k < _len2; _k++) {
      value = _ref5[_k];
      posY = getYCoordinate(value, innerHeight, topMargin);
      global.visualisation.svg.text(yAxisValueX, posY, value).attr({
        fill: global.visualisation.colours.axis_text,
        "text-anchor": "middle"
      });
    }

    /*global.visualisation.svg.rect(leftMargin, topMargin, innerWidth, innerHeight).attr({
    		fill: global.visualisation.colours.background,
    		stroke: "none"
    	})
     */
    if (global.visualisation.divisions.show) {
      x = global.visualisation.xAxis.max / 2;
      x = getXCoordinate(x, innerWidth, leftMargin);
      y1 = getYCoordinate(0, innerHeight, topMargin);
      y2 = getYCoordinate(global.visualisation.yAxis.max, innerHeight, topMargin);
      global.visualisation.svg.line(x, y1, x, y2).attr({
        stroke: global.visualisation.colours.axis
      });
      y = global.visualisation.yAxis.max / 2;
      y = getYCoordinate(y, innerHeight, topMargin);
      x1 = getXCoordinate(0, innerWidth, leftMargin);
      x2 = getXCoordinate(global.visualisation.xAxis.max, innerWidth, leftMargin);
      global.visualisation.svg.line(x1, y, x2, y).attr({
        stroke: global.visualisation.colours.axis
      });
      text = global.visualisation.divisions.texts[0];
      x = global.visualisation.xAxis.max / 4;
      y = global.visualisation.yAxis.max * 3 / 4;
      setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin);
      text = global.visualisation.divisions.texts[1];
      x = global.visualisation.xAxis.max * 3 / 4;
      y = global.visualisation.yAxis.max * 3 / 4;
      setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin);
      text = global.visualisation.divisions.texts[2];
      x = global.visualisation.xAxis.max / 4;
      y = global.visualisation.yAxis.max / 4;
      setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin);
      text = global.visualisation.divisions.texts[3];
      x = global.visualisation.xAxis.max * 3 / 4;
      y = global.visualisation.yAxis.max / 4;
      setDivisionText(x, y, text, innerWidth, leftMargin, innerHeight, topMargin);
    }
    return {
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      margins: margins
    };
  };

  renderBubbles = function(data, observationsByCountry, indicator1, indicator2, dimensions) {
    var NewRange, OldRange, area_type, bottomMargin, bubble, cX, cY, country, defaultRadius, factor, g, gDeveloping, gEmerging, gni, group, innerHeight, innerRadius, innerWidth, leftMargin, observations, population, populationName, poverty, radius, rightMargin, short_name, text, texts, topMargin, totalPopulation, valueX, valueY, _i, _j, _len, _len1, _ref, _results;
    innerWidth = dimensions.innerWidth;
    innerHeight = dimensions.innerHeight;
    topMargin = dimensions.margins[0];
    leftMargin = dimensions.margins[3];
    bottomMargin = dimensions.margins[2];
    rightMargin = dimensions.margins[1];
    global.visualisation.bubbles = {};
    populationName = global.visualisation.data.population.name;
    OldRange = global.visualisation.data.population.max - global.visualisation.data.population.min;
    NewRange = global.visualisation.radius.max - global.visualisation.radius.min;
    texts = [];
    _ref = global.visualisation.data.population.list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      country = _ref[_i];
      population = country.population;
      totalPopulation = country.totalPopulation;
      poverty = country.poverty;
      gni = country.gni;
      observations = observationsByCountry[country.iso3];
      if (poverty) {
        poverty = parseFloat(poverty).toFixed(2);
      }
      if (!population) {
        radius = global.visualisation.radius.min;
      } else {
        radius = (((population - global.visualisation.data.population.min) * NewRange) / OldRange) + global.visualisation.radius.min;
      }
      valueX = observations[0].value;
      valueY = observations[1].value;
      if (!valueX || !valueY) {
        continue;
      }
      cX = getXCoordinate(valueX, innerWidth, leftMargin);
      cY = getYCoordinate(valueY, innerHeight, topMargin);
      area_type = country.type.toLowerCase();
      short_name = country.short_name;
      innerRadius = radius;
      factor = 1;
      if (poverty) {
        factor = poverty / 100;
      }
      g = global.visualisation.svg.g().attr({
        "data-group-type": area_type,
        "data-code": country.iso3,
        "data-name": short_name,
        "data-type": area_type,
        "data-valueX": valueX,
        "data-valueY": valueY,
        "data-population": totalPopulation,
        "data-gni": gni ? gni : "-",
        "data-poverty": poverty ? poverty : "-",
        "class": "bubble"
      });
      if (global.visualisation.hasInnerBubble) {
        bubble = global.visualisation.svg.circle(cX, cY, radius).attr({
          fill: global.visualisation.colours.country_background,
          stroke: "none",
          "data-colour": global.visualisation.colours.country_background,
          "data-type": "back",
          "data-area-type": area_type,
          "data-radio": radius,
          "data-radio-default": global.visualisation.radius["default"]
        });
        g.add(bubble);
        innerRadius = radius * factor;
      }
      defaultRadius = global.visualisation.radius["default"];
      bubble = global.visualisation.svg.circle(cX, cY, innerRadius).attr({
        fill: global.visualisation.colours[area_type],
        stroke: "none",
        "data-type": "fore",
        "data-colour": global.visualisation.colours[area_type],
        "data-area-type": area_type,
        "data-radio": innerRadius,
        "data-radio-default": defaultRadius
      });
      g.mouseover(function() {
        return overCountry(this, global.visualisation.bubbles);
      }).mouseout(function() {
        return outCountry(this, global.visualisation.bubbles);
      });
      g.click(function() {
        hideCountryInfo(this, global.visualisation.bubbles);
        return showCountryInfo(this, global.visualisation.bubbles);
      });
      g.add(bubble);
      global.visualisation.bubbles[country.iso3] = g;
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
      });
    }
    g = global.visualisation.svg.g().attr({
      "class": "texts"
    });
    gEmerging = g.g().attr({
      "class": "emerging"
    });
    gDeveloping = g.g().attr({
      "class": "developing"
    });
    if (global.screenWidth > global.minWidthForLabels) {
      _results = [];
      for (_j = 0, _len1 = texts.length; _j < _len1; _j++) {
        text = texts[_j];
        area_type = text["area-type"];
        group = area_type === "emerging" ? gEmerging : gDeveloping;
        _results.push(group.text(text.cX, text.cY, text.iso3).attr({
          "text-anchor": "middle",
          fill: text.fill,
          "data-iso3": text.iso3,
          "data-posY": text["data-posY"],
          "data-posY-default": text["data-posY-default"]
        }));
      }
      return _results;
    }
  };

  global.ref.go.onclick = function(event) {
    var bubble, code, _ref, _ref1, _ref2, _ref3, _ref4;
    code = (_ref = global.ref) != null ? (_ref1 = _ref.country_selector) != null ? (_ref2 = _ref1.options[(_ref3 = global.ref) != null ? (_ref4 = _ref3.country_selector) != null ? _ref4.selectedIndex : void 0 : void 0]) != null ? _ref2.value : void 0 : void 0 : void 0;
    if (code) {
      bubble = global.visualisation.bubbles[code];
      if (bubble) {
        hideCountryInfo(bubble, global.visualisation.bubbles);
        return showCountryInfo(bubble, global.visualisation.bubbles);
      }
    }
  };

  this.loadInitialData = function(data) {
    var max, min, _default, _ref, _ref1, _ref2;
    if ((_ref = document.getElementById("visualisation-title")) != null) {
      _ref.innerHTML = global.visualisation.title;
    }
    max = global.screenWidth / 12;
    min = max / 30;
    _default = max / 15;
    global.visualisation.radius.max = Math.round(max);
    global.visualisation.radius.min = Math.round(min);
    global.visualisation.radius["default"] = Math.round(_default);
    if (data.indicators) {
      global.indicators = data.indicators;
    }
    global.areasInfo = (_ref1 = data.areasInfo) != null ? _ref1.data : void 0;
    loadAreas(data.areas, data.areasInfo);
    return (_ref2 = global.ref.close) != null ? _ref2.onclick = function() {
      return hideCountryInfo(null, global.visualisation.bubbles);
    } : void 0;
  };

}).call(this);
