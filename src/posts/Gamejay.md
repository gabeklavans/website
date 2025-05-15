---
date: 2024-09-01
title: the making of GameJay and Word Hunt Online
---

My partner got me into playing Word Hunt through the popular iOS iMessage games app GamePigeon. If you aren't familiar, Word Hunt is basically just Boggle, which is a game where you have to find words in a 4x4 grid of randomly generated letters under a certain time limit. The game board kinda looks like this:

|     |     |     |     |
| --- | --- | --- | --- |
| p   | e   | e   | i   |
| o   | t   | s   | s   |
| r   | e   | d   | i   |
| e   | h   | t   | n   |

Anyway, I eventually went on a crusade to move all the people I communicate with onto a chat platform called [Telegram](https://telegram.org/). This was for a plethora of motivations, some of which are no longer valid or were negated by some minor enshitification on the platform as of 2025 (don't pay too much attention to the post's date) but that's beside the point. I wanted to text my friends via Telegram but I wanted to keep playing Boggle. I mean Word Hunt. Simple problem, simple solution.

## a complicated solution

So Telegram has a rudimentary [gaming platform](https://core.Telegram.org/bots/games) where bots can serve up little games within a chat. I couldn't find any pre-existing games that implemented Word Hunt (or any games, really, for that matter. the platform was not too popular), so I decided to just make it myself. I also figured that I might as well set up my bot to be able to replicate _all_ the GamePigeon games at some point. I basically wanted to make a clone of GamePigeon. Telegram is blue and... blue jays are a commonly considered flavor of jay, so... GameJay.

### building a games platform as a bot

A "game" to Telegram is just a web app hosted elsewhere that reports back some info as rounds of the game are played. A single bot can serve several games via Telegram's API. They even allow for implementing a sort of searching functionality built right into the chat box. It felt natural to design GameJay to host all sorts of clones of popular chat-app games, including billiards, checkers, and mini-golf.

The goal is for GameJay to eventually become an abstract logic layer that can facilitate any game with a minimal set of attributes. However, what I did _not_ want to do was fully plan out the infrastructure needed to support every game that I’d want to eventually make before I even started coding. So, I kept the goal of future-expandability in mind as I worked on Word Hunt Online (WHO), but focused first on getting WHO working as a proof of concept. My hope was that, once all the back-end pieces for WHO were in place, adding a second game would flesh out many of the things I didn't account for in terms of supporting other kinds of games. Thus, GameJay would logarithmically approach the fully desired flexibility as I kept adding games.

![a line graph with "flexibility" on the vertical axis and "number of games made" on the horizontal axis and a curved line growing vertically very quickly at first then evening out as it gets closer to a dotted horizontal line labeled "the good enough threshold", approximating a linear growth curve that approaches "the good enough threshold" at the limit](/img/howithoughtthiswouldgo.svg "a visual representation of how i thought the back-end maturity would progress")

Given that I haven't started on a second game yet, I'd say I'm sticking to the vision pretty well so far.

## Word Hunt Online

I started thinking about the hard parts of making this game so I could tackle them first and figure out what I could and could not do with WHO. The first step was fully familiarizing myself with Telegram's games API. The biggest problem (besides the fact that I had to make time to program all this) was that the gaming platform was pretty basic: it only accepts scores and only keeps track of high scores. The rest of the game is instructed to be an instance of a front-end web-app that eventually sends the player’s score. The games from Telegram’s standpoint don’t have any concept of turns or rounds or even multiplayer interaction. That poses a problem for Word Hunt, where players go head-to-head and each game has its own winning score. All-time high scores don’t mean much since they are entirely dependent on the randomly generated boards. But I would be damned if I didn't have my Word Hunt so I came up with

### a workaround for scoring

The actual score that each player achieves for a particular round of a game is not the score that I send to Telegram. If I did send the actual score, no one would be able to easily keep track of who won a round if they scored below the highest scores for that game’s leaderboard.^[Leaderboards are unique for every chat. This is how Telegram’s scoring backend works automatically.] There would also be no way to notify users of who was the winner. So instead, I treat the scores stored in Telegram as the number of wins achieved by that player. This way, as soon as more than one player gets a score for a round, the winner amongst all currently scored players can be determined. Telegram automatically sends a notification to the chat when a new “high-score” (in our case, a new maximum number of round wins) is recorded. This means that a notification will _only_ be sent for the player with the most wins in the chat, but that’s better than no notifications at all. We'll come back to notifications. 
All that logic functioned pretty well after a LOT of edge-case-catching. It was a bit tricky because I wanted to handle having

### multiple players in one game (and other added features)

While making WHO I decided that I wanted to actually improve on GamePigeon's version of Word Hunt. One massive improvement is to allow every member of a chat to participate in the same round of a game. In GamePigeon, only the first two chat members to click on the game notification get to play. Handling this turned out to be easier than expected. I just had to re-calculate the winner whenever a new player finished their round in the game, and allow the round to persist for some time (3 days, for now) so people had a chance to take their turn. This can create an exciting scenario where someone has the opportunity to "steal" a win from a player who currently holds the highest score in a round. After smashing several more edge-cases, the feature was working.

When a player finishes a round, they’re shown a results screen where they can see all the words they found, lined up against the words and scores of every other player in that round. I'm pretty proud of the UI for this screen; it's simple and effective at presenting the information, in my opinion. I reached this design after a few iterations with feedback from friends. This screen updates every couple seconds with the results of other players' rounds, both in-progress and completed, so you can nervously watch their scores creep towards yours.

### integrating with Telegram

Integrating back to the Telegram app and the device itself required a lot of creative thinking since, as I mentioned, the games API was pretty basic. I didn't have access to any device features like haptics, native UIs, and system notifications. All my ideas for sending notifications through Telegram just ended up feeling like bot spam. But I think I implemented a minimum set of features to make things flow smoothly enough for the game to be worth repeatedly playing.

I wanted a way for users to quickly see who won a game and by how much without having to actually leave the chat screen. Thankfully, there exists pretty robust support for editing messages sent by bots (made INCREDIBLY accessible by the [grammY](https://grammy.dev/) library, _huge_ shoutout to that project), so I was able to utilize that. The placements (1st, 2nd, etc...) are shown as buttons below the game's message in the chat, and pressing a button shows the score that player received. I initially had the scores in the buttons themselves, but I got feedback that seeing the score that another player achieved in a game before you even see the board was intimidating/off-putting.

### the actual game

I made the game itself in [Phaser](https://phaser.io/) because I made a few things with it before and it felt like the simplest way to make any sort of multi-faceted UI in a website. It may feel like overkill for a game made of squares with letters in them and a single flow to the results screen, but I was not about to figure out how to do all that in pure HTML/CSS/JS nor learn another JS framework so, Phaser it is. Phaser is also just very cool.

Figuring out the UX was fairly straightforward, made easier by great feedback from my friends. The hardest part of the UI was the dragging interaction to make words. The dragging feel took a couple iterations to pin down. It had to be smooth and forgiving enough to remain accurate while the player quickly tried to match words. I tried to achieve this by rounding out the hitboxes of the tiles a bit and having some forgiving out-of-bounds checking as long as the press event is held.

![a screenshot of the current WHO UI with octagonal hitboxes around each letter-tile drawn on screen for debugging purposes](/img/who-debug.png "a screenshot of the WHO board with debug lines turned on")

The most involved technical challenge was figuring out how to generate a board and get all its valid words. I started by trying to do it all from scratch. I ended up going down a git of a rabbit hole, trying a naive solution of a recursive search through a board of randomly generated letters to find all chains of 3+ letters that are found in [SOWPODS](https://scrabbleplayers.org/w/SOWPODS). I did end up getting this working using some [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) approach, but that unsurprisingly turned out to be way too slow. After doing more research into ways to solve the problem of finding all valid words given a 2-D array of letters (that's what a Boggle board is, after all), I came across the [trie](https://en.wikipedia.org/wiki/Trie) data structure. It provides very specific algorithmic benefits for the problem of finding valid words in lists of letters, and is in fact [used](https://github.com/eeshugerman/BoggleSolve) in [many](https://github.com/bilash/Boggle-solver) Boggle [solvers](https://www.danvk.org/wp/category/Boggle/page/4/index.html). Including the [one I ended up using in this game](https://github.com/pillowfication/pf-Boggle/blob/bfe81ba0ddacaa9988e754fbf56e8686e57df6b1/src/base-solve.js#L3)! At first I tried to implement it myself for fun, but I just couldn't wrap my brain around how it was used to efficiently track word chains. I eventually gave up and found a library to do it for me. But it was a good mental exercise!

After implementing the libraries, testing the logic of the functions, and [thoroughly wrestling with JS modules](https://stackoverflow.com/q/72070017/10247638), the core game functionality was done.

### the user experience

Then came coding up the interface of the game. I think the most interesting thing I had to cook up for this part was how to track "chains" of letters and display if the currently built chain contained a valid word or an already-found word. Basically I just had to create a [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) for tracking the current chain status and handle all the events that could transition its state. In retrospect, I probably would have spent way less time hacking away at this if I had drafted up an FSM for it to start with, but I was more interested in just charging forward until I ended at a satisfactory solution.

There were some aspects I had to fiddle with, such as handling traversing to letters already in the chain, matching duplicate words, and dragging outside the board, all while keeping in mind the golden rule of game design:

#### always forgive the player

I actually don't know if people phrase it like that, but I know I stole the idea from somewhere. Basically, do everything you can to give the player the best chance of reaching a successful state. Make their hurtbox a little smaller, let them scramble up a ledge they otherwise may have just barely missed, and let them keep their chain going even if they drag outside the board, as long as the next tile is valid. I even did a little math to enable this:

```typescript
const isTileReachable =
    lastTileInChain &&
    Phaser.Math.Distance.Between(
        lastTileInChain.row,
        lastTileInChain.col,
        tile.row,
        tile.col,
    ) <= Math.sqrt(2);
```

## GameJay

My process for ensuring GameJay worked as a generic games back-end was so iterative and test-driven that I can't even really remember all the twists and turns I took to get it into its current state. I remember spending a _lot_ of time on the logic for determining which player was the winner of a particular game of WHO and how to recalculate the "scores" with any number of players finishing at arbitrary times. I basically turned Telegram's rudimentary high-score-storing API into an incremental database. And I did it for free!

I tried to preemptively use generic concepts when supporting WHO features, like implementing the idea of "turns" even though every player in a WHO game only technically gets one turn. Or when to consider a game "complete" even though anyone can take their turn in a WHO game at any point that the game is valid.

### persistence

As I explained, Telegram's game API was providing all the storage I needed to make WHO scoring meaningful. As such, I opted to just not have GameJay itself store anything. It would be awesome to record things like scores between Telegram users across different chats (since Telegram's built-in scores are per-chat), or achievements like highest scoring word, highest scoring game across all chats, etc. However, that would not only require hosting my own database, but also would require implementing a UI to actually access this data. So I opted to forgo features like that for now in favor of simplicity and getting a working game.

As for the games themselves, they did require some in-memory state to be stored for some amount of time so that people could join a game that was started some time in the past. I could store all that in a database, but due to the motivations mentioned prior, I decided to just keep all games in memory and clean up old games after a certain expiry period. To keep the code simple, this expiry gets checked whenever a new game is created or an existing game is joined. I don't care about lingering games if there's no activity to push the memory usage one way or the other, so I think this method works well.

Keeping everything in memory could very well bite me later on, but only if the games see enough activity. I already put a somewhat arbitrary limit on the number of games that can exist at a time, but that's certainly a bridge not worth crossing until I get there.. or something.^["Walk a man across a bridge, and he'll have dealt with one problem. Teach a man to cross bridges, and he'll deal with problems for life."]

### hosting

I needed some way to host the game that was more stable than my home server. WHO is just a static webpage so I can host that just about anywhere. I started with [GitHub pages](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/Using_GitHub_pages) and eventually moved to [Cloudflare pages](https://developers.cloudflare.com/pages/) cuz of the vibes maybe. [DigitalOcean's app platform](https://www.digitalocean.com/products/app-platform) was my first thought for where to host GameJay itself, so that's what I went with. $5/month ain't bad. That did require me to [containerize](https://docs.docker.com/get-started/workshop/02_our_app/) GameJay, but I was gonna do that anyway because I love containers.

I want to move to a more eco-friendly hosting provider, such as [GreenGeeks](https://www.greengeeks.com/) or something from [this directory](https://www.thegreenwebfoundation.org/tools/directory/) that I found while searching for eco-friendly hosting providers. Funny enough, Cloudflare is in that directory, but I'm not sure how much effort they put into being green while also running one of the largest network infrastructures in the world. Due to pricing and convenience, I'll likely wait to make the move until I first start to see some meaningful traffic.

## Looking ahead

As I said before, the goal for GameJay is to host all kinds of little chat games (GamePigeon clones). Creating WHO wasn't _too_ much effort, and now that I have a lot of the groundwork laid out, adding more games should be much less of a daunting task. I can get fancy by adding real-time interactions using web-sockets and lobby systems, as well as more complex UIs. I can do this on a game-by-game basis, since they are all stand-alone web-apps. Other devs can even make games for the platform as long as they conform to GameJay’s REST API! I do plan on publishing a spec for the API once it’s in a more mature state.

If I do end up implementing some sort of GameJay-wide storage, I'll likely want to develop a pluggable UI system for displaying common stats across games, or just integrating it into Telegram's chat interface, since you can do some pretty [fancy stuff](https://grammy.dev/plugins/menu) in there.

### Telegram mini-apps

Those of you who are well-informed are probably seething at my failure to mention Telegram's newer [mini-apps API](https://core.Telegram.org/bots/webapps). I wouldn't blame you, since this is literally just the games API but supercharged. It provides access to hardware features like notifications and [haptic feedback](https://core.Telegram.org/bots/webapps#hapticfeedback), allows you to make complex menus for the bot itself that integrate perfectly into Telegram's UI, and just gives much more freedom in general for what can be accomplished by the underlying web-app.

Well, all that came out after I had finished like 80% of GameJay + WHO. I was filled with a large mixture of emotions while reading the announcement of mini-apps...

Converting GameJay to a mini-app is absolutely in my plans, but for now I'm satisfied with what I've accomplished so far using the games API.

Now stop reading so dang much and [go play](https://t.me/gamejaybot) some Boggle I mean Word Hunt I mean Word Hunt Online.
