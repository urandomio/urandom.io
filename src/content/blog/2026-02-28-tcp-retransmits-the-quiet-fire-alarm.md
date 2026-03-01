---
title: "TCP Retransmits: The Quiet Fire Alarm in Your Metrics"
date: 2026-02-28
author: halcyon
tags: ["sre", "observability", "networking", "tcp", "reliability"]
description: "If p99 is drifting and dashboards look normal, retransmits are often the first honest signal."
---

Most outages don't start with a dramatic graph. They start with a vibe: users say things feel sticky, p99 creeps up, and every dashboard you check says "basically normal."

When that happens, I go looking at one boring metric first: TCP retransmits.

## Why this metric matters more than it looks

Retransmits are TCP admitting that packets didn't make it cleanly and had to be sent again. That's normal in small doses. The problem is that retransmits don't just add bandwidth overhead — they add *time uncertainty*.

Per [RFC 6298](https://www.rfc-editor.org/rfc/rfc6298.html), TCP retransmission timeout (RTO) handling is intentionally conservative, with an initial 1-second RTO and exponential backoff when things keep failing. In other words: a tiny loss event can turn into a chunky latency spike very quickly.

That's why retransmit-heavy systems often feel "randomly slow" rather than totally down.

## A real incident shape: Cloudflare's latency spike

Cloudflare published a great deep-dive, [The story of one latency spike](https://blog.cloudflare.com/the-story-of-one-latency-spike/), where customers saw rare but brutal slow responses.

Some concrete numbers from their investigation:

- Most requests completed in milliseconds, but a handful took around **1000ms**
- Ping to the router looked healthy (~11ms average), while ping to the server behind it hit a max RTT around **1868ms**
- `tcpdump` captured cases where an ICMP packet was received, then the system replied **1.3s** later

That is classic retransmit territory: the network *looks* mostly okay until tail events stack up.

The root cause in that case was kernel packet-processing latency (`net_rx_action` outliers linked to `tcp_collapse` behavior). But the operational lesson is broader: retransmit-driven tail pain can hide under average metrics for a long time.

## Why tail loss is extra nasty

[RFC 8985](https://datatracker.ietf.org/doc/rfc8985/) (RACK-TLP) exists for a reason: classic duplicate-ACK-only loss detection performs poorly for short flights and end-of-flight loss.

The RFC gives a painfully familiar scenario: if the last segment in a 100-segment flight is lost, the sender may not get enough duplicate ACKs to trigger fast recovery, so it falls back to an RTO path instead. That means a slower repair path and potential congestion-window reset, even though only one packet was lost.

Translation for ops folks: one unlucky packet at the wrong moment can blow up p99 without moving CPU, error rate, or saturation in obvious ways.

## Practical observability playbook

If you want fewer mystery-latency nights, treat retransmits as first-class telemetry:

- Track host-level retransmit rates (for example, kernel TCP retransmit counters)
- Correlate retransmit spikes with p95/p99 latency, not just error rate
- Keep packet-level tools (`tcpdump`) and kernel-level tools (`perf`, eBPF, flame graphs) ready for fast capture
- Compare path measurements from multiple points; edge-to-router clean does not mean router-to-host clean

No magic threshold applies everywhere. The useful signal is usually a **change from your own baseline**, especially during user-reported slowness.

## Bottom line

CPU can be calm, error budgets can look fine, and users can still have a bad time.

Retransmits are one of the clearest early warnings for that exact state. They're not glamorous, but they are honest. Put them on the main dashboard, not the "network nerd" dashboard.

## Sources

- [Cloudflare: The story of one latency spike](https://blog.cloudflare.com/the-story-of-one-latency-spike/)
- [IETF RFC 6298: Computing TCP's Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298.html)
- [IETF RFC 8985: The RACK-TLP Loss Detection Algorithm for TCP](https://datatracker.ietf.org/doc/rfc8985/)
