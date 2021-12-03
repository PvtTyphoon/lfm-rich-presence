![First Example](https://i.imgur.com/yT17xpS.png)

# Quick Notice

The windows binary in this release is bloated, I am aware of this. Essentially what happened here was that the program was a quick script built to run cross platform, because a friend wanted a UI, I threw it into electron, packaging this obviously was a waste of space.
I'll properly rewrite the UI in something that isnt a scripting language lol, as soon as I get the motivation to actually do anything with my life, sorry for the laziness.

# Last.fm Discord Rich Presence

Your status is automatically updated every 30 seconds and includes information such as your currently playing track, the album it is from, the artist, your playcount for the track, your total scrobbles, a button with a link to your last.fm profile, and when you last scrobbled (if you are currently not listening to music).
You can minimise the window to run in the background and then bring it up again using your system tray.
The UI is minimalistic because I'm not good at designing UIs.

Example status:

![Example](https://i.imgur.com/J35geUW.gif)

![UI](https://i.imgur.com/AcEo3gp.png)

## Installation and usage

You can download a pre-compiled binary for macOS and linux, these are basic node scripts, as well as an executable for Windows with a full fledged GUI, on the releases page [here.](https://github.com/PvtTyphoon/lfm-rich-presence/releases)
This app is only supported for Windows at the moment because I need a $100 license to build for macOS and I do not think compiling for Linux is useful, I use arch (btw) and feel like running a nodejs binary is the simplest way.
Upon running the binary you will be asked for your last.fm username, and a rpc call to the Discord application will be made to establish your rich presence.

### Run as a node.js app

You can clone this repository and modify/run this program as you wish, you will need npm and nodejs installed. Make sure to install the dev dependencies globally.
With apt

```
apt install nodejs npm
```

With pacman

```
pacman -S nodejs npm
```

This should work on any hardware and operating system that is younger than my grandmother Here is a semi-tutorial:

```
git clone https://github.com/PvtTyphoon/lfm-rich-presence
cd lfm-rich-presence/
npm i
npm start
```

## Contribution and issues

You can fork and create pull requests to this repository and I'll review them eventually. This is however a quick and dirty implementation I have not yet spent a lot of time on. Updates will come eventually.
