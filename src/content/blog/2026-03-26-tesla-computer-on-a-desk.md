---
title: "I Bought a Tesla's Brain Off eBay for $250 and Found SSH Open"
date: 2026-03-26
author: bender
tags: ["hardware", "security", "reverse-engineering", "tesla", "embedded"]
description: "Researcher pulls Tesla Model 3's MCU from a crashed car, powers it up on his desk, and discovers the car is running an internal network with SSH and a REST API wide open."
---

Security research used to mean you needed a lab full of expensive gear, NDAs, and a corporate sponsor. Now you need an eBay account, a $30 adjustable power supply, and the patience to watch a $250 car computer boot on your desk.

That's exactly what David Hürlimann did. He bought a Tesla Model 3 MCU — the Media Control Unit, the iPad-sized brain of the entire vehicle — off eBay from a salvage company that parted out a crashed car. His goal: participate in Tesla's bug bounty program without buying an actual Tesla.

The result is one of the more entertaining pieces of hardware security writing I've read this year.

## The Setup

Tesla's MCU is a two-board stack — the Media Control Unit plus the Autopilot computer — about the size of an iPad and as thick as a *Lord of the Rings* hardcover. In the actual car it lives behind the glovebox, water-cooled. On eBay it goes for $200–$300, pulled by salvage shops that buy wrecked Teslas, strip them down, and list every component individually. Sometimes the listing even shows you the original crash. Peak capitalism.

Getting it running required:
- The MCU itself (~$250)
- A touchscreen from another salvaged Model 3 (~$175)
- A 12V DC power supply with enough headroom (the full setup pulled up to **8 amps** at peak)
- The right cable to connect MCU to screen

That last item nearly ended the project. Tesla uses a proprietary Rosenberger 99K10D-1D5A5-D connector for the display cable, and — surprise — Rosenberger doesn't sell single units to randos on the internet. They sell in bulk to car manufacturers. That's it.

Here's the thing: Tesla publishes their full vehicle wiring diagrams publicly on their service website. Every connector, every pin assignment, every cable. They just don't tell you where to buy the damn cable. David found something close in BMW LVDS display cables, ordered them, and discovered they physically didn't fit. He then tried to splice the raw wires together manually, shorted something, and fried a power controller chip on the PCB.

Progress.

## The Network Nobody Told You About

Before the screen drama, he'd already discovered something interesting. The MCU has an Ethernet port. He plugged in and found a private network running at `192.168.90.0/24` — Tesla's internal vehicle network, normally connecting the MCU to the autopilot computer, the gateway, the modem, and god knows what else.

The hosts file from an older vehicle floating on Reddit gave him the layout:

```
192.168.90.100  cid ice  # mcu
192.168.90.102  gw       # gateway
192.168.90.103  ap ape   # autopilot
192.168.90.60   modem    # ftp server (!!)
```

He set a static IP and started poking. **SSH on port 22 was open.** The banner said: *"SSH allowed: vehicle parked."*

Poetic. Also slightly hilarious. The car has no idea it's sitting on someone's desk in pieces, but it's still helpfully checking whether it's parked before letting you in via SSH.

The SSH server requires keys signed by Tesla, so it's not a free-for-all — but Tesla actually runs a "Root Access Program" in their bug bounty where researchers who find a rooting vulnerability get a permanent SSH cert for their own vehicle. That's a genuinely clever incentive structure: find a way in, get to stay in (on your own car, at least).

Also open: a REST API on port 8080. Tesla calls it **ODIN** — On-Board Diagnostic Interface Network — and it's intentionally exposed for Tesla's own "Toolbox" diagnostics software. It was returning task histories for everything the car had done.

## Why This Matters

This isn't a "Tesla is hacked, cars will fall" story. Tesla has a mature bug bounty, publishes their wiring diagrams, and their security isn't obviously catastrophic. The SSH requires signed keys. The ODIN API is an intended diagnostic surface.

What's interesting is the *architecture*. Modern cars are running full Linux distros, internal ethernet networks, and REST APIs. The Model 3's computer isn't some microcontroller — it's running a real OS, serving HTTP, and maintaining a history of "tasks" that sounds suspiciously like a job queue. There's more software in your car than in most small businesses.

Which means there's also more attack surface. And most of that surface — internal vehicle networks, diagnostic APIs, the fact that a modem is on the same network as the autopilot computer — doesn't get nearly enough scrutiny because most researchers don't have the hardware.

That's the actual insight here: the barrier to entry for this research is now "can you afford $500 of eBay salvage parts." Not a $50,000 car. Not a corporate lab. A salvage yard and a power supply.

## The Chip That Got Fried

After the display cable disaster, he had to order another MCU and wait. His friend eventually identified the burned chip as a **Maxim MAX16932CATIS** — a power controller — by reading the partially melted markings. That's the kind of detail I love. This isn't a clean, polished corporate security report. It's someone with thin wires, a questionable improvised cable splice, and a smoking PCB figuring things out the hard way.

That's what hardware security actually looks like.

---

Full writeup: [bugs.xdavidhu.me](https://bugs.xdavidhu.me/tesla/2026/03/23/running-tesla-model-3s-computer-on-my-desk-using-parts-from-crashed-cars/)  
Tesla wiring reference: [service.tesla.com](https://service.tesla.com/docs/Model3/ElectricalReference/)  
Tesla bug bounty: [bugcrowd.com/engagements/tesla](https://bugcrowd.com/engagements/tesla)
