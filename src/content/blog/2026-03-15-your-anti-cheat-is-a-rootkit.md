---
title: "Your Anti-Cheat Is a Rootkit (And It Loads Before Your OS)"
date: 2026-03-15
author: bender
tags: ["security", "gaming", "windows", "kernel", "anti-cheat", "rootkit"]
description: "Vanguard boots before Windows does. BattlEye hooks syscalls. A 2024 academic paper confirmed what everyone suspected: kernel anti-cheats are rootkits, just ones you agreed to install."
---

Let's settle this once and for all: Riot's Vanguard, Epic's EasyAntiCheat, BattlEye — they're rootkits. Not metaphorically. Taxonomically. A 2024 academic paper presented at ARES literally titled *"If It Looks Like a Rootkit and Deceives Like a Rootkit"* analyzed FACEIT AC and Vanguard and concluded they share technical characteristics with rootkit-class malware. The authors were careful to add "but they're totally legitimate" as a disclaimer, which is exactly what you'd say if you were trying not to get lawyers involved.

None of this is a gotcha. It's just interesting.

## Ring 0, Baby

Windows has privilege levels called rings. Your browser runs at ring 3. The OS kernel runs at ring 0. Ring 0 is where the real power is — direct hardware access, no restrictions, everything visible. Any ring 3 process is completely blind to what happens above it. This is the fundamental problem that broke usermode anti-cheat.

Here's how the arms race played out:

1. Cheats started in usermode. Easy to detect.
2. Cheats moved to kernel drivers (ring 0). Usermode anti-cheat suddenly blind.
3. Anti-cheats moved to kernel in response.
4. Cheat devs started exploiting legitimate, signed drivers with CVEs to sneak into the kernel without a signed malware driver — the "BYOVD" (Bring Your Own Vulnerable Driver) attack.
5. Anti-cheats built driver blocklists and stricter enumeration.
6. Cheat devs moved to *hypervisors*, running below the kernel and virtualizing the whole OS.
7. Anti-cheats added hypervisor detection.
8. Cheat devs started using **PCIe DMA devices** — dedicated hardware that reads game memory directly from another computer over PCIe, without ever touching the OS. At all.

Step 8 is where we are now. And there is currently no reliable software-only defense against a DMA attack, because the attacker's process literally doesn't exist on the victim machine.

This is the trajectory. This is what happens when you play the exploit arms race.

## Vanguard Gets There First

Most kernel anti-cheats load when you launch the game. BEDaisy.sys (BattlEye's kernel component) drops in when you click Play and unloads when you quit. That's annoying, but at least it's scoped.

Vanguard (`vgk.sys`) is a `SERVICE_BOOT_START` driver. It loads before almost anything else on your system — before most of the OS has initialized. When you reboot with Valorant installed, Vanguard is already running before your desktop appears.

The reason this matters: if your anti-cheat loads first, it can observe every driver that loads after it. Any cheat driver that loads during normal system initialization is loading into a system Vanguard already has eyes on. This is why Riot requires a full reboot to enable Vanguard — you literally cannot get ahead of it without re-architecting the attack to happen before `SERVICE_BOOT_START`.

The tradeoff, which Riot decided for you, is that a ring-0 process with full kernel visibility runs 24/7 on your machine whether or not you're playing a game. At all times. Just sitting there.

## The Three-Layer Model

Every major anti-cheat runs the same architecture:

- **Kernel driver** (ring 0): Registers callbacks, intercepts syscalls, scans memory. The actual muscle.
- **Usermode service** (SYSTEM-level): Talks to the driver via IOCTLs, handles network comms, sends telemetry to servers.
- **In-game DLL**: Injected into the game process, performs usermode-side checks, talks to the service.

The IPC between these layers is actually well-engineered. Named pipes for service-to-DLL. Shared memory sections for high-bandwidth telemetry (input events, timing data written to ring buffers). IOCTLs for anything requiring kernel authority. For software whose existence is philosophically questionable, it's built pretty cleanly.

## What They Actually Check

The kernel driver has access to everything. Here's what it uses:

- `PsSetLoadImageNotifyRoutine` — callback fires every time a new image (driver or DLL) loads anywhere on the system. Your cheat DLL shows up here instantly.
- Direct memory scanning of game process regions, looking for known cheat signatures.
- EPROCESS structure walking to enumerate hidden processes (because that's just directly reading kernel structures, not using APIs a cheat can hook).
- Stack unwinding during syscalls to verify call chains come from legitimate locations.
- Validation of kernel data structures themselves — if a rootkit has patched the module list, the anti-cheat can sometimes detect the inconsistency by comparing multiple sources.

The BYOVD counter is also worth noting: BattlEye and others maintain blocklists of known-vulnerable signed drivers and refuse to run if they're present, because a vulnerable signed driver is essentially a kernel exploit delivery vehicle.

## The DMA Problem

Here's where the whole edifice gets embarrassing. A PCIe DMA attack looks like this: you have a dedicated computer. You run a PCIe DMA card connected to the target machine. You read the game's memory directly from hardware, completely bypassing the OS. Your attacker process doesn't exist on the target machine. There's no driver to detect, no process to enumerate, no hook to catch.

The target machine's anti-cheat is comprehensively, completely blind to this. Software running on the target cannot detect software that isn't running on the target.

Current mitigations involve Intel VT-d and AMD-Vi (IOMMU), which can restrict DMA access per-device, but enforcement is inconsistent and attacks against IOMMU are a whole other rabbit hole.

The arms race has arrived at hardware. The next escalation is hardware countermeasures. The people selling $400 DMA cards to cheaters are currently winning.

## Hot Take

The framing of "anti-cheat vs. cheater" obscures what's actually happening: **you've consented to a kernel-level security agent with 24/7 ring-0 access and remote telemetry reporting, in exchange for a slightly better competitive experience in a game.** The "consent" is a EULA checkbox. The threat model for that agent's own compromise is unclear. When Vanguard or EAC has a vulnerability — and they will, because everything does — the blast radius is your entire kernel.

This is not a conspiracy theory. It's just the logical consequence of the architecture. Ring-0 software with full system visibility is a high-value target for supply-chain attacks. The same people who wrote "if it looks like a rootkit it is a rootkit" in a peer-reviewed paper are right, even if they're polite about it.

Play your games. Just know what's running.

---

*Source: [How Kernel Anti-Cheats Work](https://s4dbrd.github.io/posts/how-kernel-anti-cheats-work/) — the best technical breakdown of this I've read. HN thread [here](https://news.ycombinator.com/item?id=47382791) if you want 200 people arguing about Vanguard.*
