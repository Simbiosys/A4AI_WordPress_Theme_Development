
/*
visualisations = document.querySelectorAll(".hidden-visualisations div.visualisation")

for visualisation in visualisations
  anchor = visualisation.getAttribute("data-anchor")

  if anchor
    wrapper = document.querySelector(".visualisation-wrapper[data-visualisation='#{anchor}']")
    if wrapper
      wrapper.appendChild(visualisation)
      continue

  position = visualisation.getAttribute("data-position")

  if !position then continue

  container = document.querySelector(".report-articles article:nth-child(#{position})")

  if !container then continue

  nav = container.querySelector("nav")

  if !nav then continue

  nav.parentNode.insertBefore(visualisation, nav.nextSibling);
 */

(function() {
  var className, i, item, items, numberOfCells, row, rows, table, tables, td, tdClosed, tdOpened, tr, _i, _j, _k, _len, _len1, _ref;

  items = document.querySelectorAll("#table-of-contents i.fa");

  for (_i = 0, _len = items.length; _i < _len; _i++) {
    item = items[_i];
    item.opened = false;
    item.arrow = item;
    item.onclick = function(event) {
      var list, opened;
      opened = !this.opened;
      this.opened = opened;
      list = this.parentNode.querySelector("ol, ul");
      if (opened) {
        this.arrow.className = "fa fa-angle-up fa-2x";
        return list.style.display = "block";
      } else {
        this.arrow.className = "fa fa-angle-down fa-2x";
        return list.style.display = "none";
      }
    };
  }

  tables = document.querySelectorAll("table.data-table:not(.full-table) tbody");

  tdOpened = "View less <i class='fa fa-angle-double-up'></i>";

  tdClosed = "View more <i class='fa fa-angle-double-down'></i>";

  for (_j = 0, _len1 = tables.length; _j < _len1; _j++) {
    table = tables[_j];
    rows = table.children;
    if (rows.length < 10) {
      continue;
    }
    numberOfCells = 1;
    for (i = _k = 10, _ref = rows.length - 1; 10 <= _ref ? _k <= _ref : _k >= _ref; i = 10 <= _ref ? ++_k : --_k) {
      row = rows[i];
      className = row.className;
      row.className = "" + className + " hidden";
      numberOfCells = row.children.length;
    }
    tr = document.createElement("tr");
    tr.className = "view-more";
    table.appendChild(tr);
    td = document.createElement("td");
    td.setAttribute("colspan", numberOfCells);
    td.innerHTML = tdClosed;
    tr.appendChild(td);
    td.opened = false;
    td.table = table;
    td.onclick = function(event) {
      var opened;
      opened = !this.opened;
      this.opened = opened;
      this.table.className = opened ? "opened" : "";
      return this.innerHTML = opened ? tdOpened : tdClosed;
    };
  }

}).call(this);
