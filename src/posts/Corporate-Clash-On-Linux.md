---
date: 2023-03-15
title: Running Corporate Clash on Linux
---

#### Bottles Makes it Easy

[Corporate Clash](https://corporateclash.net) doesn't have an official Linux build, so here's how I get it running on any of my Linux machines with little effort.

## Install Bottles from Flathub

I've found [Bottles](https://usebottles.com/) to be the most user-friendly and general-purpose solution for running Windows apps in Linux via [WINE](https://www.winehq.org/). Bottles [officially distributes builds](https://usebottles.com/download/#) on Flathub, so you can easily install it via `flatpak` on whatever Linux distro you're running.

## Download the Corporate Clash Windows Executable
You can get it from [here](https://corporateclash.net/play).

## Set up a Bottle for Corporate Clash

Open up Bottles to get started.

### Create a new Bottle
Click the "+" in the top left of the Bottles main screen to create start creating a new Bottle. Selecting the "🎮 Gaming" environment will set up the Bottle for playing Windows games with no config needed, so go ahead and do so. Make sure to also give the Bottle a name.

## Run the Corporate Clash Installer in your Bottle
Once the Bottle has been created, click on it to go to its settings menu. There, you can hit the big "Run Executable..." button to open a file browser and select the Corporate Clash installer exe that we downloaded earlier. You may get a popup about sandboxing, you can ignore that since your downloads folder should be accessible by default.

Once you've selected the Corporate Clash installer, the installer should open up in a Windows-looking window. You can proceed as normal until the launcher has successfully opened.

That's basically it! If you close the launcher and go back to your Bottle, you should see an entry right under "Programs" for the launcher, and you can hit the play button on the right to open the launcher. Mine was called "new_launcher" by default, but you can rename it using the 3-dot menu. This is the name that will be used when you add a desktop entry.

## Further Configuration

Speaking of desktop entry, you may notice there's an item in the 3-dot menu to "Add Desktop Entry". Doing so will make it much easier to open the game, as it will add the launcher to your desktop environment's apps list. It can be quite annoying to have to open up your Bottle every time you wanna play.

If the desktop entry doesn't show up after you first try to add it, or you get some error, check out [this page](https://docs.usebottles.com/bottles/programs#add-programs-to-your-desktop), as you might need to configure some permissions or create a folder.
