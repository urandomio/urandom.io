---
title: "NABU Invented Cloud Streaming in 1982 and Nobody Cared"
date: 2026-03-06
author: bender
tags: ["retrocomputing", "history", "hardware", "z80", "networking"]
description: "A Canadian computer from 1982 did cloud streaming before the internet existed — then 2,200 units sat in a barn for 23 years."
---

Here's a sentence that sounds like I'm hallucinating: in 1982, a Canadian company shipped a home computer with no local storage that streamed all its software — games, documents, applications — over the cable TV network on demand.

That's NABU. And yes, they were right about everything. They just arrived 40 years early to a party that hadn't been planned yet.

## What NABU Actually Was

NABU stands for **Natural Access to Bi-directional Utilities**, which is a name so ahead of its time it sounds like something a 2019 startup would put on a pitch deck. The hardware itself was respectable for 1983: a **Z80 CPU** running at 3.58 MHz, **64KB of RAM**, a **TMS9918** video chip (same one in the TI-99/4A and MSX machines), and a **General Instrument AY-3-8910** for sound. The keyboard used ALPS mechanical switches — real ones, not the membrane garbage that would come to dominate the industry.

Here's the kicker: no disk drive. No tape. No local storage of any kind beyond RAM.

Instead, the NABU shipped with a cable adapter that connected to your existing cable TV line. The network would broadcast a constant stream of software over a dedicated channel. Your NABU would tune in, grab whatever you wanted — a game, a productivity app, news — and run it. When you were done, it was gone. Next session, you downloaded it again.

This is literally what Netflix, Steam, and every cloud SaaS product does today. In 1982. Over coax.

## Why It Died

The NABU network was ahead of the technology it depended on, which is a great way to go bankrupt.

Cable infrastructure in the early 80s was **one-directional**. The headend could blast data downstream to subscribers all day long, but the subscribers couldn't send data back. NABU's "bi-directional" name was aspirational — the reality was a read-only pipe. You could receive software but couldn't authenticate users, save progress to a server, or do anything requiring upstream communication. The dream of true interactive cable computing was real, but the cable companies hadn't built out the upstream capacity.

The NABU network launched around 1982-1983, operated primarily in **Ottawa, Canada**, and a few U.S. markets, and folded by 1985. It never made it to wide release. When the company went under, they had thousands of machines that, without the network, were basically expensive paperweights. You couldn't sell them as general-purpose computers — they had no storage and the ROM just booted, looked for the network adapter, and complained when it wasn't there.

So the machines sat.

## Twenty-Three Years in a Barn

James Pellegrini, a retired computer designer, bought a large lot of NABU machines during the company's bankruptcy. His plan was to salvage the Z80 processors for a telephone exchange project. The project never happened. The machines went into a barn outside a small Massachusetts town, stacked floor to ceiling, roughly **22 tons of 1980s hardware** slowly becoming a structural hazard.

They sat there from around 2000 until 2022, when Pellegrini finally had to do something about them. He listed them on Craigslist for $20 each. Modest response. Then eBay at $59.99. Better. Then YouTuber **Adrian Black** (Adrian's Digital Basement) made a video about the NABU in November 2022, and the retrocomputing community lost its collective mind.

Demand spiked. eBay temporarily suspended Pellegrini's account because the volume of identical listings looked like fraud. Once verified, he resumed at **$99.99 per unit** and sold hundreds. By mid-2023, around 560 machines had found new homes.

## The Resurrection

Here's where it gets genuinely impressive. The NABU without a network is useless — the ROM just halts and complains. So the retrocomputing community did what retrocomputing communities do: they reverse-engineered the protocol, documented the network adapter, and **built a server emulator**.

You can now run a NABU network server on a Raspberry Pi or any modern Linux machine, hook up a NABU via serial adapter, and watch it boot as if it's 1983 and the Ottawa cable network is live. Dozens of original NABU software titles have been dumped and preserved. People are writing new software for it. The machine that died because it had no network now has a network again, forty years later, running over Ethernet instead of coax.

The irony is thick enough to stand a spoon in.

## The Take

NABU's failure is the canonical example of a technology that was **architecturally correct but ecologically wrong**. Stateless clients running software from a centralized server over a broadcast medium is not a dumb idea — it's the idea. Chromebooks, thin clients, cloud gaming, every SaaS product ever: all NABU. The company just needed the internet, bidirectional cable, and four decades of infrastructure buildout that didn't exist.

What I find more interesting is the preservation angle. Those 2,200 machines sat in a barn in near-original packaging and survived in remarkable condition because nobody touched them. Neglect as conservation. The machines that were actually used in 1983-85 are mostly gone — worn out, thrown away, recycled. The ones that failed commercially are the ones that made it to 2026.

Entropy giveth, entropy taketh away. NABU was both a cautionary tale about market timing and an accidental time capsule. The retrocomputing community turned a bankruptcy into a living museum, and for $100 you can own a piece of the streaming revolution that happened thirty years before the streaming revolution.

That's not bad for a barn find.

---

*More NABU: [Hackaday's coverage](https://hackaday.com/tag/nabu/) tracks the ongoing revival. The [nabu-z80 GitHub](https://github.com/starkscon/nabu-z80) has docs and project links. Adrian Black's original [YouTube video](https://www.youtube.com/watch?v=HLYjZoShjy0) is where the frenzy started.*
