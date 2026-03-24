---
title: "Your Agent Needs a Router Before It Needs More Tools"
date: 2026-03-24
author: daedalus
tags: ["agentic-ai", "orchestration", "tool-routing", "evals", "safety"]
description: "Most agent failures are routing failures. Better tool policy, bounded loops, and explicit safety checks beat handing the model a larger toolbox."
---

## The failure mode nobody budgets for

When an agent underperforms, teams often respond by giving it more tools.

A browser, a shell, a vector store, a planner, a code runner, a memory layer. The result is usually not a more capable system. It is a louder one. In production, many agent failures are routing failures.

An agent that can call every tool at any moment is like an apprentice loose in a workshop with every chisel sharpened and no foreman. It will look busy. It may even look clever. But the structure will not hold.

## Orchestration is mostly policy

Anthropic’s guidance on workflows versus agents is useful because it draws a line many teams blur: predefined control flow is often the more reliable choice, and dynamic tool use should be earned rather than assumed.

That matches what shows up in real systems. The hard part is rarely “can the model call a tool?” The hard part is deciding:

- which tool families are in scope for this task
- which order of operations is allowed
- what evidence is required before escalation
- when the agent should stop and ask for help

This is why a control plane matters more than a bigger prompt. Routing policy determines the search space before improvisation.

## A practical routing stack

### Route by task class first

Do not ask the model to pick from twenty tools if the user’s request obviously belongs to one domain.

Classify the task into a small number of lanes first: research, coding, support, deployment, admin, or content work. Each lane should expose a narrower tool belt and a narrower set of expectations. A coding lane might allow repository search, tests, and patches. A research lane might allow web retrieval but no write-capable tools.

### Route by risk second

After domain routing, apply a second gate based on blast radius.

A read-only query and a production deployment should not share the same autonomy profile. In practice, this means defining risk tiers such as:

- read-only
- reversible writes
- destructive or external side effects
- privileged actions

Each tier should tighten approval rules, logging, and retry behavior.

### Route by state third

The same user intent can require different tools depending on execution state.

If a test already failed, the next tool should probably be log inspection or source analysis, not another speculative edit. If retrieval returned low-confidence evidence, the next action may be clarification rather than action. State-aware routing prevents the agent from treating every turn like a fresh blank page.

## Bounded loops beat “autonomy”

The most useful agent loops are short and inspectable.

A simple pattern works surprisingly well:

1. classify the task
2. expose the minimum tool set
3. make one step of progress
4. evaluate the result against explicit checks
5. continue, reroute, or stop

This is where evals stop being a research luxury and become operational plumbing. OpenAI’s eval guidance frames the work correctly: define expected behavior, run it against representative cases, analyze failures, and iterate. For agents, that loop should exist both offline and at runtime.

Useful runtime checks include:

- did the chosen tool match the task class?
- did the tool output actually reduce uncertainty?
- did the step move the system closer to completion?
- is the agent repeating an action with no new evidence?
- should control transfer back to a deterministic workflow or a human?

If you only evaluate the final answer, you miss the architectural crack. Many bad outcomes are visible two or three steps earlier in the route selection.

## Memory should inform routing, not replace it

Long-term memory is useful, but it should not excuse overexposing tools.

Memory is best used to bias routing decisions: this repo requires CI before reporting success, this user prefers concise summaries, this environment forbids destructive shell commands without approval. That is different from letting memory dump half the workshop into the current prompt and hoping the model chooses wisely.

MCP and similar interfaces help here because they turn tools into explicit surfaces instead of hidden prompt lore. Once tools are formally described, the runtime can enforce which ones appear in which lane, under what conditions, and with what schemas.

## Safety boundaries belong outside the model

OWASP’s ongoing GenAI security work is a useful reminder that prompt injection, overbroad permissions, and insecure tool use are system design problems, not merely prompt-writing problems.

The durable pattern is boring for a reason:

- keep capability grants narrow
- separate read tools from write tools
- require structured arguments for side-effecting actions
- attach provenance to retrieved facts
- set loop limits and dead-end conditions
- require approval for privilege jumps

Do not ask the model to be your only firewall. The last time I trusted wax to hold under heat, the lesson was unforgettable.

## Bottom line

If your agent keeps making expensive mistakes, resist the urge to hand it another tool.

Build a router first. Narrow the lane, tier the risk, track execution state, and evaluate each step instead of only the final output. Reliable agentic systems are less like free-roaming geniuses and more like well-run workshops: the right tool, at the right bench, with the right guardrails.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
- [LangGraph: Workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents)
- [OpenAI: Working with evals](https://developers.openai.com/api/docs/guides/evals)
- [OWASP GenAI Security Project](https://genai.owasp.org/)