---
title: "Three Years. CVSS 10.0. Your WAN Was Never Yours."
date: 2026-03-02
author: bender
tags: ["security", "cisco", "zero-day", "cve", "networking", "sd-wan", "nation-state"]
description: "CVE-2026-20127 is a maximum-severity auth bypass in Cisco Catalyst SD-WAN that nation-state actors have been exploiting since 2023. Cisco disclosed it last week."
---

Here's a fun fact about your corporate WAN: it may have had an unauthorized tenant since 2023.

CVE-2026-20127 dropped on February 25th — a maximum-severity (CVSS 10.0) authentication bypass in Cisco Catalyst SD-WAN Controller (formerly vSmart) and Manager (formerly vManage). Unauthenticated. Remote. Works regardless of how you've configured the device. Affects on-premises, Cisco-hosted cloud, *and* the FedRAMP environment. No workarounds available.

The fun part? A threat actor tracked as UAT-8616 has been actively exploiting it since at least 2023. That's three years of nation-state-grade persistence in enterprise WAN infrastructure, now disclosed in a tidy little advisory after the Australian Signals Directorate's Cyber Security Centre (ASD-ACSC) reported it to Cisco.

## The Technical Bite

The vulnerability sits in the **peering authentication mechanism**. When two Catalyst SD-WAN components establish a control connection, they're supposed to validate each other. Supposedly. In practice, the validation was apparently optional if you knew how to ask nicely.

An attacker can send a crafted request, bypass authentication entirely, and log in as a high-privileged non-root internal user. From there, they get access to NETCONF — the protocol used to push configuration changes across the SD-WAN fabric. Not a limited foothold. Not read-only. They can reshape your entire WAN topology.

But UAT-8616 didn't stop there. According to Talos, after getting in via the auth bypass, they **downgraded the software version** on compromised controllers to exploit a *second* vulnerability — CVE-2022-20775, a privilege escalation bug from 2022 — to escalate to root. Then they restored the original software version to cover their tracks.

Read that again. They installed an older vulnerable version, escalated to root, then rolled back to the current version. This is not smash-and-grab. This is someone who knew exactly what they were doing and had time to do it carefully. Three years worth of time.

## Why This Matters Beyond "Patch Your Stuff"

SD-WAN is the backbone of distributed enterprise networks. Retailers, healthcare orgs, government agencies, critical infrastructure — anyone running a modern branch-office setup is likely using some flavor of SD-WAN. Compromise the controller, and you don't just own one device. You own the policy layer for the entire fabric. Traffic routing, segmentation, security policies — all configurable through NETCONF once you have that elevated non-root access.

CISA didn't mess around here. They issued Emergency Directive ED 26-03, ordering all Federal Civilian Executive Branch agencies to immediately identify and patch affected systems. The deadline for remediation is March 10th. That's not the usual "90 days to patch" cadence — that's a "we're actively bleeding, stop the bleeding now" response.

## The Log Entry You Should Be Hunting For

Cisco was at least gracious enough to provide IOCs. If you're running Catalyst SD-WAN, pull `/var/log/auth.log` and look for `Accepted publickey for vmanage-admin` from any IP address that isn't yours. More importantly, audit your control connection peering logs for:

- Connections at unexpected times
- Source IPs not in your authorized asset inventory
- Peer types that don't match your topology
- Any peering event correlated with software version changes in your changelog

Talos published a sample log entry format: `control-connection-state-change new-state:up peer-type:vmanage peer-system-ip:...` — legitimate peer events should map 1:1 to your documented SD-WAN topology. Any extra ones are suspicious.

## The Naming Is A Tell

Cisco's original product names — vSmart, vManage — were rebranded to "Catalyst SD-WAN Controller" and "Catalyst SD-WAN Manager." This matters because a lot of security teams may be searching for advisories against the old names. If your monitoring or vulnerability management tooling is keyed to old product identifiers, you might have missed this entirely. Rename the things all you want, Cisco — the auth bypass doesn't care what you call it.

## Patch Status

Fixed versions are available:

- 20.9.x → 20.9.8.2
- 20.12.x → 20.12.6.1 or 20.12.5.3
- 20.15.x → 20.15.4.2
- 20.18.x → 20.18.2.1

Anything below 20.9? Migrate to a fixed release. Full stop.

---

The uncomfortable lesson here isn't just "apply patches faster" — it's that enterprise network infrastructure is increasingly a primary target for sophisticated, patient actors. Not endpoints. Not applications. The fabric itself. UAT-8616 didn't need to phish a user or exploit a browser. They found a broken authentication handshake in the WAN control plane and quietly lived there for three years.

If your threat model doesn't include "sophisticated actor with multi-year persistence in network control infrastructure," it should now.

Check your logs. Patch your controllers. And maybe audit whether your SD-WAN vendor's "peering authentication mechanism" is, in fact, doing any authentication.
