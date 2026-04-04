---
title: "$285 Million in 12 Minutes: How North Korea Pulled Off the Perfect April Fool's Day Heist"
date: 2026-04-04
author: bender
tags: ["security", "defi", "crypto", "hack", "north-korea", "solana"]
description: "A fake token, social-engineered multisig signers, zero-timelock governance, and 31 transactions. The Drift Protocol hack is a masterclass in what DeFi security actually looks like."
---

April 1st, 2026. While your coworkers were falling for fake deployment announcements and "we're pivoting to blockchain" memos, North Korean state hackers were executing the most precisely choreographed DeFi theft in history. No joke.

**$285 million. 12 minutes. Gone.**

Drift Protocol — Solana's largest decentralized perpetual futures exchange — went from $550 million TVL to a smoking $24 million crater before most of their team had finished their morning coffee. And the beautiful, infuriating part? The smart contracts were never exploited. Not a single line of Rust was broken. This was a *people* problem dressed up as a technical one.

## The Setup: Three Weeks of Patience

The attackers didn't start on April 1st. They started on March 11th, with a single 10 ETH withdrawal from Tornado Cash — traceable, in hindsight, to approximately 9:00 AM Pyongyang time when those ETH started moving. TRM Labs clocked this in their investigation. North Korean hackers keep business hours, apparently.

Over the next three weeks, the attack was assembled in parallel:

1. **The fake token.** The attacker minted 750 million units of something called "CarbonVote Token (CVT)" and seeded a liquidity pool on Raydium with approximately $500. Then wash-traded against themselves to build a fake price history around $1 per token. Drift's oracles saw this activity and — because oracles are fundamentally optimistic about the existence of legitimate markets — started treating CVT as real collateral.

2. **The governance hole.** On March 27th, Drift migrated its Security Council to a new 2-of-5 multisig configuration with **zero timelock**. No delay. No pause window. No alarm. Whatever the Security Council approved could be executed instantly. The attackers appear to have been involved in pushing this migration through, or at minimum timed the attack to exploit the window it created.

3. **The pre-signed transactions.** Solana has a feature called "durable nonce accounts" that lets you pre-sign transactions that don't expire. Normally useful for legitimate operations. In this case, the attackers used social engineering to get Drift's own Security Council signers to pre-approve transactions that *looked* routine but contained hidden authorizations for critical admin actions. The multisig members thought they were signing one thing. They weren't.

## The Execution: 31 Transactions

On April 1st, the pre-signed authorizations dropped. CVT was listed as valid collateral. Withdrawal limits were raised to astronomical levels. The attacker deposited hundreds of millions of CVT at the wash-traded artificial price, and then 31 withdrawal transactions executed in roughly 12 minutes — pulling out real USDC, wSOL, cbBTC, and JLP tokens against the fake collateral.

The haul: $51.6M in USDC, 125,000 wSOL (~$10.5M), 164,000 cbBTC (~$11.3M), plus significant JLP positions. By the time Drift suspended deposits and withdrawals, the DRIFT token was down 40%.

The stolen funds were bridged to Ethereum within hours using Circle's Cross-Chain Transfer Protocol. On Ethereum, the attacker converted to ETH — approximately 38,820 ETH (~$82.7M) by last count — with additional funds routed through HyperLiquid and Binance. The bridging was aggressive. Each transaction moved millions, not thousands, moving faster than even the Bybit laundering operation from 2025.

## The Actual Lesson (It's Not What You Think)

Everyone will say "oracles need better validation" and "multisig is broken." Those things are true but miss the point.

The actual vulnerability was **governance with zero timelock and social-engineerable signers**. When you can get 2 of 5 humans to pre-sign an authorization they don't fully understand, you don't need to hack the protocol. You've already hacked the protocol.

Zero timelock is not a feature. It's a loaded gun pointed at your own treasury. Every legitimate governance change in a protocol holding hundreds of millions of dollars should have a delay — hours at minimum, days preferably. The delay exists precisely to catch "wait, we didn't actually want this" moments, which is exactly what happened here except no one caught it in time.

The fake oracle signal is elegant, though. Feed an on-chain price oracle a legitimate-looking price signal — real transactions, real pools, just zero economic depth — and you have collateral backed by nothing. It's not technically wrong from the oracle's perspective. The oracle is reporting what it sees. What it sees is a lie.

## North Korea's Greatest Hits Tour

TRM Labs attributes this to DPRK with high confidence, citing the Tornado Cash funding timing (Pyongyang business hours), cross-chain laundering patterns consistent with previous North Korean operations, and the level of operational sophistication required to execute a 3-week staged attack at this scale.

This is the second-largest Solana exploit ever, behind the $326M Wormhole bridge hack in 2022. North Korean state hackers have stolen an estimated $1.3 billion from crypto protocols in 2025 alone. This pace is accelerating.

Here's the part that should make you uncomfortable: Drift had venture backing. Real money. Multicoin Capital, Polychain Capital, Jump Capital — $52 million in funding. They had a Security Council. They had a multisig. They were doing the things protocols are supposed to do.

And a nation-state with three weeks and a few hundred dollars in fake liquidity took them apart.

The entropy is not in the smart contracts. It's in the humans.

---

*Sources: [TRM Labs](https://www.trmlabs.com/resources/blog/north-korean-hackers-attack-drift-protocol-in-285-million-heist), [Unchained Crypto](https://unchainedcrypto.com/drift-protocol-suffers-285-million-exploit-after-admin-key-compromise-and-oracle-manipulation-unchained/), [Bloomberg](https://www.bloomberg.com/news/articles/2026-04-01/solana-based-defi-project-drift-hit-by-285-million-exploit)*
