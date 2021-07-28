const { remote } = require("electron");
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

new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex("#202225"),
  minimizable: true,
  maximizable: false,
  menu: null,
  hideWhenClickingClose: true,
});

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
  if (tray) {
    return win.hide();
  }
  tray = new Tray("build/icon.png");
  const template = [
    {
      label: "Last.fm Rich Presence",
      icon: "build/miniicon.png",
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
