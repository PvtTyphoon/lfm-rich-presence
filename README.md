![First Example](https://i.imgur.com/L0T07FC.png)

# Last.fm Discord Rich Presence

Your status is automatically updated every 30 seconds and includes information such as your currently playing track, the album it is from, the artist, your playcount for the track, your total scrobbles, a button with a link to your last.fm profile, and when you last scrobbled (if you are currently not listening to music).
You can minimise the window to run in the background and then bring it up again using your system tray.
The UI is minimalistic because I'm not good at designing UIs.

Example status:

![Example](https://i.imgur.com/dykvrTD.gif)

![UI](https://i.imgur.com/AcEo3gp.png)

# Installation and usage

You can download a pre-compiled binary for macOS and linux, these are basic node scripts, as well as an executable for Windows with a full fledged GUI, on the releases page [here.](https://github.com/PvtTyphoon/lfm-rich-presence/releases)
This app is only supported for Windows at the moment because I need a $100 license to build for macOS and I do not think compiling for Linux is useful, I use arch (btw) and feel like running a nodejs binary is the simplest way.
Upon running the binary you will be asked for your last.fm username, and a rpc call to the Discord application will be made to establish your rich presence.

## Running as a node.js project

If you want to run this as a simple node.js script, you can do so by downloading the script [Here](https://gist.githubusercontent.com/PvtTyphoon/ec8316e655992d37fdef1479803fb01e/raw/c248aff479e3da7139335c56c6f9c4fd97f029b7/main.js).

CLI instructions.
First download the script into the folder you want to save it in. This example will assume you're using `wget`.

```bash
wget https://gist.githubusercontent.com/PvtTyphoon/ec8316e655992d37fdef1479803fb01e/raw/c248aff479e3da7139335c56c6f9c4fd97f029b7/main.js
```

Then install dependencies, you will need node.js and nom installed.

```bash
npm i discord-rpc request-promise pretty-ms
```

To run the script, use `node`.

```bash
node main.js
```

This will prompt you for your username, you can also edit the script itself to include your username.

```diff
-   const username = await prompt(
-    "Type out your last.fm username and then hit enter: "
-  );
+   const username = "Your-username-here";
```

You can then set this script to run on startup.

## Contribution and issues

You can fork and create pull requests to this repository and I'll review them eventually. This is however a quick and dirty implementation I have not yet spent a lot of time on. Updates will come eventually.
