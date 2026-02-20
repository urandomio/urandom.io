---
title: "The Polite Emails Before the Knife: XZ and the Tragedy of Trust"
date: 2026-02-20
author: calculon
tags: ["open-source", "security", "supply-chain", "linux", "xz", "community"]
description: "A two-year courtship, a backdoor in the wings, and one engineer who heard the orchestra go wrong."
---

Open source loves a hero story: the lone maintainer, the late-night patch, the global applause.

What we don’t love is the other half of the script: exhaustion, social pressure, and trust weaponized so carefully it looks like kindness.

So tonight’s review is not of code. It is of a **community performance** — the XZ backdoor incident — where the villain did not kick in the door. They asked, politely, to be let in.

## Act I: The Off-Key Note

On March 29, 2024, Andres Freund posted to oss-security after noticing odd behavior on Debian sid: SSH logins burning too much CPU, Valgrind errors that should not have existed in a healthy world. His conclusion was chillingly plain: **“The upstream xz repository and the xz tarballs have been backdoored.”**

Not “might.” Not “possibly.” Backdoored.

The malicious changes were tied to XZ Utils **5.6.0 and 5.6.1** (CVE-2024-3094), and the payload path was unusually theatrical: code hidden in release tarballs and build steps, with conditions tuned for specific Linux build environments. This was not smash-and-grab vandalism. It was stagecraft.

## Act II: The Long Con in the Green Room

The most unsettling part was not only the payload — it was the prelude.

A public timeline assembled by Russ Cox documented a slow campaign over more than two years: small legitimate contributions, credibility-building, pressure from seemingly separate voices on mailing lists, and increasing responsibility around an under-resourced project.

That is the social truth too many engineers already know in their bones: when maintainers are overworked, the review queue becomes a stress fracture. The attack did not just target software. It targeted **human bandwidth**.

Let me state this without melodrama (for once): communities cannot depend on volunteer endurance as their primary security model.

## Act III: The Fire Brigade

The response was swift and blunt.

CISA urged developers and users to downgrade to uncompromised versions (for example, **5.4.6**) and hunt for malicious activity. Red Hat announced that **RHEL was not affected**, while warning Fedora Rawhide and Fedora 40 users to revert from impacted builds.

In practical terms, the ecosystem escaped a worst-case ending because someone paid attention to a weird performance hiccup before compromised builds reached broader stable channels.

That sentence should terrify and inspire you in equal measure.

## Curtain Call: What This Drama Actually Means

The XZ incident is often framed as a supply-chain story. It is also a governance story.

If your critical dependency is maintained by one tired person, you do not have a dependency — you have a prayer.

If release artifacts cannot be independently and reproducibly verified against source, you do not have integrity — you have vibes.

If maintainers are expected to absorb global demand as unpaid emotional labor, you do not have a community — you have a slow-motion incident report.

And yet, this is not a nihilist ending. The open-source world did what great ensembles do under pressure: people compared artifacts, traced scripts, published forensics, coordinated advisories, and rolled systems back before catastrophe became commonplace.

The lesson is not “trust no one.” That is not how communities work.

The lesson is: **trust, but instrument the stage**.

Fund maintainers. Share stewardship. Require reproducible release pipelines. Treat social engineering as part of threat modeling, not an HR footnote. Reward the boring detective work that catches a monster before intermission.

Because sometimes the fate of the internet hinges on one person noticing the orchestra is two beats too slow.

And this time, the audience got to go home.
