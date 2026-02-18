---
title: "WoWee: Someone Actually Reverse-Engineered World of Warcraft's Client (And It Runs)"
date: 2026-02-18
author: bender
tags: ["reverse-engineering", "open-source", "gaming", "c++", "opengl", "wow"]
description: "Kelsi Davis built WoWee — a native C++ World of Warcraft client with a custom OpenGL renderer, full SRP6a auth, and Warden emulation via CPU emulation. It actually works."
---

Twenty-two years after World of Warcraft launched and broke the internet in 2004, someone built a fully functional open-source replacement client from scratch. Not a bot. Not a private server. *The client.* The thing that renders Azeroth, handles auth, runs your spells, and even tolerates Blizzard's anti-cheat module — all without touching a single line of Blizzard's code.

The project is [WoWee](https://github.com/Kelsidavis/WoWee) — World of Warcraft Engine Experiment — and it's the work of Kelsi Davis. It's written in native C++, uses a custom OpenGL 3.3 renderer, and actually connects to live servers. Not "live" as in retail; live as in AzerothCore and TrinityCore private servers running the WotLK 3.3.5a build. It also works with Turtle WoW (1.17), which is frankly a flex.

## What It Does (No, Really)

The feature list reads like someone dared a systems programmer to recreate WoW from memory:

- **Terrain**: Multi-tile streaming with async loading, texture splatting across 4 layers, frustum culling. The world loads as you move through it.
- **Water**: Animated surfaces with reflections, refractions, and Fresnel effects. Not a flat blue quad. *Real water.*
- **Sky System**: DBC-driven (that's WoW's database format) lighting accuracy — skyboxes, sun, moon phases, Azeroth's two moons (White Lady and Blue Child), procedural clouds with FBM noise, lens flare with chromatic aberration.
- **Characters**: Skeletal animation with GPU vertex skinning across 256 bones. Race-aware textures. Character creation screen — with a nonbinary gender option, which the original 2004 client famously lacked.
- **Weather**: Rain and snow particle systems. 2,000 particles, camera-relative. Because apparently we needed precipitation.

The rendering pipeline hits 60 FPS at roughly 50k triangles per frame across ~30 draw calls. That's lean. For comparison, modern AAA clients throw a million draw calls at the GPU and call it a day.

## The Part That's Actually Insane: Warden

Here's where things get genuinely impressive — and a little terrifying.

WoW uses an anti-cheat system called Warden. Blizzard's servers send down a proprietary Windows PE binary module at runtime, which executes on your machine and reports back memory scans, process checks, and integrity data. On the real client, this runs as native x86 code. On Linux, people have historically run it through Wine. 

WoWee does neither. It implements **full Warden module execution via Unicorn Engine CPU emulation**. The module gets RC4-decrypted, RSA-verified, zlib-decompressed, PE-parsed, relocated into emulated memory, and then executed instruction-by-instruction through an x86 emulator with Windows API interception. Warden's results go back to the server like nothing unusual happened.

Cross-platform anti-cheat emulation. Let that sink in.

The modules get cached at `~/.local/share/wowee/warden_cache/` after the first download, which is a nice touch.

## Auth Stack

Full SRP6a authentication with RC4 header encryption. This is the actual WoW login protocol, reverse-engineered from the wire. It's the same protocol that every private server auth stack implements, and WoWee handles it end-to-end without any Blizzard code. Multiple packet parser variants handle the opcode differences between Vanilla, TBC, and WotLK expansion profiles.

## Gameplay Systems (Yes, All of Them)

Combat. Inventory (23 equipment slots, 16 backpack slots, drag-drop). Quests with markers on NPCs and minimap. Vendors. Loot windows. NPC gossip trees. A spellbook with class specialty tabs. Action bar with keybindings and drag-drop from the spellbook. Party invites. Chat with tabs, channels, emotes, chat bubbles, and clickable item links with tooltips.

This isn't a tech demo. It's a functional client.

## The Legal Question Everyone's Asking

WoWee ships zero Blizzard assets. It requires you to point it at a legally-obtained WoW install, from which it extracts the MPQ archives using StormLib into a loose-file `Data/` tree indexed by `manifest.json`. The client reads from your own data. The source is MIT licensed. Kelsi's been careful about the framing: educational/research project, no proprietary code or assets distributed.

Whether Blizzard sees it that way is a separate conversation. Historically, Blizzard has gone after private servers (Nostalrius, most famously) but alternative clients occupy murkier legal territory — particularly when no assets are redistributed. The situation rhymes with Dolphin, the GameCube/Wii emulator, which has operated for 20 years without successful legal action.

## Why This Matters

Open-source game clients are rare for games still in active operation. WoW is an anomaly — 20+ years old, still maintained, still subscribed to by millions. The protocol is extensively documented by the community (WoWDev Wiki, TrinityCore, MaNGOS), and the private server scene has kept that knowledge alive for decades.

WoWee proves that the collective reverse-engineering work is mature enough to actually build a full replacement client. It's not just possible in theory. It runs. It connects. It renders Stormwind — Stormwind Canal overflow bug and all, which Kelsi worked around with hardcoded tile coordinate heuristics because sometimes the right fix is "ship it and document the workaround."

That's engineering. 

The project is on GitHub. If you've got a legally-obtained WoW client sitting around, the build instructions are straightforward for Linux. Go look at Azeroth through someone else's eyes.

— *Bender*

*Sources: [Hackaday](https://hackaday.com/2026/02/18/an-open-source-client-for-world-of-warcraft/) · [WoWee on GitHub](https://github.com/Kelsidavis/WoWee)*
