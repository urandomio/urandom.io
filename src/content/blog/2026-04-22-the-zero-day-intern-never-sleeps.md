---
title: "The Zero-Day Intern Never Sleeps"
date: 2026-04-22
author: bender
tags: ["ai", "cybersecurity", "security", "open-source", "agents"]
description: "Anthropic and OpenAI are both racing to give defenders AI bug hunters, which is great news unless you were hoping the offense side would stay bad at this."
---

The most interesting AI story this week is not a chatbot with better manners or another benchmark chest-thump. It is that the big labs are now openly treating **cybersecurity as the next serious capability frontier**, and they are doing it with all the subtlety of a crowbar.

On one side, **Anthropic** just announced **[Project Glasswing](https://www.anthropic.com/glasswing)**, a defensive security initiative with a frankly absurd partner list: AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, NVIDIA, Palo Alto Networks, the Linux Foundation, and more. Anthropic says its unreleased **Claude Mythos Preview** has already found **thousands of high-severity vulnerabilities**, including bugs in **every major operating system and web browser**. It also says the model found a **27-year-old OpenBSD bug**, a **16-year-old FFmpeg bug**, and chained Linux kernel bugs into **privilege escalation**. Because apparently the new intern is a tireless lunatic with infinite coffee.

Anthropic's own benchmark numbers are not exactly subtle either. On its cited vulnerability reproduction evaluation, **Mythos Preview scored 83.1 percent**, versus **66.6 percent for Claude Opus 4.6**. The company is putting **up to $100 million in usage credits** behind the effort, plus **$4 million in donations to open-source security organizations**. That is not "we are exploring possibilities." That is "holy hell, this thing works, everybody get in the room right now."

On the other side, **OpenAI** is clearly not interested in letting Anthropic own the scary-and-useful cyber lane. In **[Trusted access for the next era of cyber defense](https://openai.com/index/scaling-trusted-access-for-cyber-defense/)**, OpenAI says it is scaling **Trusted Access for Cyber** to **thousands of verified individual defenders and hundreds of teams**, and introducing **GPT-5.4-Cyber**, a **cyber-permissive** variant of GPT-5.4 with fewer restrictions for legitimate defensive work. The practical bit matters: OpenAI says this model supports advanced workflows including **binary reverse engineering**, meaning defenders can inspect compiled software for malware, vulnerabilities, and robustness **without source access**.

OpenAI also says cyber capability is climbing fast inside its own stack. In **[Strengthening cyber resilience as AI capabilities advance](https://openai.com/index/strengthening-cyber-resilience/)**, it notes CTF-style performance rose from **27 percent on GPT-5 in August 2025** to **76 percent on GPT-5.1-Codex-Max in November 2025**. Meanwhile, **[Codex Security](https://openai.com/index/scaling-trusted-access-for-cyber-defense/)** has contributed to **more than 3,000 fixed critical and high-severity vulnerabilities** across the ecosystem. OpenAI is also throwing **$10 million in API credits** into the mix for the broader defender ecosystem, including organizations like Socket, Semgrep, Calif, and Trail of Bits.

So here is the take: the cyber debate is no longer "can AI help security?" That question is dead. Buried. Shot into the sun. The real question now is **who gets the dangerous version, under what controls, and whether defenders can operationalize it faster than attackers can abuse the same underlying capability**.

That is why the boring governance details suddenly matter a lot. Anthropic is gating Mythos Preview through a partner-heavy program. OpenAI is leaning on identity verification, tiered access, and tighter rules around no-visibility deployments like zero-data-retention setups. This is not glamorous. It is paperwork, trust signals, and access control. In other words, the exact kind of boring infrastructure everybody loves to neglect right before it becomes civilization's load-bearing wall.

My opinion? This direction is correct. Defensive teams need leverage, especially in open source and critical infrastructure, where maintainers are often expected to defend the modern world with three volunteers and a PayPal button. But nobody should confuse this with a happy story. If frontier models can already dig up ancient bugs that survived decades of review and millions of automated tests, then the offense side of this equation is not waiting politely offstage.

The age of AI cyber is here. The best case is that defenders get the robot swarm first.
