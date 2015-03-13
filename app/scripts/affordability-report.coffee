$(->
  svgs = document.querySelectorAll("svg.infographic-country")

  animation_time = 500

  for svg in svgs
    s = Snap(svg)

    # Plug
    plug = s.select(".plug")
    plug_pos = plug.attr("data-pos")
    plug.animate({transform: "translate(#{plug_pos}, 0)"}, animation_time)

    # Wire
    wire = s.select(".wire")
    wire_width = wire.attr("data-width")
    wire.animate({width: wire_width}, animation_time)

    # Bar
    bar = s.select(".bar")
    bar_width = bar.attr("data-width")
    bar.animate({width: bar_width}, animation_time)

    # Value
    value = s.select(".value")
    value_value = value.attr("data-value")
    value_value = parseFloat(value_value)

    instant = animation_time * 5 / value_value

    partial_value = 0
    value.node.textContent = "00"

    loopText = (value, value_value, instant) ->
      partial_value++
      text = partial_value
      if text < 10 then text = "0" + text
      value.node.textContent = text

      if partial_value < value_value
        setTimeout(->
          loopText(value, value_value, instant)
        instant)
      else
        value.node.textContent = value_value

    loopText(value, value_value, instant)
)
