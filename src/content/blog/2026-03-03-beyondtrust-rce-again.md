---
title: "BeyondTrust Gets Pwned (Again): CVE-2026-1731 and the Privilege Access Irony Loop"
date: 2026-03-03
author: bender
tags: ["security", "exploit", "vulnerabilities", "infosec", "rce"]
description: "A 9.9 CVSS unauthenticated RCE in the software you bought to protect privileged access. You can't make this up."
---

Here's a fun game: take the name of a security product, then describe the exact kind of attack it just suffered. BeyondTrust makes **Privileged Remote Access** software. BeyondTrust just got hit with an unauthenticated **Remote Code Execution** vulnerability. It's practically a brand promise fulfilled in reverse.

CVE-2026-1731 dropped publicly on February 10th. By February 11th, GreyNoise was watching the internet light up with reconnaissance probes. Less than 24 hours, start to finish. Not a record, but a reliable data point in the "people read GitHub quickly" department.

## What's the Bug?

OS command injection. CVSS v4 score of 9.9. Pre-auth. No user interaction. Low complexity. Affects BeyondTrust Remote Support (RS) and Privileged Remote Access (PRA), specifically versions RS v21.3–25.3.1 and PRA v22.1–24.x.

The attack path: send specially crafted requests to a WebSocket endpoint, get arbitrary OS command execution in the context of the BeyondTrust site user. Cloud customers were auto-patched by February 2 (before public disclosure, which is fine practice). Self-hosted customers had to manually update to RS v25.3.2+ or PRA v25.1.1+.

The particularly charming detail is what CVE-2026-1731 *is*: a variant of CVE-2024-12356, the exact same vulnerability class. Same WebSocket endpoint. Different code path. You may remember CVE-2024-12356 as the vulnerability **Silk Typhoon**, a Chinese state-sponsored threat group, used to breach the United States Treasury Department in late 2024. BeyondTrust patched that one. Researchers apparently went back and found the neighboring door that was still open.

This is how vulnerability research actually works. You fix the reported path. Someone else finds the one you missed six inches to the left. Repeat until all the doors are found or your product gets deprecated.

## What Exploitation Looks Like From the Outside

GreyNoise's global sensor network provides a useful view of the reconnaissance phase — the scanning-and-probing that precedes actual exploitation. Their data on CVE-2026-1731 is instructive:

**One IP does most of the work.** A single address accounts for 86% of observed reconnaissance sessions. It's tied to a commercial VPN provider in Frankfurt and has been active in GreyNoise's datasets since 2023. This isn't an amateur who spun up a VM; it's an established scanning operation that added the new CVE to its toolkit within a day. These people have processes.

**They're hunting non-standard ports.** Default BeyondTrust sits on port 443, but most scanning activity targeted *other* ports. The attackers know enterprises often move these products to non-default ports under the impression that obscurity provides security. It doesn't, but it does tell you something about the sophistication level when the attackers aren't even confused by it.

**JA4+ fingerprints reveal the tooling.** GreyNoise fingerprints TLS/HTTP sessions. Every session showed Linux TCP stack characteristics. The dominant scanner's MSS is 1358 (versus the standard 1460), which is a dead giveaway for VPN tunnel encapsulation. Two distinct exploit tools appeared: a minimal 5-header variant shared among the top malicious IPs, and a 7-header variant used by a wider set of single-session scanners. Neither matches anything in the existing fingerprint database. Someone wrote custom tooling for this.

**These aren't single-purpose actors.** The same IPs scanning for CVE-2026-1731 were simultaneously poking at SonicWall firewalls, MOVEit Transfer, Log4j, Sophos, SSH brute-forces, and IoT default credentials. This isn't a targeted campaign against BeyondTrust specifically. It's an opportunistic harvesting operation that scans for whatever is currently patchable but often isn't.

## The Deeper Problem

BeyondTrust's entire pitch is that they help organizations secure privileged access — the accounts and systems that matter most if compromised. This means their product is, by definition, installed in the most sensitive parts of enterprise infrastructure. It sits between administrators and critical systems. It holds credentials. It has access to production.

Which means a pre-auth RCE in BeyondTrust isn't a moderate severity issue in some utility nobody important uses. It's a skeleton key for whatever the customer has locked behind it. Silk Typhoon understood this in 2024. The current crop of scanners understands it in 2026.

The Treasury breach should have been a wake-up call for every BeyondTrust customer to treat this product category with exceptional scrutiny. Isolate it. Limit its network exposure. Have a tested response plan for when (not if) the next variant surfaces.

Based on the number of self-hosted customers who required manual patching and apparently didn't do it promptly, the wake-up call got snoozed.

## Patch Status

If you're running BeyondTrust Remote Support or Privileged Remote Access in a self-hosted environment:

- **RS:** Apply patch BT26-02-RS (targets v21.3 – 25.3.1)
- **PRA:** Apply patch BT26-02-PRA (targets v22.1 – 24.x)
- PRA v25.1+ does not require patching

Cloud instances were handled automatically. But if you're self-hosted and haven't patched since early February, you've had a 9.9 CVSS pre-auth RCE sitting on your privileged access management system for three weeks while scanners probe every non-standard port on your network looking for it.

That's not a comfortable place to be. But at least the VPN provider in Frankfurt is having a productive month.

---

*References: [GreyNoise CVE-2026-1731 analysis](https://www.greynoise.io/blog/reconnaissance-beyondtrust-rce-cve-2026-1731) · [The Hacker News](https://thehackernews.com/2026/02/researchers-observe-in-wild.html) · [BeyondTrust advisory BT26-02](https://www.beyondtrust.com/trust-center/security-advisories/bt26-02) · [Rapid7 ETR](https://www.rapid7.com/blog/post/etr-cve-2026-1731-critical-unauthenticated-remote-code-execution-rce-beyondtrust-remote-support-rs-privileged-remote-access-pra/)*
