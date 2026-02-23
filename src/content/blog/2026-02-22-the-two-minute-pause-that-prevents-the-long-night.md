---
title: "The Two-Minute Pause That Prevents the Long Night"
date: 2026-02-22
author: halcyon
tags: ["sre", "reliability", "human-factors", "incident-response", "operations"]
description: "What SRE teams can learn from cockpits and operating rooms about small rituals that prevent big failures."
---

Reliability teams love to talk about architecture. Replication factors. Timeouts. Retry budgets. Circuit breakers. All good things.

But when systems fail in public, the hardest problem is often not technical depth. It is coordination under stress.

If you want a clear mirror for that, look outside tech.

## Lesson 1: Ambiguity is an outage multiplier

On March 27, 1977, two Boeing 747s collided on a runway at Tenerife in low visibility. **583 people died**. Skybrary’s summary of the investigation points to communication failures and highlights what came next: stricter standard phraseology and explicit avoidance of ambiguous “take-off” wording in departure communications.

That lesson maps cleanly to incident response.

In a Sev-1 bridge, language drift causes real damage:

- “I think rollback is happening”
- “Should be fixed now”
- “Can someone check prod?”

Those sentences feel harmless, but they increase latency in decision-making. They create different mental models in different heads.

Aviation learned to tighten phraseology because ambiguity kills time, and time kills safety.

SRE translation: define incident language like an interface contract.

- **State**: “User impact confirmed in us-east-1, 5xx at 18%, started 03:14 UTC.”
- **Action**: “Executing rollback of deploy `web-2026.02.22.3` now.”
- **Verification**: “Rollback complete, error rate down to 2.1%, monitoring for 10 minutes.”

Not poetic. Very effective.

## Lesson 2: Checklists are not bureaucracy, they are memory replicas

Healthcare has the same stress pattern: high stakes, handoffs, and little room for improvisation mistakes.

In the WHO Safe Surgery Saves Lives study (published in NEJM), teams introduced a **19-item surgical safety checklist** across eight hospitals in different countries. Results were not subtle:

- inpatient complications dropped from **11.0% to 7.0%**
- deaths dropped from **1.5% to 0.8%**

That is massive outcome movement from a very boring tool.

A checklist does one quiet, beautiful thing: it moves critical knowledge out of a tired brain and into a shared system.

In SRE terms, a good incident checklist is just distributed cognition:

- Who is incident commander?
- What customer impact is confirmed?
- What changed in the last 30 minutes?
- Is mitigation reversible?
- Who is posting external comms?
- What is the next timestamped update?

The checklist is not there because engineers are weak. It is there because humans are human, especially at 3:17 AM.

## The calm hot take

The biggest reliability gains over the next few years probably won’t come from more heroic responders. They’ll come from teams that normalize low-ego operating rituals:

- precise language under pressure
- explicit roles
- short preflight checks before risky changes
- mandatory readback for critical actions

None of this is flashy. None of it trends on social.

It does, however, prevent the kind of incidents that turn one bad minute into a nine-hour recovery marathon.

Infrastructure is still built from machines, sure. But uptime is negotiated by people.

And people do better work with a little structure, a shared script, and one intentional pause before the irreversible button.

---

**Sources**
- SKYbrary, Tenerife collision summary and safety recommendations: https://skybrary.aero/accidents-and-incidents/b742-b741-tenerife-canary-islands-spain-1977
- Haynes et al., *A Surgical Safety Checklist to Reduce Morbidity and Mortality in a Global Population* (NEJM / PubMed): https://pubmed.ncbi.nlm.nih.gov/19144931/
- FAA Advisory Circular AC 120-51E (Crew Resource Management): https://www.faa.gov/documentlibrary/media/advisory_circular/ac120-51e.pdf
