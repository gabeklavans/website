---
date: 2025-05-14
title: The Year of the Linux Desktop will be Distroless
---

Every now and then I see blog posts[^1] lamenting Linux Desktop experiences. Some lovingly and some with genuine frustration and disdain. When I read these, I tend to feel emotions ranging from mutual frustration to the desire to offer help. The help often takes the form of “it’ll work if you use X!” or “try starting from scratch, the defaults are much better now!” which I’m certain everyone writing blog posts about Linux have heard a thousand times by now. I then quickly realize that everyone has different goals and needs when setting up a Linux desktop, so it’s kind of a futile effort to offer generic, default-based help. I figured this is just the way FOSS desktop computing is and sometimes people just need at least a little case-specific help to get things up and running.

In my view, this pitfall is the main roadblock in the way of Linux from taking off as a major contender for widespread desktop adoption.

However, I have a feeling that “distroless” desktop images will change this reality in the near future.

Distroless is a concept relating to containers. [The idea](https://www.docker.com/blog/is-your-container-image-really-distroless/) is to slim the contents of a container down to only the minimum components needed to serve the intended functionality. The [universal blue](https://universal-blue.org) (ublue) project has taken the term in a new direction (it might actually be unrelated to the prior meaning but I figured it was worth mentioning) and is applying it to the desktop as a whole. The practice utilizes emerging and increasingly stable tooling for building and running bootable container images[^2] that aren't tied to any specific suite of apps or settings. They're essentially cutting out everything that makes a distro a "distro" and offering building blocks to layer in reproducible functionality, just like we do with container images for software now. One of my personal favorite aspects of bootable containers and atomic desktops is that with a single command, anyone helping you troubleshoot your system can know the exact base state of your system, since it's unchangeable and consistent for everyone else using that image. I feel like this has the potential to supercharge community assistance efforts and massively stabilize desktop functionality. The days of losing audio output, webcams not working, and network interfaces acting up may be fully coming to a close.

If the ublue project continues on its trajectory, problems may arise that sound very familiar to the desktop incumbents (Windows and macOS). Problems like bloated base feature sets to accommodate every possible user, large and frequent updates, and over-opinionation. However, it's all still Linux, and the concept of distroless empowers flavors and spins that can serve pretty much any group of people with a shockingly out-of-the-box experience. As the core tooling evolves and matures, I really believe that desktop Linux will thrive under this new paradigm.

**So get out there and go check out a ublue image in a VM!** The more tinkerers that use it and contribute to the user experience, the faster the whole thing can become "average user ready".[^3] Ublue [likes to openly share rough user counts and stats](https://universal-blue.discourse.group/t/just-how-many-of-us-are-there/6852) so you can see how many other people are trying things out along with you.

That's the important part of what I want to get across, but I've written about my personal experience transitioning to and daily driving ublue images, if you're interested.

## My Experience

Now, when I first came across ublue and the images that build from it like [bazzite](https://bazzite.gg), I initially rolled my eyes at the terms used like “cloud native” and “atomic” and passed on it all. I assumed it was just some new experimental niche project. I’ve fiddled with [immutable](https://itsfoss.com/immutable-distro/) (Fedora brands them as [atomic](https://fedoramagazine.org/introducing-fedora-atomic-desktops/)) desktops before. I was put off by the tooling and didn’t see enough benefit to actually switch my main machine to something atomic. I don’t [yell at clouds](https://knowyourmeme.com/memes/old-man-yells-at-cloud) and I absolutely love containerization but I also know that “the cloud” is quite a common buzzword for tech marketing.

Things changed while I was hanging out in a Discord server and someone mentioned that they’d been using bazzite for a while now as their daily driver. I thought, well, bazzite is some gaming focused distro right? That seems silly to rely on for general-purpose tasks. But I had just finished having a good conversation with this person so I gave it another really good look. Within an hour or so, I was convinced that I needed to try this as soon as possible.[^4]

To avoid major disruptions, I ran bazzite in a VM in my main desktop for about a week before fully switching over. Every time I did some task, I tried that same task out in parallel in the VM to see how my workflow would change. My biggest concern was development and software tooling, since that’s half of what I do with my desktop. Within a day or so I found myself just doing entire development cycles inside the VM, not really missing a beat. This was thanks in large part to tips provided by the [bazzite documentation](https://docs.bazzite.gg/). The read-only filesystem necessitated that I make some changes to my workflows, but these changes honestly excited me. I quickly recognized that my computing environment was more organized and that I was avoiding behaviors that could be bad for the long term health of my desktop. It helped that I’m already a big proponent of flatpaks and have years of experience [distro-hopping](https://en.wiktionary.org/wiki/distro-hopping)[^5] without losing my personal data in the process.

Once I installed bazzite on my bare-metal hardware, I was immediately delighted by all the little community-lead bells and whistles I found at my disposal. One such tool is [ujust](https://docs.bazzite.gg/Installing_and_Managing_Software/ujust/), which is a collection of helper scripts that can do things like configure your system or run maintenance tasks. Not only did they make my life easier in setting up my desktop, but they exposed me to some of the features I had available to me right out of the box with no modification, such as [distrobox](https://distrobox.it/) assembly from a config file.

Fast-forward to today: I daily drive bazzite [desktop](https://docs.bazzite.gg/General/FAQ/#1-desktop-edition). I have my home theater mini PC running the “[handheld](https://docs.bazzite.gg/General/FAQ/#2-bazzite-deck-edition)”[^6] version of bazzite that boots directly into the controller-friendly Steam UI. My Framework laptop runs Aurora developer edition, providing me with an up-to-date, stable dev system despite my infrequent use of laptops. I’m planning out my move to [uCore](https://projectucore.io/) for my home server/NAS box. The whole experience has been very pleasant, and I’ve been able to work several things out before and after installation with some help from people in the ublue Discord.

I'm excited to see where these projects take me!

[^1]: [I Want to Love Linux. It Doesn’t Love Me Back](https://fireborn.mataroa.blog/blog/i-want-to-love-linux-it-doesnt-love-me-back-post-1-built-for-control-but-not-for-people/), I had others in mind but I can't find them now :(

[^2]: [Fedora Atomic intro](https://docs.fedoraproject.org/en-US/fedora-kinoite/#introduction), [bootc](https://github.com/bootc-dev/bootc), [composefs](https://github.com/composefs/composefs)

[^3]: To be fully transparent, I don't think any of the major ublue images are ready to widely recommend over distros like Mint or Debian. Those are just so stable/mature. I still feel like I need some technical experience to really make these atomic desktops shine, but they require way less tinkering than I've ever needed in other desktops. I think ublue or similar images can reach "blanket recommendation" at an unprecedentedly rapid pace.

[^4]: I’d like to point out just how nice the [bazzite website](https://bazzite.gg) is. It’s rare that a website is cool/pretty enough to have an affect on my opinion of something, but they did a great job with this one!

[^5]: Yes, I found a wiktionary entry for this. Every other reference to “distro-hopping” was some longish blog post or article so I figured this was just the best way to get the idea across…

[^6]: Look at all this amazing documentation I’m linking to. I just love that.
