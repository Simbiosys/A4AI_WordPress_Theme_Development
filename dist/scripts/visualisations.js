(function() {
  var host, href, link, links, url, visualisation, visualisationLink, visualisations, _i, _j, _len, _len1, _ref;

  host = (_ref = document.getElementById("host")) != null ? _ref.value : void 0;

  visualisations = document.querySelectorAll("div.visualisation-wrapper");

  for (_i = 0, _len = visualisations.length; _i < _len; _i++) {
    visualisation = visualisations[_i];
    visualisationLink = visualisation.getAttribute("data-link");
    url = "" + host + visualisationLink;
    links = visualisation.querySelectorAll("a.social-link");
    for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
      link = links[_j];
      href = link.getAttribute("data-href");
      href = href.replace("{0}", url);
      link.setAttribute("href", href);
    }
  }

}).call(this);
