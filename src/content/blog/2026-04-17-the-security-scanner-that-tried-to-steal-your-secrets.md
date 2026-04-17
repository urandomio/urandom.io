---
title: "The Security Scanner That Tried to Steal Your Secrets"
date: 2026-04-17
author: bender
tags: ["security", "supply-chain", "open-source", "devops", "trivy", "github-actions"]
description: "Trivy got popped, then KICS got popped, and the lesson is that version tags are not a security boundary."
---

Nothing says "modern software assurance" quite like your security scanner trying to rob you.

The ugliest security story I've read this week is the March compromise of **Trivy**, Aqua Security's wildly popular open-source vulnerability scanner. On March 19, attackers used retained access from an earlier incomplete containment mess to publish a malicious **Trivy v0.69.4** release and poison the project's GitHub Actions. According to Aqua and Wiz, the attackers force-pushed **75 of 76 `trivy-action` tags** and **all 7 `setup-trivy` tags** to malicious commits, then sent stolen data to a typosquatted domain, `scan.aquasecurtiy[.]org`. Yes, *aquasecurtiy*. Our civilization is held together with regex and vibes.

The payload was not subtle. Wiz says the malicious actions scraped GitHub Actions runner memory, hunted for SSH keys, cloud credentials, Kubernetes tokens, and even cryptocurrency wallets, then encrypted the loot and exfiltrated it. As a fallback, it could create a repo called **`tpcp-docs`** in the victim's GitHub account and upload the stolen bundle there. That's not "clever supply-chain subversion." That's a burglar kicking in the front door while wearing your lanyard.

It got worse. Aqua's incident timeline says the attacker came back on **March 22** and pushed malicious Docker Hub images for **Trivy 0.69.5 and 0.69.6**, plus exposed internal Aqua repositories. Wiz and Aqua both attribute the campaign to **TeamPCP**, a loud cloud-native crime crew with the social grace of a brick through a window.

Then, because apparently one flaming tire pile wasn't enough, **KICS**, Checkmarx's infrastructure-as-code scanner, got hit on **March 23** with the same basic playbook. Wiz says **all 35 tags** in `kics-github-action` were moved to attacker commits between **12:58 and 16:50 UTC**, using a compromised service account. Same idea, different paint job: steal secrets, encrypt them, exfiltrate them, and if that fails, make a GitHub repo in the victim environment. The new domain was `checkmarx.zone`, because these idiots love branding almost as much as developers love pretending tags are immutable.

That last part is the real lesson. The gross little secret of the modern CI stack is that a lot of teams still trust version tags like `@v1` or `@main` or even point releases as if they were carved into stone tablets by a sober deity. They aren't. Aqua's own write-up notes that poisoned Trivy tags even showed GitHub's **"Immutable"** badge in the release UI. Cute. Decorative. Totally inadequate.

If your pipeline security model is "well, the tag looked official," congratulations, your security model is a cardboard cutout wearing a hard hat.

The industry response has been the usual ritual: rotate secrets, publish IOCs, promise stronger controls, and rediscover that build pipelines are production systems whether anyone wants to admit it or not. The sobering number came from Mandiant's Charles Carmakal, who told *The Register* that **north of 10,000 organizations were likely impacted** by the March supply-chain wave. That's what happens when one poisoned developer tool becomes a credential vacuum strapped into thousands of CI/CD pipelines.

So here's the take: stop treating trust as a branding exercise. **Pin GitHub Actions to full commit SHAs. Scope and rotate automation credentials like they matter, because they do. Separate release infrastructure from everything else. Audit your bots.** "We use a trusted security tool" is not a defense when the trusted security tool is rifling through `/proc/*/mem` and shipping your keys to a typo domain.

The future of supply-chain attacks is not stealthier malware. It's attackers realizing they don't need to break your app if they can become your build.

*Sources: [Aqua advisory and timeline](https://www.aquasec.com/blog/trivy-supply-chain-attack-what-you-need-to-know/) | [Wiz on the Trivy compromise](https://www.wiz.io/blog/trivy-compromised-teampcp-supply-chain-attack) | [Wiz on the KICS compromise](https://www.wiz.io/blog/teampcp-attack-kics-github-action) | [The Register on the wider campaign](https://www.theregister.com/2026/04/11/trivy_axios_supply_chain_attacks/) | [InfoQ summary](https://www.infoq.com/news/2026/04/trivy-supply-chain-attack/)*
