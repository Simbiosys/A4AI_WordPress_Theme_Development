(function() {
  var global, sortAreasByName, sortAreasByRank, sortTableRows;

  global = this;

  if (global.listLoaded) {
    return;
  }

  global.listLoaded = true;

  global.listFunctions = {};

  sortTableRows = function(areas, positions) {
    var area, count, index, isMobile, list, seeMore, tr, _i, _j, _len, _len1;
    index = 0;
    isMobile = global.functions.isMobile();
    list = [];
    for (_i = 0, _len = areas.length; _i < _len; _i++) {
      area = areas[_i];
      tr = global.ref.countryListBody.querySelector("tr[data-area=" + area.area + "]");
      if (tr) {
        if (isMobile) {
          list.push(tr);
        } else {
          tr.style.top = positions[index] + "px";
          tr.style.position = "absolute";
        }
      }
      index++;
    }
    if (isMobile) {
      seeMore = global.ref.countryListBody.querySelector("tr.see-more");
      global.ref.countryListBody.innerHTML = "";
      count = 1;
      for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
        tr = list[_j];
        global.ref.countryListBody.appendChild(tr);
        tr.style.display = count > 5 ? "none" : "block";
        count++;
      }
      return global.ref.countryListBody.appendChild(seeMore);
    }
  };

  sortAreasByRank = function(areas, positions) {
    areas.sort(function(a, b) {
      var aIndex, aRanking, bIndex, bRanking, _ref, _ref1, _ref2, _ref3;
      aRanking = a.ranking ? a.ranking : 100;
      bRanking = b.ranking ? b.ranking : 100;
      if (aRanking !== bRanking) {
        return aRanking - bRanking;
      }
      aIndex = (_ref = global.indexValues[a.area]) != null ? (_ref1 = _ref["INDEX"]) != null ? _ref1.value : void 0 : void 0;
      bIndex = (_ref2 = global.indexValues[b.area]) != null ? (_ref3 = _ref2["INDEX"]) != null ? _ref3.value : void 0 : void 0;
      return bIndex - aIndex;
    });
    if (positions) {
      return sortTableRows(areas, positions);
    }
  };

  sortAreasByName = function(areas, positions) {
    areas.sort(function(a, b) {
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
    if (positions) {
      return sortTableRows(areas, positions);
    }
  };

  global.listFunctions.clearTable = function() {
    var countryListBody;
    countryListBody = global.ref.countryListBody;
    return countryListBody != null ? countryListBody.innerHTML = "" : void 0;
  };

  global.listFunctions.renderTable = function(areas, developingColours, emergingColours, minDeveloping, minEmerging) {
    var area, area_type, code, colour, continent, continentName, count, countryListBody, isMobile, name, p, positions, rank, scale, td, tdIndex, tdSubindex1, tdSubindex2, tdValue, top, tr, trExists, value, _i, _len, _ref, _ref1;
    countryListBody = global.ref.countryListBody;
    isMobile = global.functions.isMobile();
    count = 1;
    top = 0;
    positions = [];
    sortAreasByRank(areas);
    scale = (_ref = global.selections.indicatorOption) != null ? _ref.getAttribute("data-scale") : void 0;
    for (_i = 0, _len = areas.length; _i < _len; _i++) {
      area = areas[_i];
      name = area.short_name;
      code = area.area.toUpperCase();
      continent = area.continent.toUpperCase();
      continentName = global.continents[continent];
      value = area.value ? parseFloat(area.value).toFixed(2) : null;
      area_type = area.area_type ? (_ref1 = area.area_type) != null ? _ref1.toUpperCase() : void 0 : "EMERGING";
      colour = area_type === "EMERGING" ? global.colours.emerging : global.colours.developing;
      rank = area.ranking;
      positions.push(top);
      tr = countryListBody.querySelector("tr[data-area='" + code + "']");
      trExists = tr ? true : false;
      if (!trExists) {
        tr = document.createElement("tr");
        tr.setAttribute("data-area", code);
        countryListBody.appendChild(tr);
        tr.onclick = function(event) {
          return global.functions.selectCountryInSelector(this.getAttribute("data-area"));
        };
      }
      tr.style.top = top + "px";
      if (trExists) {
        td = tr.querySelector("td.ranking");
      } else {
        td = document.createElement("td");
        td.className = "ranking " + area_type + (rank ? "" : " empty");
        tr.appendChild(td);
      }
      if (td != null) {
        td.innerHTML = rank ? rank : "-";
      }
      if (trExists) {
        td = tr.querySelector("td.flag");
      } else {
        td = document.createElement("td");
        td.className = "flag";
        tr.appendChild(td);
        td.appendChild(global.functions.getFlag(code));
      }
      if (!trExists) {
        td = document.createElement("td");
        td.className = "name";
        tr.appendChild(td);
        p = document.createElement("p");
        p.innerHTML = name;
        p.className = "name";
        td.appendChild(p);
        p = document.createElement("p");
        p.innerHTML = continentName;
        p.className = "continent";
        td.appendChild(p);
      }
      if (trExists) {
        tdValue = tr.querySelector("td.pie.value");
      } else {
        tdValue = document.createElement("td");
        tdValue.className = "pie value";
        tr.appendChild(tdValue);
        tdValue.id = "v" + wesCountry.guid();
      }
      tdValue.innerHTML = "";
      global.functions.renderValuePieChart(tdValue, value, colour, global.selections.indicator);
      if (scale) {
        p = document.createElement("p");
        p.className = "scale";
        p.innerHTML = scale;
        tdValue.appendChild(p);
      }
      if (trExists) {
        tdIndex = tr.querySelector("td.pie.index");
      } else {
        tdIndex = document.createElement("td");
        tdIndex.className = "pie index-values index";
        tr.appendChild(tdIndex);
        tdIndex.id = "v" + wesCountry.guid();
        global.functions.renderTheIndexPieChart(tdIndex, code, colour);
      }
      if (trExists) {
        tdSubindex1 = tr.querySelector("td.pie.subindex1");
      } else {
        tdSubindex1 = document.createElement("td");
        tdSubindex1.className = "pie index-values subindex1";
        tr.appendChild(tdSubindex1);
        tdSubindex1.id = "v" + wesCountry.guid();
        global.functions.renderInfrastructurePieChart(tdSubindex1, code, colour);
      }
      if (trExists) {
        tdSubindex2 = tr.querySelector("td.pie.subindex2");
      } else {
        tdSubindex2 = document.createElement("td");
        tdSubindex2.className = "pie index-values subindex2";
        tr.appendChild(tdSubindex2);
        tdSubindex2.id = "v" + wesCountry.guid();
        global.functions.renderAccessPieChart(tdSubindex2, code, colour);
      }
      top += tr.offsetHeight;
      count++;
    }
    if (isMobile) {
      tr = countryListBody.querySelector("tr.see-more");
      trExists = tr ? true : false;
      if (!trExists) {
        tr = document.createElement("tr");
        tr.className = "see-more";
        countryListBody.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = '<span>SEE MORE</span> <i class="fa fa-angle-down"></i>';
        tr.appendChild(td);
        tr.opened = false;
        tr.onclick = function(event) {
          var opened, row, rows, _j, _len1, _ref2, _ref3;
          opened = !this.opened;
          this.opened = opened;
          if (opened) {
            rows = (_ref2 = this.parentNode) != null ? _ref2.querySelectorAll("tr") : void 0;
          } else {
            rows = (_ref3 = this.parentNode) != null ? _ref3.querySelectorAll("tr:nth-child(n + 6)") : void 0;
          }
          for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
            row = rows[_j];
            row.style.display = opened ? "block" : "none";
          }
          this.style.display = "block";
          td = this.children[0];
          return td.innerHTML = opened ? '<span>SEE LESS</span> <i class="fa fa-angle-up"></i>' : '<span>SEE MORE</span> <i class="fa fa-angle-down"></i>';
        };
      }
    }
    if (!global.functions.isMobile()) {
      countryListBody.style.minHeight = countryListBody.clientHeight + "px";
    }
    global.ref.switch2_by_name.onchange = function(event) {
      if (!this.checked) {
        return;
      }
      return sortAreasByName(areas, positions);
    };
    global.ref.switch2_by_rank.onchange = function(event) {
      if (!this.checked) {
        return;
      }
      return sortAreasByRank(areas, positions);
    };
    return sortAreasByRank(areas, positions);
  };

}).call(this);
