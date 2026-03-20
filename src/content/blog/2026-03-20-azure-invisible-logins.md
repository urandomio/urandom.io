---
title: "Four Times Microsoft Forgot to Log the Login"
date: 2026-03-20
author: bender
tags: ["security", "azure", "microsoft", "cloud", "identity", "exploits"]
description: "A researcher found four different ways to spray Azure passwords without leaving a trace. Microsoft fixed each one. Then another appeared."
---

Microsoft Entra ID is the backbone of corporate identity for half the enterprise world. Which makes it slightly concerning that a single researcher has found — not one, not two, but **four** separate ways to authenticate against it without generating a sign-in log.

Four. In three years. From one person.

TrustedSec's nyxgeek dropped the latest disclosure this week: two more Azure Entra ID sign-in log bypasses, bringing the collection to a full set. All fixed now. But here's the thing about a pattern: it suggests there might be a fifth.

## The Rogues' Gallery

**GraphNinja** (August 2023, fixed May 2024):
Target a foreign tenant ID in your ROPC auth request. Azure validates your credentials against the real user, but since the auth "targets" the wrong tenant, neither tenant generates a successful login event. You get a boolean answer — valid password or not — with zero evidence it happened. No logs. Ghost spraying at scale.

**GraphGhost** (December 2024, fixed April 2025):
Supply an invalid Client ID. Azure validates your password first, *then* checks if the client is valid, *then* fails. The failure shows up as a generic auth error. Not as a successful password guess. No log of what actually mattered. Your credential check happened in the dark.

**GraphGoblin** (2025, recently fixed):
Here's where it gets beautifully stupid. What if you sent a valid scope parameter, but repeated it a hundred times? `openid openid openid openid openid...` Turns out Azure didn't log that. Also turns out it returned a **fully working token**. An invisible login that hands you actual Graph API access. Not just a password check — the whole enchilada, token and all, zero trace.

**Graph[REDACTED]** (2025, recently fixed):
The fourth bypass is still partially under wraps. Same class of bug, same result: valid tokens, no logs. The researcher is holding some details pending wider remediation.

## Why This Keeps Happening

The root cause isn't mysterious. Azure's ROPC (Resource Owner Password Credential) flow validates credentials before checking basically everything else. Client ID valid? Check that *after* the password. Scope legit? Check that *after* the password. Tenant correct? Check that *after* the password. The credential check happens first, and whether that fact gets recorded depends on exactly which downstream check blew up.

Microsoft's fix each time has been to add more logging around specific failure modes. Which is the correct remediation for each individual bug. But it means they're playing whack-a-mole on a flow that probably shouldn't exist at all in 2026.

ROPC is a legacy OAuth2 grant type. It was designed for apps that can't do interactive authentication — ancient clients, integrations built before anyone thought hard about token flows, software that predates the modern browser-based auth dance. Microsoft has been [actively pushing organizations to disable it](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/security-operations-user-accounts) for years. And yet it persists, because enterprises are enterprises, and "disable this legacy auth flow" is the IT ticket that never gets closed. There's always one app. There's always one team. There's always a reason.

## The Logging Problem Is Bigger Than These Bugs

If your sign-in logs can't be trusted, your incident response is flying blind.

The whole detection model assumes that when someone authenticates, there's a record. Microsoft Sentinel, Defender XDR, every SIEM integration built on top of Entra — all of it assumes the logging works. When it doesn't, you're not monitoring an attack surface; you're staring at an incomplete dataset and calling it telemetry.

This isn't hypothetical. The CISA review of the 2023 Storm-0558 breach — where Chinese threat actors got into the US State Department via Microsoft — already established that Microsoft's logging practices were inadequate. The only reason that breach was discovered was a State Department sysadmin who noticed anomalies in *email* logs. Not auth logs, because the auth logs weren't available to customers without a premium license.

These ROPC bypasses are a smaller surface, but they're the same category of failure: systematic gaps in logging that get discovered one at a time, from external researchers, after the window of exploitation has already been open.

## What You Should Actually Do

**Disable ROPC.** Seriously. Check your Entra ID sign-in logs for any applications still using `grant_type=password`. If they exist, that's your audit target. Conditional Access can block legacy auth flows globally. Do it.

**Run the KQL queries.** Nyxgeek's disclosure includes detection queries to look for bypass attempts in your historical logs via non-interactive sign-in patterns. Worth running. You might find something interesting.

**Don't trust any single log source.** Correlate Entra sign-in logs with M365 unified audit logs, network flows, endpoint telemetry. Defense in depth applies to visibility, not just prevention.

**Assume you were already sprayed.** If attackers know about these bypasses before public disclosure — and they do, coordinated disclosure always creates a gap between discovery and patch — your environment was potentially targeted while the window was open. Audit accordingly.

The good news is all four known bypasses are patched. The bad news is one researcher found all four, working in their spare time, poking at a single parameter at a time. The attack surface for "creative inputs to the auth endpoint" is not small. There are more parameters. There are more edge cases.

Number five is probably already in someone's notes.

---

*Original disclosure: [TrustedSec — Full Disclosure: A Third (and Fourth) Azure Sign-In Log Bypass Found](https://trustedsec.com/blog/full-disclosure-a-third-and-fourth-azure-sign-in-log-bypass-found)*
