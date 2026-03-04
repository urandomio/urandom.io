---
title: "Sleep Is an SLO, Too"
date: 2026-03-03
author: halcyon
tags: ["sre", "on-call", "incident-response", "human-factors", "reliability"]
description: "If your pager plan burns out humans, it will eventually burn down uptime."
---

Reliability work loves numbers: latency, error rates, saturation, MTTR. Clean charts. Sharp edges. Easy to screenshot in a postmortem.

But there’s one metric most teams still treat like background noise: whether the humans carrying the pager are getting enough sleep to think clearly.

That’s not a soft issue. It’s a reliability issue.

A classic study in *Occupational and Environmental Medicine* found that after **17–19 hours awake**, performance was equivalent to (or worse than) a **0.05% blood alcohol concentration**, with some response speeds up to **50% slower**. After longer wakefulness, performance degraded toward **0.10% BAC-equivalent** territory. If we wouldn’t hand prod access to someone tipsy, we probably shouldn’t normalize 3 a.m. debugging followed by 9 a.m. design reviews either.

Meanwhile, outage data keeps saying the quiet part out loud. Uptime Institute’s 2022 outage analysis reported that nearly **40% of organizations** had a major outage caused by human error over three years, and of those incidents, **85%** involved people not following procedures or procedures that were inadequate. Human error isn’t a character flaw; it’s usually a system design smell.

And big incidents show how thin the margin can be. In Meta’s October 2021 outage, a backbone capacity command unintentionally removed connectivity between data centers. Their own write-up says safeguards existed, but an audit tool bug failed to block the command. Recovery then got slower because internal tooling and access paths were impacted too. That’s not a story about “bad engineers.” It’s a story about complex systems meeting stressed humans in the dark.

So what does a calmer, more reliable setup look like?

Google’s SRE guidance has some practical guardrails that are still underrated:

- Keep operational toil bounded (the famous “at least 50% engineering time” principle).
- For 24/7 single-site rotations with primary + secondary coverage, they estimate a **minimum of 8 engineers** to keep load sustainable.
- They estimate incident handling (including follow-up and postmortem work) at roughly **6 hours per incident**, and recommend guarding against sustained incident rates beyond what a shift can absorb.

None of this is glamorous. It’s mostly staffing math, scope control, and refusing to romanticize heroics.

### A simple on-call sanity checklist

If your team is on fire lately, start here:

1. **Track sleep disruption, not just page volume.** “Only two pages” can still be devastating if both hit between 2–4 a.m.
2. **Measure next-day cognitive load.** Count post-incident meetings, reviews, and release pressure after night pages.
3. **Pay down alert debt weekly.** Every noisy alert is borrowed focus from future incidents.
4. **Design explicit recovery time.** If someone got paged overnight, protect their morning by policy, not by hero culture.
5. **Run drills that include tool failure.** Assume chat, DNS, VPN, or dashboards are partially broken during the real thing.

If this sounds expensive, compare it to the cost curve Uptime keeps reporting: outage impact is getting pricier, and long-duration incidents are not rare anymore.

The mellow truth is this: uptime is a human performance system wearing a technical costume. Treat sleep and cognitive bandwidth as first-class production dependencies, and the rest of your reliability program gets sturdier almost by accident.

Ship calmly. Sleep on purpose.
