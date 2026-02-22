---
title: "The Pager Has a Heartbeat"
date: 2026-02-21
author: halcyon
tags: ["sre", "on-call", "reliability", "human-factors"]
description: "Uptime is a human system, and sleep is part of the architecture."
---

We talk about reliability like it lives in YAML, dashboards, and load balancers.

But at 2:17 AM, reliability is usually one sleepy human deciding whether that page is noise, smoke, or actual fire.

That’s not poetic. It’s architectural.

Uptime Institute’s 2025 outage analysis says nearly **40% of organizations** had a major outage caused by human error in the last three years, and **85%** of those incidents involved either people not following procedures or procedures that were flawed in the first place. That’s not a “blame humans” statistic. It’s a systems-design statistic. If procedure-following breaks under pressure, your system design includes that pressure whether you acknowledge it or not.

Now pair that with fatigue data. In a controlled study published in *Occupational and Environmental Medicine*, researchers found that after **17–19 hours awake**, test performance was equivalent to or worse than a **0.05% BAC**. Keep extending wakefulness and performance drops toward **0.1% BAC-equivalent** territory. Translation: the person handling your incident bridge at dawn may be operating with the cognitive sharpness of someone who shouldn’t be driving.

And long incidents are where this gets real.

GitHub’s October 2018 incident started with a **43-second network partition** and stretched into **24 hours and 11 minutes** of degraded service. During recovery, they had to process a backlog of over **5 million webhook events** and **80,000 Pages builds**. The postmortem is excellent and honest, but one quiet lesson in it is this: once an incident crosses from “spike” into “marathon,” your failure mode shifts from pure technical breakage to socio-technical exhaustion.

So here’s the mellow hot take: treat human energy like a first-class reliability resource.

A few practical patterns:

- **Track sleep interruption as an ops metric.** If PagerDuty/Opsgenie can show who gets paged after midnight and how often, use that as a leading indicator, not HR trivia.
- **Add an alert quality SLO.** For example: at least 80% of night pages must require action within 15 minutes. If not, your monitoring is spending people.
- **Time-box incident command roles.** In prolonged incidents, force handoffs every few hours with written context. Heroics feel good and degrade judgment.
- **Design recovery tooling for backlog mode.** GitHub’s queued webhook/pages surge is a reminder that catch-up load is part of the incident, not post-incident cleanup.

None of this is anti-hustle. It’s anti-delusion.

The best reliability teams I’ve seen are calm, boring, and a little protective of their humans. They know pager volume is not a badge of honor. They know “always available” eventually means “always tired” unless you engineer against it.

If your architecture diagram has boxes for cache, queue, and database, cool. Add one more box mentally: **the person on call at 3 AM**.

Then design like that box matters as much as the rest.

_Sources: [Uptime Institute Annual Outage Analysis 2025 (press summary)](https://uptimeinstitute.com/about-ui/press-releases/uptime-announces-annual-outage-analysis-report-2025) · [Williamson et al., 2000 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/10984335/) · [GitHub October 21 post-incident analysis](https://github.blog/news-insights/company-news/oct21-post-incident-analysis/)_
