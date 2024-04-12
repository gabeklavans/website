---
tags: post
date: 2019-08-20
title: Bash my Head Against a Wall
---

#### Couldn't think of a better pun

There's a server in one of our makerspaces. A dinky desktop computer shoved into a server rack, but running Ubuntu Server nonetheless.
I was able to get the root user login and password from one of our graduating seniors before he went off to flex his pent up CS prowess. I was traveling with the [Spartans DBC](https://spartansdbc.org/ "Spartans Drum and Bugle Corps") for the summer, but I was eager to start tinkering with the server, so I whipped out my iPhone and started messaging my buddy [Julius](https://www.linkedin.com/in/juliusfrost/ "Jules") since he was on campus. The server is only accessible via devices with authorized SSH keys, so I fired up [Termius](https://termius.com "Tunneling on the go") and generated an SSH key for Julius to put into the server from the terminal at the makerspace. That's when we started running into problems.

## `authorized_keys`
By default, giving someone access to a user on a Linux server is as simple as pasting their public key into the `authorized_keys` file. This is normally located in `~/.ssh/authorized_keys`. I already have an account on the server and my laptop was authorized to login. I figured I'll just put my phone's pubkey into my file and bingo,  
![I'm in](https://thumbs.gfycat.com/LightheartedObviousBlowfish-size_restricted.gif)  
*I'm in*.

Well I was *not* in. There was no `.ssh` folder in my user's home directory. Odd. Creating an `authorized_keys` file didn't work. Using the `find` command I found the `authorized_keys` file, except it was a directory and it was in `/etc/ssh`. Turns out this is where config for key auth is. The admin created an `authorized_keys` folder, gave each user their own key file in there, changed the logic in `sshd_config` for searching for keys (specifically, to `/etc/ssh/authorized_keys/%u`, which was pretty cool), and then just *forgot* about it. No sweat though, I learned a lot about key auth. Putting my key in my respective user file allowed me to be  
![I'm actually in](https://thumbs.gfycat.com/LightheartedObviousBlowfish-size_restricted.gif)  
*actually in*.

However, now it was time to deal with the fact that every time I tried to tab complete anything (which I **frequently** do) it was yelling at me for the disk being full and being unable to create a temp file.

## This was really annoying

So yeah, the drive was totally full. Couldn't create any new files. A `df` showed the mounted disk at 100% used capacity. I had Julius attempt to run `du -h | sort -h` from root to list all the directories and their human-readable sizes sorted by size, but there wasn't enough temp space to comb through the whole disk. So I found this command on stack overflow, `du -cha --max-depth=1 / | grep -E "M|G"` which would show sizes for all directories and files and their totals, but only those that are in the megabytes or gigabytes. Adding a sort and going 3 levels deep revealed that 97% of the usage was coming from a user named `bitcoin`. Classic.

Basically all of the imposing files were in a folder called `blocks`. A little bit of googling told me that this server was probably originally set up to be a [full node](https://bitcoin.org/en/full-node#linux-instructions) for Bitcoin. That would explain why the computer was named "fullnode." :grimacing:

Deleting the entire Bitcoin block chain felt like taking a breath of fresh air. I attempted to figure out what you're supposed to do with a `wallet.dat` 'cuz I assumed there might be some value in Bitcoin or something in there, but every solution seemed fairly convoluted. I tried some [python-based wallet importer/exporter](https://github.com/jackjack-jj/pywallet "Pywallet") but the walletdump had a bunch of scary errors in its output so I gave up on that. Maybe I'm rich, who knows.  
<font size="2.5">Probably not.</font>

## Remote pseudo root access

Great, the drive has space and I'm in from my phone. But I can't do anything cause I don't have sudo privileges. In all my wisdom I decided to resort to relaying my desires to Julius and having him execute commands from the root terminal. After a painful hour of this I realized I can just give my user sudo privileges since, hey, it's basically our server now. Running `usermod -aG sudo gabe` on the root and reconnecting did the trick.
