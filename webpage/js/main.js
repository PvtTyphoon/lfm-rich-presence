const { remote, nativeImage } = require("electron");
const win = remote.getCurrentWindow();
const Tray = remote.Tray;
const Menu = remote.Menu;
let tray = null;
const customTitlebar = require("custom-electron-titlebar");
const Store = require("electron-store");
const store = new Store();
const consoleDiv = document.getElementById("console");
const updatesDiv = document.getElementById("updates");
const rpc = require("discord-rpc");
const fetch = require("request-promise");
const prettyMilliseconds = require("pretty-ms");

function formatNumber(number) {
  var x = number.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}
/*
new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex("#202225"),
  minimizable: true,
  maximizable: false,
  menu: null,
  hideWhenClickingClose: true,
});
*/
const rp = new rpc.Client({
  transport: "ipc",
});

if (store.get("username"))
  document.getElementById("username").value = store.get("username");
if (store.get("apiKey"))
  document.getElementById("username").value = store.get("username");

document.getElementById("run").addEventListener("click", () => {
  rp.on("ready", async () => {
    consoleDiv.innerHTML = "";
    updatesDiv.innerHTML = "";
    let username = document.getElementById("username").value;
    let apiKey = document.getElementById("apiKey").value;
    if (!username)
      return (consoleDiv.innerHTML += `<p class="err">[x] Please provide a last.fm username.</p>`);
    if (!apiKey)
      return (consoleDiv.innerHTML += `<p class="err">[x] Please provide a last.fm API key or reload this page (ctrl + r) to use the default key.</p>`);
    consoleDiv.innerHTML += `<p class="succ">[-] Last.fm username and key provided.</p>`;
    consoleDiv.innerHTML += `<p class=succ>[ ] You can now click the minimise button to hide this app and run it in the background, to reopen it or quit, simply right click it in the system tray.</p>`;
    try {
      setInterval(function () {
        updateStatus();
      }, 30000);
    } catch (err) {
      consoleDiv.innterHTML += `<p class="err">${err.message}</p>`;
    }
    consoleDiv.innerHTML += `<p class="succ">[-] Established Discord Rich Presence. Please wait a moment to fetch scrobble data from last.fm.</p>`;
    async function updateStatus() {
      var data = await fetchCurrentScrobble(username, apiKey);
      rp.setActivity({
        largeImageKey: "lfm",
        largeImageText: `${data.playcount} plays.`,
        smallImageKey: data.whenScrobbled ? "playing" : "stopped",
        smallImageText: data.scrobbleStatus,
        details: data.trackName,
        state: `By ${data.artist} | On ${data.album}`,
        buttons: [
          {
            label: `${formatNumber(data.scrobbles)} total scrobbles.`,
            url: `https://www.last.fm/user/${username}/`,
          },
        ],
      });
      updatesDiv.innerHTML += `<p class="succ">[-] Discord Status Updated.</p>`;
    }
  });

  rp.login({
    clientId: "868813214740271135",
  });

  async function fetchCurrentScrobble(user, key) {
    var optionsGetTrack = {
      uri: "http://ws.audioscrobbler.com/2.0/",
      json: true,
      qs: {
        method: "user.getrecenttracks",
        user: user,
        api_key: key,
        format: "json",
        limit: "1",
      },
    };

    var lastTrack = await fetch(optionsGetTrack);
    if (!lastTrack)
      return console.log(
        "An error occured, you may have provided an invalid username or last.fm may be facing issues, retrying in 30 seconds."
      );
    let lastArtist = lastTrack.recenttracks.track[0].artist["#text"];
    let lastTrackName = lastTrack.recenttracks.track[0].name;

    var options = {
      uri: "http://ws.audioscrobbler.com/2.0/",
      json: true,
      qs: {
        method: "track.getInfo",
        user: user,
        track: lastTrackName,
        artist: lastArtist,
        api_key: key,
        format: "json",
      },
    };
    var rData = await fetch(options);
    var data = {
      artist: lastTrack.recenttracks.track[0].artist["#text"],
      album: lastTrack.recenttracks.track[0].album["#text"],
      trackName: lastTrack.recenttracks.track[0].name,
      playcount: rData.track.userplaycount ? rData.track.userplaycount : "0",
      scrobbles: lastTrack.recenttracks["@attr"].total,
      whenScrobbled: lastTrack.recenttracks.track[0]["@attr"],
      scrobbleStatus: !lastTrack.recenttracks.track[0]["@attr"]
        ? `Last scrobbled ${prettyMilliseconds(
            Date.now() - lastTrack.recenttracks.track[0].date.uts * 1000
          )} ago.
        `
        : "Now scrobbling. ",
    };
    return data;
  }
});

window.addEventListener("beforeunload", (ev) => {
  ev.returnValue = true;
});

document.getElementById("minimise").addEventListener("click", () => {
  var dataimg =
    "data:image/jpeg;base64,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";
  if (tray) {
    return win.hide();
  }
  tray = new Tray(nativeImage.createFromDataURL(dataimg));
  const template = [
    {
      label: "Last.fm Rich Presence",
      icon: nativeImage.createFromDataURL(dataimg),
      enabled: false,
    },
    {
      type: "separator",
    },
    {
      label: "Open App",
      click: function () {
        win.show();
      },
    },
    {
      label: "Quit",
      click: function () {
        win.close();
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Last.fm Rich Presence.");
  win.hide();
});

document.getElementById("save").addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let apiKey = document.getElementById("apiKey").value;
  if (username) store.set("username", username);
  if (apiKey) store.set("apiKey", apiKey);
  consoleDiv.innerHTML += "<p class=succ>[-] Settings successfully saved.</p>";
  console.log(store.get("username"));
  console.log(store.get("apiKey"));
});

document.getElementById("load").addEventListener("click", () => {
  document.getElementById("apiKey").value = "615322f0047e12aedbc610d9d71f7430";
  consoleDiv.innerHTML += "<p class=succ>[-] Loaded default API Key.</p>";
});
