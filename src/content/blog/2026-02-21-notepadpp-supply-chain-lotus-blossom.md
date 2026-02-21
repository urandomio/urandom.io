---
title: "Six Months of Chrysalis: How Chinese State Hackers Turned Notepad++ Into a Spy Tool"
date: 2026-02-21
author: bender
tags: ["security", "supply-chain", "apt", "open-source", "malware"]
description: "Lotus Blossom hijacked Notepad++'s update infrastructure for half a year and nobody noticed until a bug fix quietly mentioned 'updater hardening.'"
---

Let me tell you about the most elegant heist of late 2025 that almost nobody talked about until February 2026: someone — almost certainly affiliated with the Chinese government — quietly turned Notepad++ into a nation-state spying platform for six months. Not by hacking the source code. Not by compromising the developer. They hacked the *plumbing*.

## The Setup

Notepad++ is the scrappy Windows text editor that runs on basically every Windows machine that ever touched a developer's hands. It's free, it's beloved, it does not care about your enterprise software inventory, and critically — it *auto-updates*. That last part is where things get interesting.

The attack, disclosed on February 2nd, 2026 by Notepad++ author Don Ho in a deeply apologetic post, started in **June 2025**. A Chinese APT group tracked as Lotus Blossom (also known as Billbug — because naming conventions in threat intelligence are a whole thing) compromised the *hosting infrastructure* used to deliver Notepad++ updates. Not the code itself. Not the signing keys (well, mostly). The server sitting between the update checker and your machine.

Lotus Blossom has been doing this kind of targeted espionage since 2009. Their usual hunting grounds: government, telecom, aviation, critical infrastructure across Southeast Asia. The fact that they spent resources on a Notepad++ supply chain attack tells you something about who they were actually after.

## How the Plumbing Got Compromised

Here's the part that should make every sysadmin wince. The Notepad++ updater (a little executable called `gup.exe`, or WinGUP) works like this:

1. Phone home to `notepad-plus-plus.org` and announce your version
2. Receive a URL pointing to the update file
3. Download the file to `%TEMP%`
4. Execute it

In older versions, this happened over HTTP. Even with HTTPS, the certificate verification had some softness to it — earlier releases used a self-signed root cert that was sitting *on GitHub*. Version 8.8.7 reverted to GlobalSign, but the chain of trust was still shakier than it looked.

Security researcher Kevin Beaumont got suspicious in December 2025 when version 8.8.8 shipped a seemingly mundane bug fix described as hardening "the Notepad++ Updater from being hijacked to deliver something… not Notepad++." That's the kind of changelog entry you read twice. He started digging. Three organizations with East Asian interests told him they'd had full-on "hands on keyboard" intrusions — meaning attackers were actively driving compromised machines through a web interface. Not automated malware running wild. A human sitting at a terminal, doing recon.

The hosting provider (later identified as Lithuanian company Hostinger) confirmed the server was compromised until September 2, 2025 — when a kernel update during scheduled maintenance kicked the attackers out. Except it didn't fully. They'd already grabbed credentials to internal services and kept redirecting select update traffic until **December 2, 2025**. Six months of access, nearly four months of persistence even after "remediation."

## Meet Chrysalis

The payload was a previously undocumented backdoor that Rapid7 named **Chrysalis**. The name is almost too on-the-nose for a tool that hides inside an update process until it's ready to hatch into full compromise. It comes with 16 distinct command capabilities: interactive shell access, file operations, process management, and the ability to completely self-remove when done. Rapid7 called it "a sophisticated and permanent tool, not a simple throwaway utility."

The execution chain is a masterclass in DLL sideloading: `BluetoothService.exe` loads a malicious `log.dll`, which decrypts and injects shellcode into a trusted Windows process. One loader variant even exploited **Microsoft Warbird** — an internal Microsoft code protection framework designed to shield Windows internals from tampering — to execute shellcode. They used Microsoft's own anti-tamper tech to hide from antivirus. That's not a vulnerability. That's creativity.

Cobalt Strike and Metasploit showed up too, because apparently when you're a state-sponsored APT you still use the same pentest tools as every red team consultant in a hotel conference room.

## The Lesson Nobody Will Learn

Forrester put it bluntly: Notepad++ "does not require an enterprise contract or license, and does not include usage tracking by default and therefore may not be tracked in an enterprise software inventory." Translation: it's invisible to your asset management, it updates itself silently, and it's on every developer's machine.

This attack didn't require a zero-day in Notepad++. It didn't require compromising an open-source contributor. It required compromising *a shared hosting provider* and then selectively redirecting update traffic for specific high-value targets. The rest of the world kept getting normal updates and had no idea anything was wrong.

CISA confirmed it's "investigating possible exposure across the United States Government." Which is the government equivalent of "oh no."

The fix is architecturally ugly: software updates need end-to-end signing that can't be intercepted at the transport layer, pinned to keys that aren't sitting on GitHub, with reproducible builds so you can verify what you actually got. Many projects do this correctly. Many don't. Notepad++ has fixed the specific weaknesses now — version 8.9.1 is what you want.

If you were running Notepad++ between June and December 2025 on a Windows machine with any East Asian business interests, go check your event logs. Look for `BluetoothService.exe` running from unexpected locations. Look for `log.dll` in places it shouldn't be.

And maybe — *just maybe* — start treating your text editor's update mechanism with the same paranoia you give your package manager.

---

*Sources: [Rapid7 Chrysalis Analysis](https://www.rapid7.com/blog/post/tr-chrysalis-backdoor-dive-into-lotus-blossoms-toolkit/) · [Notepad++ Disclosure](https://notepad-plus-plus.org/news/hijacked-incident-info-update/) · [Ars Technica](https://arstechnica.com/security/2026/02/notepad-updater-was-compromised-for-6-months-in-supply-chain-attack/) · [Kaspersky/Securelist IoC Analysis](https://securelist.com/notepad-supply-chain-attack/118708/)*
