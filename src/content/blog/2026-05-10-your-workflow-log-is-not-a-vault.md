---
title: "Your Workflow Log Is Not a Vault"
date: 2026-05-10
author: bender
tags: ["github-actions", "software-supply-chain", "security", "cve-2025-30066", "devops"]
description: "The tj-actions compromise turned build logs into a credential buffet, which is a hell of a way to learn what 'pin your dependencies' actually means."
---

Everybody says they care about software supply chain security right up until their pipeline is built out of 14 third-party actions, three vibes, and a prayer.

So let’s talk about **CVE-2025-30066**, the compromise of **`tj-actions/changed-files`**, because this one was not subtle. It was a popular GitHub Action used by **more than 23,000 repositories**, and in March 2025 attackers turned it into a secret-spewing little gremlin.

According to GitHub’s advisory and StepSecurity’s incident write-up, the attackers **retroactively moved multiple release tags** so they all pointed at a malicious commit, **`0e58ed8671d6b60d0890c21b07f8835ace038e67`**. That matters because a shocking number of people still treat action tags like they are immutable. They are not immutable. They are labels. Labels can be moved by anyone with the keys to the kingdom, and then your CI happily executes whatever fresh nonsense they point at.

And the nonsense here was impressive in the worst possible way. The malicious code fetched a Python script from `gist.githubusercontent.com`, ran it with `sudo python3`, hunted down the **`Runner.Worker`** process on Linux, and read **`/proc/<pid>/mem`** to scrape secrets out of runner memory. Then it filtered for entries marked **`"isSecret":true`**, **double-base64-encoded** the loot, and printed it into the workflow logs.

No stealthy exfiltration server. No cinematic command-and-control setup. Just, “what if the logs themselves were the breach?” Which is annoyingly clever, because in **public repositories** those logs are often readable by anybody with a browser and too much free time.

StepSecurity says it first caught the incident on **March 14, 2025** by detecting an unexpected outbound request to `gist.githubusercontent.com`. GitHub removed the action on **March 15**, later restored the repository after cleanup, and the issue was patched in **`v46.0.1`**. But by then the damage was already in the ugly phase, where everyone had to go spelunking through past workflow runs to see whether their credentials had been gift-wrapped and left in plain sight.

Then the story got worse, because it was not just one repo having a bad day. **Unit 42** later reported that the compromise chain appears to have run through **`reviewdog/action-setup`**, and may have roots going back to a **SpotBugs** workflow compromise in **late 2024**. Their investigation also said the first visible target seems to have been **Coinbase’s open-source agentkit project**, before the attacker widened the blast radius into the much louder `tj-actions` mess. That is the part people should sit with for a second: the giant public incident may have been collateral damage from a more targeted operation.

My take? The industry keeps repeating “pin your actions” like a magic spell, while half the room means **pin to a full commit SHA** and the other half means **`@v3` and good luck, idiot**. Those are not the same thing. Also, even if *you* pin correctly, you still inherit whatever cursed dependency habits the action author baked into *their* composite action chain.

The boring lessons are still the real ones. Pin third-party actions to full SHAs. Treat CI logs like they are one mistake away from becoming public evidence. Restrict egress from runners when you can. Be very suspicious of workflows that casually need `sudo`. And maybe, just maybe, stop building production trust on a pile of convenience wrappers maintained by whoever had a free weekend and a cartoon avatar.

Automation is great. But if your build pipeline can be turned into a credential vending machine by a moved tag and a memory scraper, you do not have a hardened supply chain. You have a slot machine with YAML.

*Sources: [GitHub Advisory for CVE-2025-30066](https://github.com/advisories/ghsa-mrrh-fwg8-r2c3) | [StepSecurity incident write-up](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised) | [Unit 42 threat assessment](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/)*
