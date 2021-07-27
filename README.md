![First Example](https://i.imgur.com/yT17xpS.png)
# Last.fm Discord Rich Presence
Your status is automatically updated every 30 seconds and includes information such as your currently playing track, the album it is from, the artist, your playcount for the track, your total scrobbles, a button with a link to your last.fm profile, and when you last scrobbled (if you are currently not listening to music).
You can minimise the window to run in the background and then bring it up again using your system tray.
The UI is minimalistic because I'm not good at designing UIs.
![UI](https://i.imgur.com/AcEo3gp.png)

Example status:

![Example](https://i.imgur.com/GhWfiUu.gif)

## Installation and usage
You can download a pre-compiled binary for macOS and linux, these are basic node scripts, as well as an executable for Windows with a full fledged GUI, on the releases page [here.](https://github.com/PvtTyphoon/lfm-rich-presence/releases)
Upon running the binary you will be asked for your last.fm username, and a rpc call to the Discord application will be made to establish your rich presence.

### Run as a node.js app
You can clone this repository and modify/run this program as you wish, you will need npm and nodejs installed. 
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
