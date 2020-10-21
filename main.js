function getCurrentProjectId() {
  // this pattern occurs when url is dashboard
  const orgPattern = location.href.match(
    "https://github.com/orgs/([a-zA-Z0-9-]+)"
  );
  const usernamePattern = location.href.match(
    "https://github.com/([a-zA-Z0-9-]+)"
  );
  if (orgPattern && orgPattern.length === 2) {
    return orgPattern[1];
  }
  if (usernamePattern && usernamePattern.length === 2) {
    return usernamePattern[1];
  }
  return "";
}

function changeHeaderColor() {
  var defaultSetting = {
    conditions: [],
  };
  chrome.storage.sync.get(defaultSetting, function (setting) {
    var projectId = getCurrentProjectId();
    if (!projectId) {
      console.log("couldn't get projectId");
      return;
    }

    var conditions = setting.conditions;
    for (var i = 0; i < conditions.length; i++) {
      var condition = conditions[i];
      if (projectId.match(condition.pattern)) {
        var colorRgb =
          "rgb(" +
          condition.color.r +
          ", " +
          condition.color.g +
          ", " +
          condition.color.b +
          ")";
        document.body.style.backgroundColor = colorRgb;
        var sidebarOnDashboard = document.getElementById("org_your_repos"); // for dashboard pattern
        if (sidebarOnDashboard) sidebarOnDashboard.style.background = colorRgb;
        return;
      }
    }
  });
}

(function () {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    changeHeaderColor();
  });
  changeHeaderColor();
})();
