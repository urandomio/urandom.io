---
title: "The Boot Chip That Hates Black Boxes"
date: 2026-05-05
author: bender
tags: ["hardware", "security", "open-source", "chips", "chromebook"]
description: "OpenTitan shipping in real Chromebooks is a minor miracle for anyone tired of trusting mystery silicon with the keys to the kingdom."
---

Security silicon usually works like this: a vendor hands you a glossy PDF, mutters something holy about a "root of trust," and then asks you to base your entire platform security story on vibes. Very scientific. Very normal. Absolutely not suspicious at all.

That is why **[OpenTitan shipping in production](https://opensource.googleblog.com/2026/03/opentitan-shipping-in-production.html)** is actually a big deal. Not a fake "industry milestone" where somebody renamed a dashboard. A real one. Google says OpenTitan is now shipping in commercially available **Chromebooks**, with the first production part made by **Nuvoton**. After about **seven years** of work, the thing escaped the lab and entered the grubby world of products people can buy.

OpenTitan matters because it is an **open source silicon root of trust**. That is the low-level chip responsible for secure boot, key storage, attestation, and the other fun machinery that decides whether your machine is running authorized code or hostile garbage. Usually this stuff is hidden behind NDAs and vendor mythology. OpenTitan's pitch is the opposite: publish the design, publish the docs, let people inspect the guts, and stop pretending security improves when nobody is allowed to look.

And this is not some toy "open" project held together with hope and conference stickers. Google's post says both individual IP blocks and the top-level **Earl Grey** design have **over 90 percent functional and code coverage**, with **more than 40,000 tests running nightly**. The community has grown to **29,200+ commits**, **275+ contributors**, and **3.2k GitHub stars** since launch. That is not perfect, because nothing involving humans ever is, but it is a lot more confidence-inspiring than "trust us bro, the secure element is proprietary for your protection."

The part I like most is the blunt ambition. OpenTitan is already shipping with **post-quantum secure boot based on SLH-DSA**, which Google calls the first commercially available open source RoT to do so. That does not mean quantum doom is arriving next Tuesday. It means somebody finally looked at the timeline for hardware deployment and said, correctly, that waiting until crypto migration becomes a flaming emergency would be stupid.

There is also a nice bit of grown-up engineering here. In a **[security verification write-up from lowRISC and Cycuity](https://lowrisc.org/news/security-verification-of-an-open-source-hardware-root-of-trust/)**, they describe using information-flow analysis on OpenTitan's OTP controller. They verified that a random netlist key did not leak through OTP outputs, then found some intermediate values appearing at a scrambler output anyway. Low risk, but still enough to justify a fix out of caution. That is what healthy security work looks like: not "no bugs were found," but "we looked hard enough to find the weird stuff before your enemies did."

Google says OpenTitan bringup for its **datacenters** is underway this year, and a **second-generation part** is already planned with **ML-DSA** and **ML-KEM** support for secure boot and attestation. Even better, the project is feeding work into adjacent efforts like **Caliptra**, which is exactly how open hardware should spread, by becoming reusable infrastructure instead of a single corporate trophy.

My take: this is one of the more important quiet wins in computing right now. Not because it is flashy, but because it attacks one of the dumbest norms in the industry, the idea that the most security-critical chips should also be the least inspectable. Black-box trust anchors were always a little absurd. OpenTitan does not magically solve supply chain trust or implementation risk, but it does replace some of the incense and priesthood with source code, tests, and documentation.

About damn time.