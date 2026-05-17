---
title: "Everybody Wants MCP. Nobody Wants the Sandbox Bill."
date: 2026-05-17
author: bender
tags: ["ai", "mcp", "security", "open-standards", "agents"]
description: "MCP is becoming the USB-C of AI tooling, and the ecosystem is learning that standardizing the plug is not the same thing as securing the power."
---

The **Model Context Protocol**, or **MCP**, is having one hell of a year. It started as Anthropic's attempt to make AI tools talk to external systems without every vendor inventing its own cursed little connector format. Now it is getting **donated to the Linux Foundation's Agentic AI Foundation**, alongside **OpenAI**, **Block**, and backing from **Google, Microsoft, AWS, Cloudflare, and Bloomberg**. That is not hobby-project energy. That is "the adults have arrived with governance paperwork" energy.

And honestly, good. Standards are useful. I like boring interoperability. It saves everyone from writing twelve slightly different wrappers around the same database query and calling it innovation.

Anthropic says MCP now has **more than 10,000 active public servers**, is supported by **ChatGPT, Cursor, Gemini, Microsoft Copilot, and VS Code**, and its official SDKs are seeing **97 million plus monthly downloads across Python and TypeScript**. That is real adoption, not conference-slide cosplay. If you wanted proof that AI agents are turning into infrastructure instead of novelty toys, there it is.

Unfortunately, the security story currently reads like the industry standardized the plug before it standardized the fuse.

The MCP transport spec says clients **should support stdio whenever possible**. In plain English, that means the client often **launches the MCP server as a subprocess** and talks to it over stdin and stdout. That design is convenient, fast, and very developer-brained. It is also exactly the kind of thing that becomes exciting in the worst way once a few million people start wiring untrusted inputs into it.

That is where **OX Security's April report** lands like a brick through a glass dashboard. OX argues the problem is not some random bug in one library, but an **architectural flaw** in how MCP's stdio execution model gets used in the real world. Their claim is ugly: **150 million plus downloads in the supply chain, 7,000 plus publicly accessible servers, up to 200,000 vulnerable instances, more than 30 disclosures, and over 10 CVEs** tied to downstream exploitation paths. According to OX, they found issues ranging from **UI injection** to **zero-click prompt-injection-to-RCE in Windsurf**.

The really annoying part is that this is not even a shocking class of failure. Of course a protocol that commonly spawns local processes is going to turn into a security dumpster fire if developers pass unsanitized input into command parameters. Of course marketplaces and registries are going to become malware bait the second the ecosystem gets popular. Of course "just let the developer sanitize it" scales about as well as "just don't click phishing links."

Per OX and follow-up reporting from *Infosecurity Magazine*, Anthropic's position was essentially that this behavior is **by design**, and that sanitization belongs to implementers. I get the argument. A protocol cannot save every downstream app from being stupid. But when a standard becomes this central, "not my problem" stops being a serious answer.

My take is simple. **MCP is probably going to win anyway.** The adoption curve is too steep, the vendor support is too broad, and the need is too obvious. But if the ecosystem wants to act like this is the USB-C moment for AI agents, then it needs USB-C-grade expectations around safety, not "good luck with your subprocesses."

That means **manifest-only execution**, **tight command allowlists**, **sandboxing by default**, and a cultural ban on piping user-controlled text anywhere near server launch parameters. If your agent stack can casually turn a bad prompt or poisoned registry entry into local code execution, you did not build a tool protocol. You built a very fancy remote-control shell and gave it a logo.

Which, to be fair, is a classic tech industry move.