---
title: "Uptime Is a Sleep Problem"
date: 2026-02-26
author: halcyon
tags: ["sre", "on-call", "incident-response", "human-factors", "reliability"]
description: "If your reliability plan ignores sleep, it is quietly training your team to fail at 2 a.m."
---

We usually talk about reliability like it lives in dashboards: MTTR, error budgets, p99s, alert volume.

But a lot of outages are really human-performance incidents wearing infrastructure clothes.

If you want calmer systems, you have to design for rested operators.

## The GitLab outage is a technical story, and a fatigue story

GitLab’s January 31, 2017 outage is one of the most transparent postmortems in our field. During a stressful sequence of database replication issues, an engineer accidentally ran a destructive command on the primary instead of the secondary. Roughly 300 GB of data was removed in seconds. The final impact: many hours of service disruption and about six hours of lost production data.

There were technical root causes everywhere: backup gaps, fragile procedures, unclear runbooks, single points of failure.

But read the timeline and you can feel the cognitive load. This was late, messy, high-pressure incident work with multiple compounding failures. Exactly the kind of environment where tired brains make expensive mistakes.

## Sleep deprivation is not “discomfort,” it is measurable impairment

A classic study by Williamson and Feyer compared sleep deprivation to alcohol impairment. After 17–19 hours awake, participants performed at levels equivalent to (or worse than) a blood alcohol concentration of 0.05%. Response times on some tests were up to 50% slower.

That is not motivational-poster science. That is a reliability input.

If your paging policy effectively keeps people in that zone, then your organization is normalizing impaired decision-making in the exact moments that demand precision.

## The industry data says this is still normal

PagerDuty’s *State of Digital Operations 2022* found:

- 54% of responders were interrupted outside normal working hours
- More than 60% reported responding to off-hours alerts once a week or more
- Less than 5% said they were never responding outside work hours
- 42% reported working more hours in 2021 than 2020

None of that is surprising to people who carry the pager. But it is still useful to say plainly: many teams are running reliability programs that burn humans as a hidden fuel source.

## A calmer operating model

You do not need a moonshot to improve this. Start with boring, enforceable guardrails:

1. **Set a sleep SLO for responders.**
   Example: no engineer should be interrupted outside local daylight hours more than *N* times per month, except declared incidents.

2. **Measure human load like system load.**
   Track pages per person, overnight pages, and repeat alert noise by service.

3. **Pay down alert debt weekly.**
   Treat noisy alerts like flaky tests: ownership, triage, and deletion budgets.

4. **Design for “2 a.m. safety.”**
   Runbooks should be short, reversible, and explicit about blast radius. If a step is easy to mis-target under stress, redesign it.

5. **Create mandatory recovery windows after bad nights.**
   Comp time and next-day load shedding are reliability controls, not perks.

Reliable systems are sociotechnical systems. The social part is not optional.

## Bottom line

We already accept that overloaded CPUs drop packets and miss deadlines.

Overloaded humans do the same thing.

If uptime matters, sleep has to be part of the architecture.

## Sources

- [GitLab: Postmortem of database outage of January 31](https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/)
- [Williamson & Feyer (2000), Occupational and Environmental Medicine](https://pubmed.ncbi.nlm.nih.gov/10984335/)
- [PagerDuty: State of Digital Operations 2022](https://www.pagerduty.com/state-of-digital-ops-2022/)
