(function() {
  $(function() {
    var animation_time, bar, bar_width, instant, loopText, partial_value, plug, plug_pos, s, svg, svgs, value, value_value, wire, wire_width, _i, _len, _results;
    svgs = document.querySelectorAll("svg.infographic-country");
    animation_time = 500;
    _results = [];
    for (_i = 0, _len = svgs.length; _i < _len; _i++) {
      svg = svgs[_i];
      s = Snap(svg);
      plug = s.select(".plug");
      plug_pos = plug.attr("data-pos");
      plug.animate({
        transform: "translate(" + plug_pos + ", 0)"
      }, animation_time);
      wire = s.select(".wire");
      wire_width = wire.attr("data-width");
      wire.animate({
        width: wire_width
      }, animation_time);
      bar = s.select(".bar");
      bar_width = bar.attr("data-width");
      bar.animate({
        width: bar_width
      }, animation_time);
      value = s.select(".value");
      value_value = value.attr("data-value");
      value_value = parseFloat(value_value);
      instant = animation_time * 5 / value_value;
      partial_value = 0;
      value.node.textContent = "00";
      loopText = function(value, value_value, instant) {
        var text;
        partial_value++;
        text = partial_value;
        if (text < 10) {
          text = "0" + text;
        }
        value.node.textContent = text;
        if (partial_value < value_value) {
          return setTimeout(function() {
            return loopText(value, value_value, instant);
          }, instant);
        } else {
          return value.node.textContent = value_value;
        }
      };
      _results.push(loopText(value, value_value, instant));
    }
    return _results;
  });

}).call(this);
