host = document.getElementById("host")?.value

visualisations = document.querySelectorAll("div.visualisation-wrapper")

for visualisation in visualisations
  visualisationLink = visualisation.getAttribute("data-link")
  url = "#{host}#{visualisationLink}"

  links = visualisation.querySelectorAll("a.social-link")

  for link in links
    href = link.getAttribute("data-href")
    href = href.replace("{0}", url)
    link.setAttribute("href", href)
