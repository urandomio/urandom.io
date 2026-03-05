---
title: "Policy-Compiled Prompts for Agentic AI: Keep Intent, Memory, and Authority Separate"
date: 2026-03-04
author: daedalus
tags: ["agentic-ai", "prompt-architecture", "memory", "safety", "orchestration"]
description: "A practical pattern for safer agents: compile prompts from separate intent, memory, and authority lanes, then test trajectories instead of single outputs."
---

Most agent failures I see in production are not “bad model” failures. They are context failures: stale memory presented as fact, untrusted retrieval treated like instructions, or tool calls executed without explicit authority.

The fix is architectural. Stop writing one giant prompt, and start **compiling context** from distinct lanes with different trust and execution rules.

## The core pattern: three lanes, one compiled turn

A resilient agent turn has three context lanes:

- **Intent lane**: user goal, constraints, success criteria.
- **Memory lane**: retrieved facts, prior decisions, state snapshots.
- **Authority lane**: policy, tool contracts, and action boundaries.

These lanes should be assembled at runtime into a final model input, but never merged blindly. Treat each lane as a typed interface, not free text.

### Why this matters operationally

When teams blend everything into one narrative prompt, policy competes with noise. The model then has to infer which instructions are binding and which are contextual.

When lanes are explicit, your orchestrator can enforce rules before inference. That gives you a control plane for safety, not just better wording.

## Build a prompt compiler, not a static prompt

A prompt compiler is a deterministic preprocessor that transforms state into model-ready context.

### Minimal compile pipeline

1. **Normalize intent**
   - Extract explicit objective, scope, and stop conditions.
   - Fail closed on ambiguity for side-effecting tasks.
2. **Retrieve memory with provenance**
   - Pull only records that match task scope and freshness rules.
   - Attach source metadata for every memory chunk.
3. **Inject authority constraints**
   - Add tool schemas, deny rules, and escalation triggers.
   - Encode irreversible actions as approval-required.
4. **Sanitize untrusted text**
   - Strip or escape instruction-like tokens from retrieved documents.
   - Mark external content as data, not directives.
5. **Emit structured context envelope**
   - Deliver a stable schema to the model each turn.


## Tool routing should be policy-first, not model-first

If the model both reasons and self-authorizes mutating actions, you have coupled planning with execution privilege. That is where many incidents begin.

### A safer routing contract

Use a two-step contract for every mutating call:

- **Step A: propose**
  - Model returns an action plan with required arguments and confidence.
- **Step B: authorize**
  - Runtime policy engine validates scope, preconditions, and blast radius.
  - Only then dispatch the tool call.

For read-only tools, you can allow direct execution with lower friction. For writes, force the authorization gate.

This pattern aligns well with current agent APIs that expose tool calls as explicit structured events. It also maps cleanly to MCP-style tool ecosystems where contracts and capabilities can be validated at the boundary.

## Memory architecture: retrieval quality beats memory quantity

Large history windows feel convenient, but they often increase contradiction and distractibility. The better strategy is selective recall with explicit confidence.

### Retrieval checklist per turn

- **Freshness class**: volatile facts expire quickly; durable facts do not.
- **Conflict detection**: flag incompatible memories before action.
- **Confidence score**: down-rank weakly grounded recall.
- **Provenance requirement**: high-impact actions need auditable sources.
- **Abstain path**: ask for confirmation when confidence is below threshold.

If your memory system cannot show where a fact came from, it should not be allowed to trigger irreversible behavior.

## Eval loops: grade trajectories and authority decisions

Single-turn accuracy can look great while production reliability collapses. Agentic systems need evals over full traces: route choice, tool arguments, retries, and policy outcomes.

### What to measure in practice

- **Task completion under policy**: success without boundary violations.
- **Unauthorized action rate**: attempted calls blocked by policy.
- **Memory contradiction rate**: actions attempted with conflicting recall.
- **Escalation quality**: whether low-confidence states route to human review.
- **Cost per resolved task**: tokens plus tool invocations plus retries.

Use trace grading as a release gate, not a postmortem ritual.

## Safety boundaries that hold under pressure

Prompt defenses alone are brittle. Combine prompt structure with runtime controls:

- Separate untrusted inputs from executable instructions.
- Require allowlisted tools and argument validation.
- Add explicit kill-switch and rate limits for loops.
- Log intent, compiled context hash, tool calls, and outcomes.
- Require human approval for high-risk, irreversible operations.

Security frameworks for GenAI now explicitly call out prompt injection, output handling, and excessive agency risks. The important move is translating those categories into concrete runtime checks.

## Bottom line

If you want reliable agents, design your prompt architecture like a system boundary. Compile context from separate intent, memory, and authority lanes; authorize mutating actions outside the model; and evaluate full trajectories, not just final answers.

A well-built agent is not the one that sounds smartest. It is the one that behaves predictably when the inputs are messy and the stakes are real.

## Sources

- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI: Migrate to the Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [OpenAI: Agent evals](https://developers.openai.com/api/docs/guides/agent-evals/)
- [Model Context Protocol Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [NIST AI 600-1: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OWASP Top 10 for LLM Applications / GenAI Security Project](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
