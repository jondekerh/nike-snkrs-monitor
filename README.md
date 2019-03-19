# nike snkrs monitor
This is a lightweight and easy to use script that monitors [nike snkrs](https://www.nike.com/launch/?s=in-stock) for new items and restocks by sizes and posts them to Discord.

**DISCLAIMER:** I've noticed this script has gotten a few stars and forks recently. I feel the need to clarify here that I am no longer actively working on this project since myself and the client who requested it decided to halt progress indefinitely due to technical issues and time constraints. Some of those issues include a problem with duplcate posting and the possibility of bad/fake data being sent by the nike snkrs API that the script pulls from. If you are trying to add to this project and have any questions regarding this feel free to create an issue and I will try to answer them as soon as I can.

# Installation
To use this script you must have [node.js](https://nodejs.org/en/).

Setup:
```
$ git clone https://github.com/jondekerh/nike-snkrs-monitor.git
$ cd nike-snkrs-monitor
$ npm install
```
After installing dependencies you'll need to rename the `RENAME-discord-info.json` file to just `discord-info.json`. This can be done by typing `mv RENAME-discord-info.json discord-info.json` into the terminal. From there, edit the file and replace the placeholder values with your webhook's ID and token. If you don't know how to get those values you can learn more [here](https://github.com/Akizo96/de.isekaidev.discord.wbbBridge/wiki/How-to-get-Webhook-ID-&-Token).

Running:
```
$ node monitor.js
```
That's all you need to type. By default it will scan for changes every 5 minutes. This can be changed by editing the value of refreshDelay, found on line 12 of monitor.js. I recommend using [Linux Screen](https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/) to run it in the background.

Testing:
```
$ npm test
```
Running the tests will also start the script after they are complete.

# To Do
- [x] Add proper tests.
- [ ] Condense all size restocks from the same shoe into one embed.
- [ ] Add Slack support?
- [ ] Add proxy support.

# License
Do whatever you want with this code lol
