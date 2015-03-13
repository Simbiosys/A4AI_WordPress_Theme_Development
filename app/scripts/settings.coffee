global = this

if global.settingsLoaded
  return

global.settingsLoaded = true

settings = {
  debug: {
    debug: true,
    elapseTimeout: 100,
    server: {
      method: "JSONP",
      url: "http://data.a4ai.org/api"
    }
  },
  release: {
    debug: false,
    elapseTimeout: 0,
    server: {
      method: "JSONP",
      url: document.getElementById("api").value
      path: document.getElementById("path")?.value
    }
  },
  mode: if @mode then @mode else "release"
}

@settings = settings[settings.mode]

# Auxiliary communication functions

@processJSONP = (url) ->
  if !@settings.debug
    encoded_url = encodeURIComponent(url)
    url = "#{@settings.server.path}/renderization/data/api.php?url=#{encoded_url}"

  head = document.head
  script = document.createElement("script")

  script.setAttribute("src", url)
  head.appendChild(script)
  head.removeChild(script)

@processAJAX = (url, callback) ->
