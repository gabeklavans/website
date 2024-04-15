---
date: 2021-06-09
title: Ultimate From-Scratch Mechanical Keyboard Build Guide
subtitle: for those looking to do the least amount of work possible while maximizing ownership
---

If you're someone who has garnered enough interest in modern mechanical keyboards to want to build your own with a high degree of thoroughness and control but don't necessarily have the domain knowledge to just jump right in, then you've come to the right place. This guide assumes a generally high comfort-level with technology and a desire to learn. It's gonna be kind of a write-up/build-guide hybrid with some examples from the numberpad I recently built.

Buckle up, cause it's a long one.

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Planning Phase](#planning-phase)
  - [Layout](#layout)
    - [Bells and whistles](#bells-and-whistles)
  - [Keycaps](#keycaps)
  - [Switches](#switches)
- [Design Phase](#design-phase)
  - [Layout](#layout-1)
  - [Switch Plate](#switch-plate)
  - [PCB](#pcb)
    - [Read this Guide](#read-this-guide)
    - [Did you read the Guide](#did-you-read-the-guide)
    - [Chip Selection](#chip-selection)
    - [Alternatively, MCU Kit Selection](#alternatively-mcu-kit-selection)
- [Build Phase](#build-phase)
  - [Fabrication](#fabrication)
    - [Case](#case)
    - [Switch Plate](#switch-plate-1)
    - [Electrical components](#electrical-components)
      - [LEDs](#leds)
  - [Assembly](#assembly)
    - [Tools](#tools)

# Planning Phase

## Layout

First step is to decide the layout you want. If you haven't thought about it enough yet, Keyboard University has a [great guide](https://keyboard.university/guides/what-size-mechanical-keyboard-should-i-get-g7dbr) for exploring the different common sizes and keyboard layouts. There are also unorthodox layouts like [the split keeb](https://kinesis-ergo.com/split-keyboards/) and [ortho linear](https://www.mechkeybs.com/learn/ortholinear-keyboards-guide/).

![A handy chart](/img/layouts.png "Keyboard layout decision chart")

But that's baby stuff. You're making your own keyboard from scratch. So these common layouts are merely suggestions. Granted, they're very good suggestions, and you should take the time to explore and study what's already been done and what people already like. But if you've got even a little tweak for any of these to make your ideal layout, then that's what you'll want to do.

My build, the [Numpadulator](http://www.keyboard-layout-editor.com/#/gists/76c01d799a5c22b1c113d56c44afb9e6), was a little numpad layout with some extra stuff above the top row.

### Bells and whistles

Extra features that you may want, such as RGB backlighting, rotary encoders (knobs), OLED display panels, and more, can affect your design. Thus, you should decide which of these features you want to end up in your build before you get designing.

## Keycaps

Assuming you aren't also making your own keycaps from scratch (which [you](https://uniqey.zendesk.com/hc/en-us/articles/360008759900-Designing-a-Custom-GMK-Keycap-Set-Guide-) can [do](https://drop.com/talk/475/what-goes-into-creating-a-custom-keycap-set?utm_source=linkshare&referer=5V6HRP)), there are some pretty quick factors you can look at during the search for your desired aesthetic.

Here's a nice little comparison table between the two main types of plastics that keycaps are made from. This comes from a [very good guide](https://switchandclick.com/ultimate-guide-to-picking-a-keycap-set-for-your-mechanical-keyboard/) provided by [switchandclick](https://switchandclick.com/).

| ABS                         | PBT                  |
| --------------------------- | -------------------- |
| Cheaper                     | More expensive       |
| Shiny/Greasy feel over time | Matte, more durable  |
| Smooth                      | Textured             |
| Tend to be thinner          | Tend to be thicker   |
| Quieter, lighter sound      | Louder, deeper sound |

You can decide on the keycaps you want at any point, since you'll very likely end up with MX-style switches so don't fret too much about that.

## Switches

As mentioned, almost all the switches you'll come across are MX-style. That just means they are made using the same profile as the most popular mechanical switch on the market, [Cherry MX](https://cdn.sparkfun.com/datasheets/Components/Switches/MX%20Series.pdf). These switches are generally divided into three categories: Linear, Tactile, and Clicky. Here's another handy table (it is very generalized, there is a lot of variation on the market nowadays).

| Linear                                                             | Tactile                                                | Clicky                                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| No feedback on actuation                                           | Noticeable "bump" (point of resistance) upon actuation | Noticeable bump and click upon actuation                                          |
| Quietest, only the sound of the keycap and stem hitting the bottom | Pretty quiet, bump might add a soft plastic-y sound    | Loud, designed to make an audible click, like a mouse button, for every keystroke |
| Easiest to press (best for touch-typists)                          | Varies widely on how easy to press                     | Medium-to-hardest to press                                                        |
| E.g. Cherry MX Red                                                 | E.g. Cherry MX Brown                                   | E.g. Cherry MX Blue                                                               |

You'll hear talk that the switches actually made by Cherry are among the worst in each category. While this is generally the case for someone seeking an excellent, customized typing experience, it's still a deeply personal/subjective stance and you should never feel like your preference is somehow right or wrong :)

My recommendation is to watch a bunch of comparison videos, get a pick-your-own switch tester like [this one](https://www.ebay.com/itm/383836678335?hash=item595e72e8bf:g:NfUAAOSw9iVhPDTi), push some buttons, and determine which switches to start off with. If you make your keeb hotswappable, (instead of soldering the switches directly on) then you can always go through a few sets of switches on the same board.

I'm a tactile kinda guy, so I put Gateron Kangaroo Ink switches in my main board. They're comparable to the Boba U4Ts, but with a little less pre-travel and a poppier return force/sound.

To note, you'll see people comparing switches to other switches a lot to describe how something feels. It's unfortunate when you have absolutely nothing to compare to, but after trying a couple switches it can be a very useful way to talk about switches.

# Design Phase

So, you've done a lot of research and thought a lot about what exactly it is that you want to build. Now it's time to start making stuff.

The design will basically be split up into 3 parts: the key switch plate, the PCB, and the case.

## Layout

But before we design the parts, we will want to nail down the layout of the keeb.

You'll wanna start [here](http://www.keyboard-layout-editor.com/). This is an invaluable tool for designing the perfect layout for your keyboard. It also provides a nice interface for visualizing the keeb and sharing it with others.

Another reason this tool is so useful is that it outputs your layout in a fairly standardized "raw data" format that defines your exact layout in a JSON object that can be imported into other tools (we will utilize this later).

Lay out your layout and save the design or the raw data somewhere for later.

## Switch Plate

The flow I used to *maximize efficiency* is to design/generate the plate then design the case around it and the PCB in the image of it. So we'll start with the plate.

First you'll want to generate a plate using the keyboard data from your layout.

ai03 hosts a [really simple and clean generator](https://kbplate.ai03.com/) that will get you a nice .dxf with your plate. If you want more control over the output with more file formats (I recommend .dxf anyway, it maintains more information and plays nicely with CAD software) and a sandwich-style case generator (we'll talk about that case style later), check out [the swillkb generator](http://builder.swillkb.com/).

## PCB

### [Read this Guide](https://wiki.ai03.com/books/pcb-design/chapter/pcb-designer-guide)

by ai03. It's really good.

### Did you read the Guide

Ok I'm assuming you read it. Good.

Now, there are a lot of best practices in that guide that you should follow, and some intuition you can build from how ai03 made certain decisions (like placing decoupling capacitors close to the crystal). I encourage doing little research excursions any time a decision is made that you don't understand. That will just help all future design processes along.

### Chip Selection

A large portion of my learning for this phase was around getting a [MCU](https://en.wikipedia.org/wiki/Microcontroller "Microcontroller Unit") onto the PCB and functioning properly. This involves placing lots of supporting electronics around the board to make sure things work well and stay working well, as well as opening up interfacing with peripherals like USB. This is very interesting and it is quite satisfying to have everything soldered directly onto the board PCB.

The most common MCU keyboard makers go with is the ATMega32U4. This is somewhat for legacy reasons, and it is simply a cost effective chip that has been the most thoroughly tested in the keyboard community. If you want more processing speed or, more importantly, more on-board storage, STM makes a lot of nice and inexpensive MCUs. In general, you will want to go with some ARM based chip (many manufacturers like STM, NXP, etc. make ARM-based chips), especially for battery-powered keebs.

### Alternatively, MCU Kit Selection

Now if that all started to sound rambly or hard to decipher, I have a better recommendation for this step. Instead of picking a microchip and designing/soldering everything it requires (this will often involve reading documentation from the chip manufacturer to get things right, or following ai03's guide exactly, which may be limiting for you), then you can just as easily choose a little board that has all that stuff done for you. For example, a commonly used board is the [Pro Micro](https://www.sparkfun.com/products/12640). This has an ATmega32U4 and all its supporting circuitry wired up for you; all you have to do is solder the pin headers to your keeb PCB somehow (typically with pin headers that come with the MCU boards). I went with an [Elite-C](https://deskthority.net/wiki/Elite-C), as it has many pins, the pins are castellated (meaning I can solder the MCU board directly onto my PCB), but still has the same pinout/footprint as the Pro Micro, meaning it's easy to translate the extensive work done on the Pro Micro. To drive that point home, I believe my schematic is actually made for the [Qwiic Pro Micro - USB-C](https://www.sparkfun.com/products/15795), and I literally soldered on an Elite-C last minute cause of supply issues. It just worked.

Bottom line, I recommend picking one of these pre-made MCU kits to start with.

# Build Phase

Great. Now we have everything designed and ready to fabricate, assemble, and use. I'm sure it'll all work perfectly on the first try!

I lied. I don't think it'll work perfectly on the first try. It's actually very normal to have hiccups/oversights for these kinds of things. Your willingness to burn money should dictate how thorough you were in the design phase, as it will cost a lot more to re-fabricate everything for a new design than it will to replace a couple messed up components. If you're very careful and thoughtful, you may be able to scrape by with only a couple minor, mitigable mistakes.

## Fabrication

Now lets step through all the stuff you'll have to get fabricated for the keeb.

### Case

How you get your case made will depend widely on the complexity of your design. My numpad involved a couple layers of relatively simple rectangles with cutouts for things like screws, so I was able to get the thinner layers (of brass and acrylic) plasma/laser cut. The top part of my case had some filleted corners, so I just 3D printed it, but I could've had a block CNC milled to get something more solid, as I could've removed the fillets and made the geometry pretty simple.
The services you use to produce the case can also widely vary. For example, I have a nice 3D printer in my apartment thanks to living with a mechanical engineer. This was GREAT for prototyping parts, and I highly recommend you get cheap or easy access to one for that reason.

### Switch Plate

This is gonna be a 1.5mm $\pm$ 0.1mm sheet, likely laser, plasma, or water-jet cut. This part is usually pretty straight forward and cheap to make, as you can take a flattened drawing format of your switch plate design and throw it into a fabrication service.

Common materials to make a switch plate out of, in order of most to least common, are:

 1. Aluminum
    - Cheap, tried and true
 2. Brass
    - People say it offers a deeper, richer bottom out sound and feel
    - A bit more expensive than alu
 3. Polycarbonate
    - A softer bottom out feel with more give in the board
    - Can be better for diffusing RGB backlighting

From my research of companies that ship to the US, I found that these two were the cheapest and fastest services (I used them both)

- [Ponoko](https://www.ponoko.com/)
- [SendCutSend](https://sendcutsend.com/)

[Here's a post](https://www.keebtalk.com/t/list-of-laser-cutting-services/2500) that accumulates a bunch of services, if you wanna do your own comparison.

### Electrical components

This is pretty much a free-for-all. There are some more maker-friendly sites like [Sparkfun](https://www.sparkfun.com/) or [Adafruit](https://www.adafruit.com/), there are some bulk-ordering sites like [Mouser](https://www.mouser.com/) or [Digi-Key](https://www.digikey.com/) that will offer better pricing and wider selection, or you can just order real cheap from AliExpress. They'll pretty much all deliver serviceable components, so it's up to you to make sure you're getting the right parts and for a price/shipping window that you're comfortable with.

#### LEDs

Make note that WD2812, SK6812, and Adafruit NeoPixels all use the same drivers, so they will all work as intelligent per-key RGB LEDs in QMK. All their variants should also work, just make sure to double-check your choice's package wiring guide to make sure it's physically compatible with your PCB design.

Just something to point out, make sure not to turn your LEDs up to max brightness. It will just be too bright and generate too much heat, in my experience. You can set a maximum value for LED brightness in QMK, so that's pretty easy to toss in.

## Assembly

Now that parts are arriving you can start to put them together.

### Tools

You will need a variety of tools for this kind of work. However, not everyone will end up needing or using the same tools. Instead of buying a bunch of stuff up front that you might not need, if you are patient with the process, you can simply buy as you go to be more efficient.

Here are some things you'll definitely want to consider:

- [THT](https://en.wikipedia.org/wiki/Through-hole_technology "Through Hole Technology") vs [SMD](https://en.wikipedia.org/wiki/Surface-mount_technology "Solder Mount Device") design
  - If you are using all TH components, you will probably get by with just a soldering iron kit
  - If you have some or all SMD components, as I did, then you are DEFINITELY going to want to get a hot air station, like [this one](https://www.amazon.com/YIHUA-959D-Digital-Efficiency-212%C2%B0F-932%C2%B0F-Iron-burn/dp/B08BK3M6YW/), and some [solder paste](https://www.amazon.com/MG-Chemicals-Leaded-Solder-Paste/dp/B00TIC895Y)
    - Using these, you can place down paste where you want to solder on components, affix the component in place, and melt down the solder paste with hot air
    - This creates incredibly clean joints in areas that may be nearly impossible to reach with an iron
    - It also makes removing parts a lot easier
- The size of your screws
  - Some screws that you picked out may be pretty small, or require interesting drivers, like torx
  - Make sure you have a tool that can interface with your screws effectively
- Soldering equipment
  - There's a variety of quality-of-life tools for working with solder, such as fans to suck away the fumes and mats to protect your surfaces
  - Get what will make you feel most comfortable, but I do recommend a fan, as those fumes feel like cancer and it really sucks to have to hold your breath every time you melt solder
- Get flux
  - Just do it (it prevents oxidization which can lead to resistance in solder, bad joints, or other corrosive negative effects)
  - Use it whenever you reflow a joint, or whenever you melt non-flux-core solder
  - It can be in pen form

Don't burn yourself, don't breathe in solder fumes, and BUY EXTRA PARTS. You WILL probably destroy at least one component, and they're cheap enough that getting an extra 2-3 won't hurt.
