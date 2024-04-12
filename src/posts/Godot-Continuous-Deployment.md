---
layout: layout.njk
tags: post
date: 2021-04-20
title: Godot Continuous Deployment from GitHub to Itch.io 
---

#### Automatically build and upload your GitHub-hosted game to Itch.io!

For context, Tanner and I have been working on a 2D game using [Godot](https://godotengine.org/), a game engine that is just a pleasure to work in.

## TL;DR: Here's the [workflow file](https://github.com/SuGar33-Coding/The-Grand-Battle-Arena/blob/1fc2de6ec0d3021f1183e49894a1164e4f1d6c55/.github/workflows/deploy_game.yml)

Some important steps to get this working:
- You have to use butler to [push a build to a channel](https://itch.io/docs/butler/pushing.html) before the automatic Itch.io upload will work. Make sure to use the channel name set in the workflow.
- You need to add BUTLER_CREDENTIALS containing an [API key from your account](https://itch.io/user/settings/api-keys) to your repository secrets (Repo $\rightarrow$ Settings $\rightarrow$ Secrets)
- Of course, you have to replace all the game-specific fields such as
   - ITCH_GAME should be the name of your game that's published on Itch.io
   - ITCH_USER should be your Itch.io username
   - EXPORT_NAME can just also be the (file-safe) name of your game
   - The branch to look for probably won't be `working` and instead something like `main`
   - Make sure to replace the GODOT_VERSION with your proper version and to remove `mono-` and `.mono` if you're using non-mono Godot

Throw that code into a workflow file in your repo and replace the necessary fields to get up and running quick! 
This particular setup is for exporting and uploading a Windows build for download and an HTML5 build for running in the game's Itch.io page (which may not be exactly optimal depending on the kind of game you're making).

# Exporting the game
The first step is to automatically export the game. You can export from the godot cli with the `godot --export` command. Here we use [godot-ci](https://github.com/marketplace/actions/godot-ci) to achieve this. It runs a docker container with links pointing to the proper Godot builds and uses them to export the game in a headless instance of Godot. It also has support for automatically publishing an HTML5 build to GitHub pages, and if you're using GitLab it can even publish straight to Itch.io (but I'm not ¯\\\_(ツ)\_/¯ )!

The exported artifact is then uploaded to the action's local store, allowing you to download and inspect the contents of the export zip files in the action output on GitHub. These can also be used for further processing in another workflow, if desired.

## Alternative action
An alternative action for exporting would be [Godot Export](https://github.com/marketplace/actions/godot-export), which is probably a bit lighter and supports automatically creating releases as well, which is cool.

# Uploading the game
The next step is simply to use the [Butler Push](https://github.com/marketplace/actions/butler-push) action to upload the zips to Itch.io. This one's as straightforward as it seems. You fill in the proper values in the env attribute and it will read in from the repo secret and push to the channel you set up earlier (you set all that up, right).

Viola! Automatic Itch.io builds and uploads. Now it'll be much easier to haphazardly share your incremental progress with friends and Internet strangers.
