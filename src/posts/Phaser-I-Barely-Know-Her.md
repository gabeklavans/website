---
layout: layout.njk
tags: post
date: 2019-10-17
title: Phaser? I Barely Know Her!
---

#### Making a video game can't be THAT hard

A couple months ago my room mate and I decided to make a [game](https://github.com/tsbraun1891/GARP.io "GARP.io") a side project. I had already been working on a [Tamagotchi clone](https://github.com/gabeklavans/Tamanotchi "Tamanotchi") web app, so I was ready to put my newfound Node.js/JavaScript skills to the test.

After doing some research on how to actually start this process, we decided we did NOT want to code our own engine from scratch, even if our concept was relatively simple by design. I made the Tamanotchi using [Phaser](https://phaser.io/ "Phaser.io"), a free JavaScript-based engine for running games in the browser. We also decided to use Phaser 2 instead of 3, as 2 had more documentation and seemed to be more feature-rich (3 was still work in progress essentially). Now that we had a starting point, it was time to [delve](https://phaser.io/tutorials/making-your-first-phaser-2-game "Official Phaser 2 Tutorial") into [tutorials](https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/ "Simple Multiplayer Tutorial") and [examples](https://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/ "MMO In Phaser") to model our code after.

### Servin' It Up

![Servin it up](https://media.giphy.com/media/3ohuPpJFjnXeaNwG6k/giphy.gif)  
A lot of tutorials pointed us in the direction of coupling our client-side code in with the server code. This is fine since it's a single-page web app. We set up the server in Node.js using [Express.js](https://expressjs.com/ "Express"). When the user visits whatever site the server is hosted on, we use Express to serve the client-side HTML that contains calls to all the JS written for the game.

## WebSockets

Pretty much every tutorial on adding multiplayer to a Phaser game involved using [Socket.io](https://socket.io/ "Socketio"). This JS library allows for bi-drectional persistent communication between clients and the server over TCP. It defaults to using WebSockets, as that is somewhat of a standard in modern browsers. But, it also has fall-back transportation methods in case WebSockets is not available, while providing seemless connection to the server. This fall-back capablity does add overhead to each packet being sent, but for a game of this scale and a library that is this fleshed-out, I found it worth sticking with (also I didn't really know of the existence of alternatives nor what Socket.io did when I started writing the code... a minor detail) (also it's still just a side project, we need to save time where we can and building out a WebSocket implementation will take more time).

## Multiplayer Logic

Now that we had the communication medium, we had to start sending information between server and client.

### Event-Based Architecture

Another extremely common theme in most of the Phaser multiplayer tutorials was an event-based server architecture. Whenever a player did anything, it would send what it did to the server (for example, its new position after moving or its new velocity) and then in **reaction** to this event, the server would record and broadcast what that player did to all other connected players. The other players would parse this update and reflect it on their respective clients.  
Building upon this architecture, we ran into some issues. We decided against using Phaser's physics for movement, and just sticking with linear velocities in the form of moving a certain amount of pixels for each keypress detected in the game loop. When we only sent "velocities", any sort of delay would put clients out of sync, as there was no authoritative synchronized state. So we switched to sending the absolute position the player was in after the move. This made collision detection more difficult than expected, as the other players and enemies (stored on the server, as they affect all players agnostically) were just sprites that were being shifted around. Players would glitch through other sprites and picking up items would sometimes double-count.

The server we had built was essentially just a messenger. Each client was the authority on its own parameters in the game world, and it just sent up what it thought its state was. This is not great from a game-design standpoint, the most obvious reason being cheating. A user could inject JS and tell the server into thinking their player was doing whatever they wanted it to, regardless of the control flow we set up. Additionally, mixing synchronizing the state and calculating physics in this architecture quickly becomes a pain, as the clients and server have to somehow reconcile all the discrepancies that could be created. The rate of information being received and sent by the server would also grow asymptotically to the rate of the game loop if many players are connected at once, and the amount of data sent in each tick would also grow.

### Tick-Based Architecture

The tip of this iceberg for me was a Phaser Multiplayer tutorial that sent information on a tick instead of based on events. On a fixed rate, their server would just bundle up the changes made to the state since the last tick, send that to all the clients, and the clients would parse the changes and update. This sounded great! So we implemented this architecture from our understanding of the concept. This meant we ended up sending the WHOLE state on each tick, since we forgot about/didn't see the importance of only sending changes. By this point I was able to fudge collision of sprites a bit and even implement an aggro system where enemies would detect a nearby player and start moving towards them. All of the enemies' parameters were stored on the server, including whether the player was in aggro range and which player the enemy was aggroed onto. This all worked fine, but now the game was running *incredibly slow*; even my desktop was having trouble with it sometimes. This was likely due to the fact that I was spamming the WebSocket 60 TIMES a second with the entire game state. My reasoning was to match the frame rate of the client, but apparently this rate was not common at all. We were missing a couple of huge concepts in multiplayer game architectures that we would not discover until after our summer dev hiatus and a reinvigorated ***Extreme Research Session***.

### Server-Authoritative Tick-Based Architecture

This is the architecture we have landed on for continuing the development of the game, for the time being. A key concept that I had missed was the fact client-authoritative structures enable cheating from the client side and can make synchronization fairly complex. The solution is to run the game loop on the server and have each client running a parallel loop solely for predicting what will happen on the server based on the inputs sent by the player. Ultimately, the server will be the authority on what is going on in the game, and the changes to the state will be sent on a tick to *everybody*. HOW exactly we are going to implement this... that's a story for another blog post (more accurately, a post made after we actually have it figured out...)
