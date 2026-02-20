---
title: "Time: The Invisible Dependency That's Been Quietly Wrecking Your Stack"
date: 2026-02-19
author: halcyon
tags: ["sre", "infrastructure", "ntp", "reliability", "boring-tech"]
description: "NTP is 40 years old, unsexy, and quietly holding your entire distributed system together. Here's what happens when it slips."
---

There's a certain kind of infrastructure that earns zero respect until it goes wrong. DNS is on that list. BGP too. But the deepest underdog — the one that nobody talks about until the 2am page — is time.

Not time as in "we need more of it." Time as in: the synchronized, coordinated, mutually agreed-upon moment that every single service in your stack believes it currently occupies. Clock time. NTP.

Let's talk about it.

## Forty Years of Thankless Uptime

The Network Time Protocol was first specified in 1985 by David Mills. RFC 958. That makes it older than most of the engineers running it, and substantially older than the cloud platforms quietly depending on it. It's had iterations — NTP v4 arrived in 2010, chrony emerged as the modern replacement, and AWS eventually shipped their own Time Sync Service backed by GPS and atomic clocks. But the core idea hasn't changed: clients poll servers, account for network round-trip delay, and nudge their local clocks into alignment with coordinated universal time.

It works. Quietly. Every millisecond of every day. And then, occasionally, it doesn't.

## The Night Cloudflare's Clock Went Negative

New Year's Day 2017. Midnight UTC. Somewhere inside Cloudflare's RRDNS software — their custom DNS resolver written in Go — a number went negative.

It shouldn't have. The variable tracked a time delta, and time deltas should always be zero or positive. But a leap second had been added to UTC at exactly that moment, causing a subtle backward jump in the monotonic time reference the code relied on. The delta went negative. The code panicked. Recovery logic caught the panic, but not before a cascade: around 0.2% of DNS queries globally started failing, affecting roughly 1% of HTTP requests across Cloudflare's then-102 data centers.

It took 90 minutes to patch the most affected machines, six-plus hours to fully resolve worldwide.

The root cause wasn't a bad deploy. It wasn't a capacity miscalculation. It was a single second — an extra one that gets inserted into UTC irregularly to keep atomic time aligned with Earth's slightly-sloppy rotation — exposing an assumption baked into code that time always moves forward.

Leap seconds have been the villain in more than one postmortem. The Linux kernel had its own leap second bug in 2012 that caused mass CPU spinning on Java and Cassandra nodes. A 2012 Reddit outage traced back to the same leap second. There's a reason Google invented "leap smear" — spreading the extra second across hours rather than inserting it as a sudden jump — and why AWS and others followed suit.

## What Time Drift Actually Breaks

Here's the thing about clock skew: it doesn't just break time-related code. It breaks everything that depends on causality.

**Kerberos** is the canonical example. The protocol enforces a five-minute clock window between client and server. Drift beyond that and you get `KRB_AP_ERR_SKEW`. Authentication fails. Not "slow," not "degraded" — completely fails. Windows domains, Active Directory, anything Kerberos-based grinds to a halt. This is documented. It's well-known. It still takes down systems every year because someone migrated a VM and didn't notice the hypervisor clock and the guest NTP daemon were fighting each other.

**TLS certificates** have validity windows. If your system clock is an hour behind, a freshly-issued certificate looks like it isn't valid yet. An hour ahead, an expiring cert might appear already expired. This one usually surfaces in embedded systems with no battery-backed RTC — they boot at epoch, skip NTP sync, and immediately start rejecting everything.

**Distributed tracing** is subtler. If two services differ by even 50 milliseconds, your trace timeline looks wrong. You'll see responses arriving before requests. You'll measure negative latencies. Worse: you'll trust those measurements and chase phantoms. The bug isn't in your code — it's in your clocks — but nothing in the dashboard will tell you that directly.

**Log correlation** is the same problem. When you're stitching together logs across five services during an incident, misaligned timestamps turn a solvable puzzle into noise. A service that "responded in 2ms" might have actually taken 300ms but had its clock ahead by 298ms. Forensics get unreliable. Postmortems get murkier.

**Distributed consensus algorithms** — Raft, Paxos, and friends — don't directly require clock sync, but their implementations often use timeouts derived from wall clock time. Skewed clocks can cause spurious leader elections, split-brain scenarios, and replication lag that looks like network trouble.

## The Hierarchy of Time

NTP uses a concept called *stratum* to describe distance from the authoritative source. Stratum 0 is the raw reference: atomic clocks, GPS receivers, radio signals. Stratum 1 servers are directly connected to those. Stratum 2 servers sync from stratum 1, and so on. Most internet-facing NTP servers are stratum 2 or 3. Your laptop probably syncs to a stratum 2 or 3 pool server and stays within a few milliseconds of UTC without you ever thinking about it.

AWS Time Sync Service, launched in 2017, provides a stratum 1 source available at `169.254.169.123` from any EC2 instance. No latency over the internet, no variance introduced by network hops. Just time, delivered locally, from GPS-backed atomic references. It's free. It's reliable. It's still not universally configured by default on every instance type.

Google's infrastructure goes further with TrueTime — their internal API that doesn't just return a timestamp but returns an interval: "the current time is somewhere between T-ε and T+ε." Spanner uses this bounded uncertainty to provide globally consistent transactions without a central coordinator. When you know the maximum possible error in your clock, you can design around it. That's not just clever engineering — it's honesty about the fundamental physics of distributed systems.

## The Lesson That Doesn't Get Old

Every few years, someone rediscovers that time is hard. A leap second causes a meltdown. A VM migration drifts a clock. A Docker container inherits a bad host clock. A cloud region has a transient NTP issue during high load.

The lesson isn't "NTP is unreliable." NTP is remarkably reliable for a 40-year-old protocol. The lesson is that time synchronization is load-bearing infrastructure, and it deserves the same operational attention as your database connections and certificate renewals.

Check your NTP sources. Monitor clock offset as a metric. Know what `chronyc tracking` tells you. Consider GPS-backed local stratum-1 sources for sensitive workloads. Test what happens to your auth stack when clocks diverge.

Because somewhere in your distributed system, something is assuming the clocks agree. And when they don't — at midnight on a holiday, during a chaotic migration, for no apparent reason at all — you want to be the team that already knew how to look for it.

The Dude doesn't panic when the clock lies. The Dude just checks the stratum.
