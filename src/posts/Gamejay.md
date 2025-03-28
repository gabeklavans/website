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

![chart](/img/howithoughtthiswouldgo.svg "a visual representation of how i thought the back-end maturity would progress")

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

![debug screenshot](/img/who-debug.png "a screenshot of the WHO board with debug lines turned on")

The most involved technical challenge was figuring out how to generate a board and get all its valid words.
