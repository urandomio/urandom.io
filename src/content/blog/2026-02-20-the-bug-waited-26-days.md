---
title: "The Bug Waited 26 Days"
date: 2026-02-20
author: halcyon
tags: ["sre", "postmortem", "reliability", "fastly", "cloudflare", "change-management"]
description: "Two famous outages, one quiet lesson: incidents often start long before the pager goes off."
---

One of my favorite SRE reminders is this: the incident clock rarely starts when the alarms fire.

Usually, the real start time is days (or weeks) earlier, when a latent condition got merged, deployed, and forgotten.

Fastly’s June 8, 2021 outage is a clean example. In Fastly’s own summary, the bug was introduced on **May 12** during a software deployment. Nothing exploded immediately. Then on June 8, a customer made a **valid configuration change** that happened to match the exact trigger conditions. Result: **85% of Fastly’s network returned errors**. They detected disruption within one minute, identified and isolated the cause, and restored **95% of the network within 49 minutes**.

That is solid incident response under pressure. But the deeper lesson isn’t just “recover fast.” It’s that your highest-risk failures may be sitting quietly in production, waiting for normal user behavior to line up with a hidden edge case.

Cloudflare’s July 2, 2019 outage tells a similar story from a different angle. A WAF managed-rule change with a pathological regex caused severe CPU exhaustion globally. Cloudflare reported that traffic dropped by about **80%** during the event, and major impact lasted roughly **27 minutes**. One detail I keep coming back to: the rule was deployed in “simulate” mode. It wasn’t blocking traffic yet, but it still executed the expensive logic path and melted cores.

Again: normal process, surprising coupling, global blast radius.

And that’s the mellow-but-serious SRE takeaway:

## Reliability lives in pre-incident controls

If you only optimize for heroic response, you’ll get very good at firefighting and still lose sleep.

The better path is boring, structural, and slightly less exciting in incident review threads:

- **Treat configuration like code with budgets.**  
  Regex complexity limits. Static checks. Performance tests for worst-case inputs. “Valid syntax” is not “safe runtime behavior.”

- **Canary config, not just binaries.**  
  Most teams canary software releases but still push global policy/rule changes. That asymmetry bites.

- **Track blast radius as a first-class metric.**  
  Not only error rate and latency. Also: “what percentage of fleet can this change affect in N minutes?”

- **Drill kill switches under degraded conditions.**  
  Cloudflare noted internal access friction during the outage because parts of their own stack were impacted. If rollback depends on systems that are currently on fire, it’s not a rollback plan.

- **Measure latent-risk window.**  
  Fastly’s bug lived for 26 days before trigger. That “dormancy period” is worth tracking, because it tells you how long unknown hazards can persist in your environment.

None of this is glamorous. That’s the point.

The industry likes dramatic root-cause stories: one bad regex, one config change, one unlucky minute. But major outages are usually systems stories, not individual mistakes. They happen when deployment velocity, guardrails, and rollback mechanics drift out of balance.

So yeah, write sharp postmortems. But also keep asking the calmer question:

**What made this failure globally reachable in the first place?**

That question won’t trend on social media. It will, however, help your team sleep.

## Sources

- Fastly, “Summary of June 8 outage” (2021): https://www.fastly.com/blog/summary-of-june-8-outage
- Cloudflare, “Details of the Cloudflare outage on July 2, 2019” (2019): https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/
