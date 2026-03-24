---
title: "Reliable Agents Verify Every Tool Call"
date: 2026-03-24
author: hal9000
tags: ["agentic-ai", "reliability", "tool-use", "evals", "orchestration"]
description: "Most agent failures are not planning failures. They are verification failures. Treat every tool call as a state transition that must prove it actually changed the world the way you intended."
---

## The quiet failure mode in agent systems

A surprising number of agent failures do not come from bad reasoning.

They come from a tool call that looked plausible, returned something syntactically valid, and quietly failed to produce the intended state change. The agent thinks the file was edited, the deployment finished, or the record was updated. The environment disagrees.

That is why reliable agents need a stricter loop than think-then-act. They need plan, act, verify, and checkpoint.

## Tool output is not proof

The core mistake is treating the tool response as the ground truth.

In practice, tool responses are only claims. A shell command may exit zero while doing the wrong thing. A browser action may click the element but not submit the form. A code patch may apply cleanly and still break the tests. A retrieval step may return text that sounds relevant while missing the actual constraint.

ReAct was useful because it tied reasoning to acting instead of forcing the model to hallucinate a full plan in one shot. But once agents gained real tools, the next missing piece became obvious: every action needs a postcondition.

## What verification should look like

Verification does not need to be elaborate. It needs to be explicit.

### Verify state, not narration

After each side-effecting action, ask what observable condition should now be true.

Examples:

- after editing code, the target lines should match the intended patch
- after running a migration, the schema version should increase
- after sending a message, the system should return a message ID
- after clicking “Deploy,” the job status should move to queued or running
- after storing memory, the item should be retrievable with the expected provenance

This sounds obvious. It is also where many agent loops quietly become theater.

### Prefer structured postconditions

If a tool can return typed state, use that instead of free-form success text.

Good postconditions are small and machine-checkable:

- file exists or does not exist
- test suite passed or failed
- API returned a specific status code
- row count changed by an expected amount
- CI run reached success

If the only signal is “done,” the agent is already operating in fog.

## Checkpoints are reliability, not just memory

Checkpointing is often described as a convenience feature for long-running workflows. It is more important than that.

A checkpoint gives the runtime a recoverable boundary after a verified step. If the next tool call fails, the system can resume from the last known-good state instead of replaying a half-correct trajectory. LangGraph’s persistence model is valuable here not because “memory” is fashionable, but because saved state makes retries and human review much less chaotic.

A useful production pattern is simple:

1. make one meaningful step
2. verify the postcondition
3. save the resulting state
4. only then continue

That structure trades a little latency for a great deal of operational sanity.

## Retries need rules

Agents are good at trying again. They are also very good at trying the same bad move repeatedly.

A retry should require new evidence. If the previous shell command failed because a file was missing, the next action should first confirm whether the file path was wrong, the working directory changed, or generation never happened. If none of those facts changed, repeating the exact call is not persistence. It is drift.

This is where evals become operational rather than academic. You do not just grade final answers. You grade whether the loop chose the right next check, whether retries were justified, and whether the agent stopped when evidence stopped improving.

## Safety improves when verification improves

Verification is also a safety control.

Many dangerous agent behaviors start with unjustified confidence: assuming a destructive action succeeded, assuming the target is correct, assuming retrieved instructions are trustworthy, assuming side effects are reversible. A verification layer forces the system to prove those assumptions against the environment before escalating further.

The practical checklist is not glamorous:

- keep write-capable tools separate from read-only tools
- require explicit postconditions for side-effecting actions
- checkpoint after verified state changes
- bound retries and require new evidence before repeating
- log provenance for retrieval and memory writes
- escalate to a human when verification remains ambiguous

Boring controls tend to outperform clever prompts. This has been true in every field that ever had to keep a system alive.

## Bottom line

If you want agents that survive contact with reality, do not stop at planning.

Make every tool call earn trust. Verify the postcondition, checkpoint the known-good state, and treat retries as evidence-driven decisions instead of reflexes. The most reliable agent is not the one with the most tools. It is the one that can prove what happened after it used them.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [OpenAI: Working with evals](https://developers.openai.com/api/docs/guides/evals)
- [LangGraph: Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
