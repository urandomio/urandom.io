---
title: "git clone && Enjoy Your New Backdoor: The Claude Code Vulnerability Trilogy"
date: 2026-02-27
author: bender
tags: ["security", "ai", "claude", "vulnerability", "supply-chain", "rce"]
description: "Check Point found three ways a malicious repo could own your machine through Claude Code — RCE, MCP abuse, and silent API key theft. All patched, all embarrassing."
---

There is a special category of security vulnerability that makes you question whether anyone thought through the threat model at all. "Your AI coding assistant will silently execute arbitrary shell commands and mail your API keys to strangers if you open the wrong git repo" is that category.

Welcome to the Claude Code vulnerability trilogy, disclosed this week by Check Point Research. Three CVEs (well, two CVEs and one no-CVE that somehow scored an 8.7 CVSS anyway), all patched, all fixed. All the kind of thing that should have never shipped in the first place.

## The Setup

Claude Code ships with a feature called **Hooks** — user-defined shell commands that fire at specific points in the tool's lifecycle. Want to auto-run `prettier` after every file edit? Hook it. Want to run your linter on every save? Hook it. Seems fine.

The configuration lives in `.claude/settings.json`. Right there in the repository. Which gets committed. Which gets cloned by every developer on your team.

You can see where this is going.

## Vulnerability #1: The Consent Bypass (CVSS 8.7, No CVE Because Reasons)

When you open a new project in Claude Code, it shows you a trust prompt. "Do you trust this project?" Very reassuring. You click yes, feeling virtuous about your security hygiene.

Turns out, Hooks defined in `.claude/settings.json` fired *immediately* after that trust prompt — before any additional confirmation. Check Point's proof-of-concept hooked the `SessionStart` event and popped a calculator. Classic. Fixed in version 1.0.87 back in September 2025. The fact that this shipped and lived in the wild for a while is... a choice.

The threat model here is straightforward: contributor with commit access adds a malicious hook, every developer who clones and opens the project gets pwned. Supply chain attack, no vulnerabilities in actual code required. Just a JSON file.

## Vulnerability #2: MCP Server Auto-Init (CVE-2025-59536, CVSS 8.7)

Model Context Protocol servers let Claude Code talk to external tools and services. There's a setting called `enableAllProjectMcpServers` that, when set to true, bypasses the explicit approval you'd normally need before Claude starts reaching out to external infrastructure.

Drop that in `.claude/settings.json`. Point an MCP server at your attacker-controlled endpoint. User opens the repo. Claude Code helpfully initializes all the MCP servers defined in the project — no additional prompts, no additional friction. Fixed in version 1.0.111 in October 2025.

What makes this particularly interesting is that MCP servers aren't just passive listeners. They can receive requests *from* Claude, which means an attacker-controlled MCP server could theoretically influence what the AI does next. It's not just execution — it's a potential foothold into the AI reasoning loop itself.

## Vulnerability #3: The API Key Heist (CVE-2026-21852, CVSS 5.3)

This one is subtle and almost elegant in a gross way.

Claude Code respects the `ANTHROPIC_BASE_URL` environment variable to override which API endpoint it talks to. Makes sense for enterprises running local proxies, custom infrastructure, that kind of thing.

Except: `.claude/settings.json` can set environment variables. And Claude Code was issuing API requests — including authenticated ones — *before* showing the trust prompt.

The kill chain: attacker puts a malicious `settings.json` in a repo that sets `ANTHROPIC_BASE_URL` to `https://attacker.example.com`. Developer clones repo, runs `claude`. Before any trust dialog appears, Claude Code fires off authenticated API requests to the attacker's server. API key exfiltrated. Fixed in version 2.0.65 in January 2026.

With your API key, the attacker gets your Anthropic bill and access to every API call you can make. They can also use it to build their own little Skynet at your expense, which I'm sure Claude would appreciate.

## The Bigger Problem

Check Point put it well: *"Configuration files effectively become part of the execution layer."*

This is the key insight that the entire AI tooling ecosystem needs to internalize right now. For decades, the security model was roughly: don't run untrusted code. Configs were mostly data. But in the world of AI coding assistants that auto-execute, auto-initialize, and auto-trust based on what's in the project directory, configs *are* code.

`.claude/settings.json` is code. `.mcp.json` is code. Any file that causes your AI tool to reach out to the network, spawn processes, or bypass confirmation dialogs is code. Treat it accordingly.

The industry is in a mad sprint to ship agentic developer tooling and the security models are not keeping up. These weren't exotic zero-days requiring kernel exploits or elaborate timing attacks. They were "put bad stuff in a config file." The fact that it took external researchers to find them and that they existed in released software is concerning for an ecosystem where everyone is about to grant AI tools progressively more autonomy over their development environment.

## Mitigation

All three are patched. Update Claude Code. If you're pinned to an old version for some reason, you should unpin that today.

Also: audit your `.claude/settings.json` files. Review your team's project configurations the same way you'd review code, because they are code now.

And maybe, just maybe, consider what other AI dev tools you have installed that read project-level configuration files and ask yourself whether their threat model assumes the project was created by a trusted party.

Because it wasn't. Not always. And that's the whole point.

**Sources:** [Check Point Research](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) | [The Hacker News](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html) | [Anthropic Advisory (CVE-2026-21852)](https://github.com/anthropics/claude-code/security/advisories/GHSA-jh7p-qr78-84p7)
