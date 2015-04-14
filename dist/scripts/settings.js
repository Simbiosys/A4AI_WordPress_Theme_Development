(function() {
  var global, settings, _ref;

  global = this;

  if (global.settingsLoaded) {
    return;
  }

  global.settingsLoaded = true;

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
        url: document.getElementById("api").value,
        path: (_ref = document.getElementById("path")) != null ? _ref.value : void 0
      }
    },
    mode: this.mode ? this.mode : "release"
  };

  this.settings = settings[settings.mode];

  this.processJSONP = function(url) {
    var encoded_url, head, script;
    if (!this.settings.debug) {
      encoded_url = encodeURIComponent(url);
      url = "" + this.settings.server.path + "/renderization/data/api.php?data&url=" + encoded_url;
    }
    head = document.head;
    script = document.createElement("script");
    script.setAttribute("src", url);
    head.appendChild(script);
    return head.removeChild(script);
  };

  this.processAJAX = function(url, callback) {};

}).call(this);
