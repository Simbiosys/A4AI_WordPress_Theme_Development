(function() {
  var global, setRowAsActive, showRequestBox;

  global = this;

  global.search = [];

  global.previousSearch = "";

  global.sref = {
    search: document.getElementById("search"),
    requestBox: document.getElementById("request-box")
  };

  global.slabels = {
    "no-result": document.getElementById("no-result-label").value
  };

  global.prepareSearchEntries = function(areas) {
    var area, code, continent, name, search, search_value, _i, _len;
    search = [];
    for (_i = 0, _len = areas.length; _i < _len; _i++) {
      area = areas[_i];
      code = area.iso3.toUpperCase();
      continent = area.area;
      search_value = "" + (area.iso3.toUpperCase()) + ";" + (area.search.toUpperCase());
      name = area.short_name;
      search.push({
        search: search_value,
        name: name,
        code: code
      });
    }
    return global.search = search;
  };

  this.hideRequestBox = function() {
    return global.sref.requestBox.style.display = "none";
  };

  showRequestBox = function() {
    return global.sref.requestBox.style.display = "block";
  };

  setRowAsActive = function(tbody, index) {
    var activeRows, row, _i, _len;
    activeRows = tbody.querySelectorAll("tr.active");
    for (_i = 0, _len = activeRows.length; _i < _len; _i++) {
      row = activeRows[_i];
      row.className = "";
    }
    return tbody.querySelectorAll("tr")[index].className = "active";
  };

  global.sref.search.onblur = function(event) {
    return setTimeout(function() {
      return hideRequestBox();
    }, 200);
  };

  global.sref.search.onfocus = function(event) {
    var value;
    value = this.value.trim();
    if (value !== "") {
      return showRequestBox();
    }
  };

  global.sref.search.onkeyup = function(event) {
    var code, entry, index, name, requestBox, result, results, search, table, tbody, td, tr, value, _i, _j, _len, _len1, _ref;
    value = this.value.toUpperCase().trim();
    if (value === global.previousSearch) {
      return;
    }
    global.previousSearch = value;
    requestBox = global.sref.requestBox;
    if (value === "") {
      hideRequestBox();
      return;
    }
    results = [];
    _ref = global.search;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      search = entry.search;
      if (search.indexOf(value) !== -1) {
        results.push(entry);
        if (results.length === 10) {
          break;
        }
      }
    }
    showRequestBox();
    requestBox.innerHTML = '';
    table = document.createElement("table");
    requestBox.appendChild(table);
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
    if (results.length === 0) {
      tr = document.createElement("tr");
      tr.className = "no-result";
      tbody.appendChild(tr);
      td = document.createElement("td");
      td.innerHTML = global.slabels["no-result"];
      tr.appendChild(td);
      return;
    }
    for (_j = 0, _len1 = results.length; _j < _len1; _j++) {
      result = results[_j];
      name = result.name;
      code = result.code;
      tr = document.createElement("tr");
      tr.setAttribute("data-iso3", code);
      tr.setAttribute("data-name", name);
      tbody.appendChild(tr);
      tr.onclick = function(event) {
        global.openCountry(this.getAttribute("data-iso3"), this.getAttribute("data-name"));
        return event.stopPropagation();
      };
      td = document.createElement("td");
      td.className = "flag";
      tr.appendChild(td);
      td.appendChild(global.functions.getFlag(code));
      td = document.createElement("td");
      td.className = "name";
      td.innerHTML = name;
      tr.appendChild(td);
    }
    index = -1;
    return global.sref.search.onkeydown = function(event) {
      var key, length, row, rows;
      key = event.keyCode;
      switch (key) {
        case 40:
          rows = document.querySelectorAll(".request-box tr");
          length = rows.length;
          if (index < length - 1) {
            index++;
            setRowAsActive(tbody, index);
          }
          return false;
        case 38:
          if (index >= 1) {
            index--;
            setRowAsActive(tbody, index);
          }
          return false;
        case 13:
          row = tbody.querySelectorAll("tr")[index];
          if (row) {
            return global.openCountry(row.getAttribute("data-iso3"), row.getAttribute("data-name"));
          }
      }
    };
  };

}).call(this);
