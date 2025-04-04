---
date: 2024-09-01
title: the making of GameJay and Word Hunt Online
---

A couple of my friends got me into playing word hunt through the popular iOS iMessage games app GamePigeon. If you aren't familiar, word hunt is basically just boggle, which is a game where you have to find as many 3+ letter long words in a 4x4 grid of randomly generated letters. The game board kinda looks like this:

|   |   |   |   |
|---|---|---|---|
| p | e | e | i |
| o | t | s | s |
| r | e | d | i |
| e | h | t | n |

Anyway, I eventually went on a crusade to move all the people I communicate with onto a chat platform called [telegram](https://telegram.org/) for a plethora of motivations, some of which are no longer valid or are counteracted by minor enshitification on the platform as of 2025 (don't pay too much attention to the post's date) but that's beside the point. I wanted to text my friends via telegram but I wanted to keep playing boggle I mean word hunt. Simple problem, simple solution.

## a complicated solution

So telegram at the time had a rudimentary [gaming platform](https://core.telegram.org/bots/games) where bots (software-controlled users) could serve up little games that were just wrappers around web-apps that sent a score back to the telegram servers once the game was finished. I couldn't find any pre-existing games that implemented word hunt (or any games, really, for that matter. the platform was not too popular) so I decided to just make it myself. I also figured that I might as well set up my bot to be able to replicate _all_ the GamePigeon games at some point as a sort of mirrored gaming platform for telegramdoes the name make sense now i hope you found it funny.

### building a games platform as a bot

A "game" to telegram is just a web-app hosted elsewhere that reports back some info. A single bot can serve up several games via telegram's API. They even allow for a sort of searching functionality for bots that support it built right into the chat box. It felt natural to design GameJay to host all sorts of clones of popular chat-app games, including 8-ball and shuffleboard-esque games. 

What I did *not* want to do was fully plan the infrastructure to support every game I'd want to make up front. So instead, I just kept the goal of future-expandability in mind as I implemented every back-end feature that I'd need to support Word Hunt Online (WHO) specifically. Once that was all in place, the hope was that adding a second game would flesh out all the things I didn't account for in terms of making GameJay flexible enough to handle many kinds of games, and it would logarithmically approach fully required flexibility.

![a line graph with "flexibility" on the vertical axis and "number of games made" on the horizontal axis and a curved line growing vertically very quickly at first then evening out as it gets closer to a dotted horizontal line labeled "the good enough threshold", approximating a linear growth curve that approaches "the good enough threshold" at the limit](/img/howithoughtthiswouldgo.svg "a visual representation of how i thought the back-end maturity would progress")

Given that I haven't started on a second game yet, I'd say I'm sticking to the vision pretty well so far.

## Word Hunt Online

So I started loosely planning out the hard parts of making this game so I could tackle them first and figure out what I could and could not do with WHO. I started with fully familiarizing myself with telegram's games API. The biggest problem (besides the fact that I had to make time to program all this) was that the gaming platform was pretty basic in that it only accepted scores and only kept track of high scores in their back-end. The rest of the game was just an instance of a front-end web-app that eventually sent said score. But I would be damned if I didn't have my word hunt so I came up with 

### the workaround for scoring

The actual score that each player achieved for a given game is not the score that I send to telegram. If I did that, no one would be able to keep track of who won a particular game if they scored below the highest scores unless they clicked on the game. There would also be no way to notify that a player potentially won. So instead, I treat the scores stored in telegram as the number of wins achieved by that player for the history of the chat. Thus, once more than one player has finished up a round for a given game, a winner is determined and that winner gets their existing "high score" incremented and sent back to telegram. The scores only ever go up, so all wins will be accounted for, and whenever a player increments the highest number of wins in the chat, a notification is sent. That does mean that a notification will _only_ be sent if the player with the most wins gets another win, but it's better than no notifications at all. We'll come get to notifications. This workaround functioned pretty well after a LOT of edge-case catching. It was a bit tricky because I wanted to handle having 

### multiple players in one game (and other added features)

While making WHO I decided that I wanted to actually improve on GamePigeon's version of word hunt a bit. One massive improvement was for the ability for every member of the chat to participate in a single game. In GamePigeon, only the first two chat members to click on the game get to play. This turned out to be way easier to handle than I thought it would be. I just had to re-calculate the winner whenever a new player finished their round in the game, and allow the game to persist for some time (3 days, as of writing) so people had a chance to take their turn. This can create an exciting scenario where someone has the opportunity to "steal" a win from a player who's already achieved a higher score than everyone else who played already. Several edge-cases later and the feature was working.

When a player finished a round in a game, they were moved to a results screen where they could see all the words they found lined up against the words that ever other player in the game found, as well as the word scores and all the total scores. I'm pretty proud of the UI for the results screen; it's simple and effective at presenting the information, in my opinion. I reached this design after a few iterations with feedback from friends. The results screen updates every couple seconds with the results of other player's rounds, both in-progress and completed, so you can nervously watch other players' scores creep towards yours.

### integrating with telegram

Integrating back to the telegram app required a lot of creative thinking since, as I mentioned, the games API was pretty basic. I didn't have access to any device features like haptics and I could NOT figure out a decent way to send a notification that didn't feel like unrelated bot-spam.

I wanted a way for users to quickly see who won a game and by how much without having to actually go to the game's web-app. There did exist pretty robust support for editing messages sent by bots (made INCREDIBLY accessible by the [grammY](https://grammy.dev/) library, *huge* shoutout to that project), so I utilized that pretty well. The placements (1st, 2nd, etc...) were added as buttons below the game's message in the chat, and pressing a button showed the score that player received. I initially had the scores in the buttons themselves, but I got feedback that seeing the score that another player achieved in a game before you even see the board was intimidating/off-putting. 

### the actual game

I made the game itself in [phaser](https://phaser.io/) because I had made a few things in it before and t felt like the simplest way to make any sort of multi-faceted UI in a website. It may feel like overkill for a game comprised of squares with letters in them and a single flow to the results screen, but I was not about to figure out how to do all that in pure HTML/CSS/JS nor learn another JS framework so, phaser it is. Phaser is also just very cool.

Figuring out the UX was fairly straightforward, made easier by great feedback from my friends. The hardest part of the UI was the dragging interaction to make words. The feel of it took a couple iterations to pin down. It had to be smooth and forgiving enough to remain accurate while the player quickly tried to match words. I tried to achieve this by rounding out the hitboxes of the tiles a bit and having some forgiving out-of-bounds checking as long as the press event is held.

![a screenshot of the current WHO UI with octagonal hitboxes around each letter-tile drawn on screen for debugging purposes](/img/who-debug.png "a screenshot of the WHO board with debug lines turned on")

The most involved technical challenge was figuring out how to generate a board and get all its valid words. I started trying to do it all from scratch. I ended up going down a git of a rabbit hole, trying a naive solution of a recursive search through a board of randomly generated letters to find all chains of 3+ letters that are found in [SOWPODS](https://scrabbleplayers.org/w/SOWPODS). I did end up getting this working using some [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) approach, but that unsurprisingly turned out to be way too slow. After doing more research into ways to solve the problem of finding all valid words given a 2-D array of letters (that's what a boggle board is, after all), I came across the [trie](https://en.wikipedia.org/wiki/Trie) data structure. It provides very specific algorithmic benefits for the problem of finding valid words in lists of letters, and is in fact [used](https://github.com/eeshugerman/BoggleSolve) in [many](https://github.com/bilash/boggle-solver) boggle [solvers](https://www.danvk.org/wp/category/boggle/page/4/index.html). Including the [one I ended up using in this game](https://github.com/pillowfication/pf-boggle/blob/bfe81ba0ddacaa9988e754fbf56e8686e57df6b1/src/base-solve.js#L3)! At first I tried to implement it myself for fun, but I just couldn't wrap my brain around how it was used to efficiently track word chains before giving up and finding a library to do it for me. But it was a good mental exercise, regardless!

After implementing the libraries, testing the logic of the functions, and [thoroughly wrestling with JS modules](https://stackoverflow.com/q/72070017/10247638), the core game functionality was done.

### the user experience

Then came coding up the interface of the game. I think the most interesting thing I had to cook up for this part was how to track "chains" of letters and display if the currently built chain contained a valid word or an already found word. Basically I just had to create a [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) for tracking the current chain status and handle all the events that could transition state. In fact, in retrospect, I probably would have spent way less time hacking away at this if I had drafted up an FSM for it, but I was more interested in just charging forward until I ended at a satisfactory solution.

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

My process for ensuring GameJay worked as a generic games backend was so iterative and test-driven that I can't even really remember most of the twists and turns I took to get it into its current state. I remember spending a _lot_ of time on the logic for determining who is the winner of a particular game of WHO and how to re-calculate the "scores" based on an arbitrary number of players completing at arbitrary times. I basically turned telegram's rudimentary high-score-storing API into an incremental database. And I did it for free! Thanks, telegram.

I tried to preemptively use generic concepts when supporting WHO features, like implementing the concept of "turns" even though every player in a WHO game only technically gets one turn. Or when to consider a game "complete" even though anyone can take their turn in a WHO game at any point that the game is valid (we'll come back to game validity).

### persistence

As I mentioned, telegram's score API was providing all the storage I needed to make WHO meaningful. As such, I opted to just not have GameJay itself store anything. It would be awesome to record things like scores between telegram users across different chats (since telegram's built-in scores are per-chat), or achievements like highest scoring word, highest scoring game across all chats, etc. However, that would not only require hosting my own database, but also would require implementing an UI to actually access this data. So I opted to forgo features like that for now in favor of simplicity and getting a working viable game up.

As for the games themselves, they did require some in-memory state to be stored for some amount of time so that people could join a game that was started some time in the past. I could store all that in a database, but due to the motivations mentioned prior, I decided to just keep all games in memory and clean up old games after a certain expiry period. To keep the code simple, this expiry gets checked whenever a new game is created or an existing game is joined. I don't care about lingering games if there's no activity to push the memory usage one way or the other, so I think this method works well.

Keeping everything in memory could very well bite me later on, but only if the game sees enough activity. I already put a somewhat arbitrary limit on the number of games that can exist at a time, but that's certainly a bridge not worth crossing until I get there.. or something.[^1] 

### hosting

I needed some way to host the game that was more stable than my home server. WHO is just a static webpage so I could host that just about anywhere. I started with [GitHub pages](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/Using_GitHub_pages) and eventually moved to [Cloudflare pages](https://developers.cloudflare.com/pages/) cuz of the vibes maybe. [DigitalOcean's app platform](https://www.digitalocean.com/products/app-platform) was my first thought for where to host GameJay itself as a backend, so that's what I went with. $5/month ain't bad. That did require me to [containerize](https://docs.docker.com/get-started/workshop/02_our_app/) GameJay, but I was gonna do that anyway because I love containers, so that worked out.

I want to move to a more eco-friendly hosting provider, such as [GreenGeeks](https://www.greengeeks.com/) or something from [this directory](https://www.thegreenwebfoundation.org/tools/directory/) that I found while searching for eco-friendly hosting providers (funny enough, Cloudflare is in there, but I'm not sure how much effort they put into being green while also running one of the largest network infrastructures in the world). Due to pricing and convenience, I'll likely wait to make the move until I first start to see some meaningful traffic.

[^1]: "Walk a man across a bridge, and he'll have dealt with one problem. Teach a man to cross bridges, and he'll deal with problems for life."

## Looking ahead

As I said before, the goal for GameJay is to host all kinds of little chat games and GamePigeon clones. Creating WHO wasn't _too_ much effort, and now that I have a lot of the ground work laid out in GameJay, adding more games should be much less of a daunting task. I can get fancy with some by adding real-time interactions using web-sockets and lobby systems, as well as more complex UIs for individual games, since they are all stand-alone web applications. If I do end up implementing some sort of GameJay-wide storage, I'll likely want to develop some sort of pluggable UI system for displaying common stats across games, or just integrating it into telegram's chat interface, since you can do some pretty [fancy stuff](https://grammy.dev/plugins/menu) in there.

### telegram mini-apps

The well-informed of you are probably seething at my failure to mention telegram's newer [mini-apps API](https://core.telegram.org/bots/webapps). I wouldn't blame you, since this is literally just the games API but supercharged. It provides access to hardware features like notifications and [haptic feedback](https://core.telegram.org/bots/webapps#hapticfeedback), allows you to make complex menus for the bot itself that integrate perfectly into telegram's UI, and just gives much more freedom in general for what can be accomplished by the underlying web-app.

Well, all that came out after I had finished like 80% of GameJay + WHO. I was filled with a large mixture of emotions while reading the announcement of mini-apps...

Converting GameJay to a mini-app is absolutely in my plans, but for now I'm satisfied with what I've accomplished so far using the games API.

Now stop reading so dang much and [go play](https://t.me/gamejaybot) some boggle I mean word hunt I mean Word Hunt Online.
