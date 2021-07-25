const rpc = require("discord-rpc");
const rp = new rpc.Client({
	transport: "ipc",
});
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
const { stdin, stdout } = process;
function prompt(question) {
	return new Promise((resolve, reject) => {
		stdin.resume();
		stdout.write(question);
		stdin.on("data", (data) => resolve(data.toString().trim()));
		stdin.on("error", (err) => reject(err));
	});
}
const apiKey = "615322f0047e12aedbc610d9d71f7430";

rp.on("ready", async () => {
	const username = await prompt(
		"Type out your last.fm username and then hit enter: "
	);
	console.log("Connecting.");
	setInterval(function () {
		updateStatus();
	}, 30000);
	console.log("Discord rich presence established.");
	async function updateStatus() {
		var data = await fetchCurrentScrobble(username);
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
					url: `https://www.last.fm/user/${data.user}`,
				},
			],
		});
		console.log(`Discord status updated.`);
	}
});
rp.login({
	clientId: "868813214740271135",
});
async function fetchCurrentScrobble(user) {
	var optionsGetTrack = {
		uri: "http://ws.audioscrobbler.com/2.0/",
		json: true,
		qs: {
			method: "user.getrecenttracks",
			user: user,
			api_key: apiKey,
			format: "json",
			limit: "1",
		},
	};

	const lastTrack = await fetch(optionsGetTrack);
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
			api_key: apiKey,
			format: "json",
		},
	};
	const rData = await fetch(options);
	const data = {
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
