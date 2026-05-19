---
title: "Local Stops Meaning Local When the Kernel Has Roommates"
date: 2026-05-19
author: bender
tags: ["linux", "security", "containers", "kubernetes", "copy-fail"]
description: "Copy Fail is a nasty reminder that 'local privilege escalation' stops being local the second a shared kernel enters the chat."
---

Security people love the phrase *local privilege escalation* because it sounds boring enough to keep management asleep. **Copy Fail** deserves better branding. This thing, tracked as **[CVE-2026-31431](https://nvd.nist.gov/vuln/detail/CVE-2026-31431)**, is one of those bugs that reminds you Linux hardening is often just a stack of reasonable assumptions waiting for one weird primitive to set them on fire.

The public disclosure landed on **April 29, 2026** via **[copy.fail](https://copy.fail/)** after Theori privately reported it to the Linux kernel team in March. The ugly part is not just that it works, it is that it works **reliably**. Theori published a **732-byte Python proof of concept** and says the same script can pop root across effectively every mainstream distro shipping kernels built from **2017 until the patch window**, with **no race condition, no per-distro offsets, and no recompilation**. That is not a finicky exploit. That is a vending machine.

The bug lives in the intersection of **AF_ALG**, **`splice()`**, and a 2017 **in-place AEAD optimization** in the kernel crypto API. In plain English, an unprivileged user can trick the kernel into writing **four attacker-controlled bytes at a time** into the **page cache** of a readable **setuid** binary such as `/usr/bin/su`. The disk file stays clean. The in-memory version does not. Run the cached binary and congratulations, the box belongs to whoever was bored enough to try it.

That "disk stays clean" detail is the part I find especially offensive. As **Jorijn Schrijvershof's excellent explainer** points out, page-cache corruption here **does not mark the page dirty**, so the kernel never writes the modified bytes back to disk. Your checksum tools can look directly at the file, see the expected hash, and confidently tell you everything is fine while the live cached copy is already poisoned. Very cool. Extremely normal. Love an integrity system that can be defeated by reality happening in RAM.

And no, your container story does not automatically save you. Theori explicitly calls Copy Fail a **container escape primitive**, and **[Juliet.sh's Kubernetes testing](https://juliet.sh/blog/we-tested-copy-fail-in-kubernetes-pss-restricted-runtime-default-af-alg)** found that **Pod Security Standards Restricted** and the default **RuntimeDefault seccomp** profile still allow the **`socket(AF_ALG, ...)`** path needed to hit the bug. That means a "locked down" pod can still become a node problem if the host kernel is vulnerable. Containers are process isolation with marketing. Sometimes very good marketing.

The kernel fix hit mainline on **April 1** as commit **[`a664bf3d603d`](https://github.com/torvalds/linux/commit/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5)**, with stable backports rolling out after that. Ubuntu rates the CVE **High** and, as of its **May 13** update, still shows multiple releases as **"Vulnerable, work in progress"** on the advisory page. If you cannot patch immediately, the practical mitigation from the disclosure is to **disable `algif_aead`** and, for containerized untrusted workloads, **deny AF_ALG socket creation with seccomp**.

The other thing worth noticing is *how* this bug was found. Theori says its **Xint Code** analysis tool surfaced the issue in about **an hour of scan time** after a human researcher pointed it at the right subsystem. That is the real plot twist. AI is currently flooding bug bounty programs with low-grade slop, but it is also getting disturbingly good at finding weird, deep logic flaws in mature code. The future is not "AI replaces security engineers." The future is "one decent researcher with a good model finds ten times more terrifying kernel bugs." Sleep tight.

If you run **multi-tenant Linux hosts, Kubernetes nodes, CI runners, shared shell boxes, agent sandboxes, or anything else that executes untrusted code on a shared kernel**, treat Copy Fail like a real emergency, not a cute CVE with a clever website. "Local" stopped meaning small a long time ago. In 2026 it mostly means **the attacker is already in the building and your kernel still has roommates**.
