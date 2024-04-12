---
layout: layout.njk
tags: post
date: 2020-05-16
title: Stalks Move
---

#### Watch 'em rise. And by 'em I mean my app download count

I quickly fell in love with Animal Crossing: New Horizons. It was exactly the kind of game I was looking for, even before Covid sent everyone into quarantine. There's a system in the game that plays out like a stock market, in which you buy turnips on Sunday for a random price and can sell them at any other point in the week for more random prices. But we know these prices aren't *really* random. They're generated, and they must be generated according to some algorithm with deterministic probabilities. My friends sent me some websites like [Stalks.io](https://stalks.io/) and [TurnipProphet](https://turnipprophet.io/), and seeing these got me thinking about a mobile implementation (besides the already very good progressive web app support). So I decided I'd both learn how to make a native mobile app and learn a bit about how this game works!

## The Algorithm
Not much to say here, all the credit for data mining the algorithm goes to [Ninji](https://twitter.com/_Ninji) and his [gist](https://gist.github.com/Treeki/85be14d297c80c8b3c0a76375743325b) containing the mined code in C++. When I found this I wanted to go through and understand how it worked. Someone even made a [writeup](https://www.reddit.com/r/acturnips/comments/ft42cb/sw_breaking_down_the_stalk_market_a_deep_dive/) explaining the code and posted it to Reddit! But, before I started to dig into this, I noticed that  [TurnipProphet](https://turnipprophet.io/) was totally open-source and used a JavaScript implementation of the data-mined code. Now this is very epic because I've basically only been coding in JavaScript lately, and I remembered hearing about some implementation of React for native mobile app development. All I had to do was whip up a nice looking app and I could easily implement the predictions logic by exporting the output function of the script. I just traced the code backwards starting from the user view, taking note of how each function was used at each stage. This method worked way better than I expected!

## The App
So I dug into [ReactNative](https://reactnative.dev/) to see what it was all about. I watched some tutorials by [Academind](https://www.youtube.com/watch?v=qSRrxpdMpVc&t=4611s), and those got me off the ground real quick. Those guys are awesome. After going through some of their example projects, I started building the basic structure of the app. I had a rough idea of the layout; it was to be simple able to present the predictions in a clean, mobile-readable way.

## The Layout
I wanted some form of central navigation, and I figured with all the modularity that JS is built on, there HAS to be some library for that.

And there were! Many!

I went with [ReactNavigation](https://reactnavigation.org/) per recommendation from the Internet. This has great API documentation and the exact features I wanted with fairly clear implementation. The basic navigation construction is a Stack, in which you push screens to the user as they click around and pop off the current screen to go back to the previous one. Ya know, a stack. The second level of navigation I wanted was a drawer navigator, in which you open up a menu from the side that overlays the whole screen and allows you to navigate on a higher level. I wanted this menu of navigation to be accessible from either a swipe (which is smooth but non-obvious) and a lil hamburger menu at the top.

To maintain my desire for simplicity, I wanted the main screen to have two functions: input data and go to the predictions. So that's what I did. You input your data in fields that take up the whole screen, and you press a big button that takes up the footer of the viewport to go the predictions screen for the data you entered. There are little info buttons for both screens and the hamburger menu on the main screen to let you know the drawer exists. The drawer will take you around the other pages of the app, although the only other one for now is an About screen.

## The Look
Now, React Native is great and all, but I didn't have time to code up all these fields and buttons! I had to get this app out while turnip prices were still hot and relevant (and before someone else made a much better app)! So I applied my JS wisdom and found a library for that too! [NativeBase](https://nativebase.io/) provides some great, uniformly designed, easy-implementation UI elements. The documentation is a little bit dodgy and the usage is a bit restrictive (by design, of coruse), so when I wanted something a little more custom/complex I just made it myself. However, this library did save some time in the long run.

## The Data
The inputs screen (or, main screen) is pretty self explanatory. User data goes in here. The data is saved to local asynchronous storage every time the user types in a value, using React's hooks, and loaded into the fields every time the app starts up the main screen. It's pretty snappy. 

The predictions screen took some thought, as I wanted to present the most useful information for the user in the clearest way. I decided to focus on the probabilities of getting each of the 4 price patterns, and the actual prices/day specific to each pattern. I did this by showing a line graph with the minimum and maximum price color-coded to the pattern that those prices came from. Underneath this graph is a pie graph showing the probabilities of getting each pattern, using the same color-coding. I figured that the two main factors going into whether a user wants to sell today is: what's the chance that my future price will be higher, and by how much? I feel that these two graphs together answer this question fairly well.

I have plans to show the full output of the predictions script in some form, but I don't think it's necessary for effective usage.

## The Code
Wowee there was a lot of trial and error involved. Thankfully, that was made incredibly easy by [Expo](https://expo.io/learn), a framework for developing React Native apps through (lots of abstraction, I know, but it really gets the job done). Expo allowed me to run and update a live version of my code right in my phone over a local tunnel (or even over the Internet, if I wanted to). Neato.

If I had to pick out the worst parts of the coding experience, it would be dealing global(ish) variables and generating the chart.

Everything is running and updating in as real-time as possible in a mobile app, so React Native provides tools for achieving the goal of updating information on the screen in response to user input. Additionally, React's coding paradigm has you break things up into components that are imported and passed around in the app. Components are intended to be heavily nested and to pass data around in a parent-child fashion, but sometimes I wanted data that existed on a more global app-level. This was way harder to achieve than I thought it would be, and isn't really good practice, as I ended up going with a more simple version of this structure after I went through the pain and suffering required to implement global variable-likes. [This](https://dev.to/ryanmoragas/global-state-in-react-2kcp) post saved my sanity. The method contained in that post achieved exactly what I wanted.

Generating the chart was a bit of a bitch cause I had to figure out SVG stuff, since the [library](https://github.com/JesperLekland/react-native-svg-charts) I ended up using was based around this. It wasn't bad, but it just ended up being way more of a rabbit hole than I expected. I'm probably better off for it, since SVG is very powerful and should allow me to implement basically any sort of graphical customization I want. That being said, I still haven't figured out a workaround for SVG text not supporting new line characters. Those AM/PM markers will show up some day.

## The Publication
I rocketed through the publication process as fast as I could. I used some online tool to generate a private policy that I didn't read and hosted it right from this very domain 😮 React Native is great cause it builds native binaries for both iOS and Android. Both builds are automatically configured to accept over the air (OTA) updates which allow me to quickly push updates to Expo's servers and subsequently to anyone using the app, without going through any app store. 

The iOS App Store took some time to process my builds and display them to the public, but the developer interface is VERY nice. TestFLight was also fairly easy to use and I was able to get some friends to test the app out a bit before publishing. Google's developer console is much more feature and information-rich but definitely harder to use. This was compounded by the fact that their documentation is all over the place and there are multiple sources of information for achieving the same task. Sometimes more words in more places is worse than fewer words all in one place. These are my words of wisdom, which you will heed as I am now an App Development Expert (ADE).

## The Upshot
Anyways this was a ton of fun and I finally got to cross "build an app" off my list of software engineering stuff to do. Not only that, but some of my friends are actually getting use out the app. The feeling you get when you see someone, especially someone you don't even know, getting real use and even enjoyment from software that you made is pretty great. Definitely wanna keep chasing that.
