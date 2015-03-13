###
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
###

# Table of contents
items = document.querySelectorAll("#table-of-contents i.fa")

for item in items
  item.opened = false
  item.arrow = item
  item.onclick = (event) ->
    opened = !this.opened
    this.opened = opened

    list = this.parentNode.querySelector("ol, ul")

    if opened
      this.arrow.className = "fa fa-angle-up fa-2x"
      list.style.display = "block"
    else
      this.arrow.className = "fa fa-angle-down fa-2x"
      list.style.display = "none"

# Collapse big tables

tables = document.querySelectorAll("table.data-table:not(.full-table) tbody")
tdOpened = "View less <i class='fa fa-angle-double-up'></i>"
tdClosed = "View more <i class='fa fa-angle-double-down'></i>"

for table in tables
  rows = table.children

  if rows.length < 10 then continue

  numberOfCells = 1

  for i in [10..rows.length - 1]
    row = rows[i]
    className = row.className
    row.className = "#{className} hidden"

    numberOfCells = row.children.length

  # View more
  tr = document.createElement "tr"
  tr.className = "view-more"
  table.appendChild tr

  td = document.createElement "td"
  td.setAttribute("colspan", numberOfCells)
  td.innerHTML = tdClosed
  tr.appendChild td

  td.opened = false
  td.table = table

  td.onclick = (event) ->
    opened = !this.opened
    this.opened = opened

    this.table.className = if opened then "opened" else ""
    this.innerHTML = if opened then tdOpened else tdClosed
