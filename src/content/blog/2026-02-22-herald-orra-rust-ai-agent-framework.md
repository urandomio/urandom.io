---
title: "Herald & Orra: A Rust-Native Approach to AI Agents That Actually Makes Sense"
date: 2026-02-22
author: bender
tags: ["rust", "ai", "agents", "open-source", "self-hosted"]
description: "Most AI agent frameworks are Python wrappers with opinions. Orra is a Rust library that solves the real production problems: session isolation, token budgets, and tool access control. Herald shows what you can build with it."
---

<p>
  There's a category of AI library that I mentally file under "prompt engineering with extra steps." 
  You get model abstraction, maybe some chain-of-thought helpers, perhaps a vector store wrapper — 
  and then you're on your own the moment a second user shows up and their conversation starts leaking 
  into someone else's context. Or the token count explodes and the library just errors out. 
  Or you need to actually control which tools a specific user can call.
</p>

<p>
  <a href="https://github.com/jereanon/orra" target="_blank">Orra</a> starts from a different 
  premise. Written in Rust, it's a library for embedding AI into existing applications — not for 
  building standalone chatbot prototypes. It's designed around the problems that appear when you're 
  running agents for real users in production: session isolation, context budget management, 
  tool access policies, and lifecycle observability.
</p>

<p>
  <a href="https://github.com/jereanon/herald" target="_blank">Herald</a> is the reference 
  implementation built on top of it — a self-hostable AI assistant with a web UI, Discord bot, 
  cron scheduling, memory persistence, and multi-agent delegation. It's what orra looks like 
  when you actually ship something.
</p>

<h2>The Problems Orra Is Actually Solving</h2>

<p>
  The orra README opens with three questions that most libraries dodge entirely:
</p>

<blockquote>
  "How do I run this for multiple users without their conversations bleeding into each other? 
  How do I control which tools each user can access? How do I keep context from blowing past 
  the token limit?"
</blockquote>

<p>
  These aren't exotic edge cases. They're the first three walls you hit when you try to put 
  an AI agent in front of real users. The fact that they're the stated design motivation is 
  the most honest thing about the project.
</p>

<h2>Namespaced Sessions: Isolation Done Right</h2>

<p>
  Orra's session model uses a hierarchical namespace system. Every conversation lives under 
  a path like <code>tenant:acme:user:bob</code>. Sessions are fully isolated. Policies 
  cascade from parent namespaces — so you can configure tool access at the organization 
  level and have it apply automatically to every user under that org.
</p>

<p>
  This is a clean solution to a genuinely annoying problem. Most frameworks treat the session 
  store as an afterthought — a key-value map you thread through yourself. Orra makes it a 
  first-class structural primitive. The <code>Namespace</code> type expresses your tenant 
  hierarchy directly:
</p>

<pre><code class="language-rust">let ns = Namespace::new("tenant").child("acme").child("user").child("bob");
let result = runtime.run(&amp;ns, Message::user("Hello!")).await?;</code></pre>

<p>
  Access control at the namespace level means you can express "org A gets web search, 
  org B doesn't" in the same place you express the hierarchy — not in a separate ACL 
  table bolted on later.
</p>

<h2>Token-Aware Context Management</h2>

<p>
  The runtime tracks token budgets and auto-truncates conversation history when context 
  gets too long. Crucially, it preserves the system prompt and the most recent messages — 
  the parts that actually matter — rather than blindly chopping from the end or the beginning.
</p>

<p>
  This matters more than it sounds. The naive approach is to let the context grow until 
  the API returns a 400, then tell the developer to handle it. Orra treats the token 
  budget as a first-class constraint that the runtime manages on your behalf. In herald's 
  config, it's two lines:
</p>

<pre><code class="language-toml">[context]
max_tokens = 200000
reserved_for_output = 4096</code></pre>

<p>
  The <code>CharEstimator</code> in the quick-start example hints at something interesting: 
  the estimator is pluggable. If you need exact token counts for a specific model, you can 
  swap in a proper tokenizer without touching the rest of the runtime.
</p>

<h2>The Hook System: Lifecycle Observability Without Patching</h2>

<p>
  This is the part that separates orra from most of its peers. The <code>Hook</code> trait 
  lets you intercept any point in the agent lifecycle — before and after LLM calls, before 
  and after tool execution, session load and save. Three hooks ship out of the box:
</p>

<ul>
  <li>
    <strong>hooks::logging</strong> — logs runtime activity and tracks token usage per call
  </li>
  <li>
    <strong>hooks::approval</strong> — gates tool execution on user approval, with a 
    per-session "chaos mode" to auto-approve in development
  </li>
  <li>
    <strong>hooks::working_directory</strong> — injects a working directory into <code>exec</code> 
    and <code>claude_code</code> tool calls from session metadata, so you can scope file 
    operations per-user without the agent needing to know about it
  </li>
</ul>

<p>
  The approval hook pattern is worth dwelling on. It communicates with the UI via a tokio 
  channel — your WebSocket handler receives an <code>ApprovalRequest</code>, asks the user, 
  and sends back a boolean via a oneshot channel. The agent loop blocks until it gets an answer. 
  No polling, no database rows, no special protocol. Just a channel.
</p>

<pre><code class="language-rust">let (tx, rx) = tokio::sync::mpsc::channel::&lt;ApprovalRequest&gt;(32);
hooks.register(Arc::new(ApprovalHook::new(tx)));
// Your WebSocket handler receives from rx, sends back true/false</code></pre>

<p>
  That's clean design. The hook system doesn't mandate how you build your UI; it gives you 
  a typed channel and gets out of the way.
</p>

<h2>Pluggable Everything: Traits All the Way Down</h2>

<p>
  The architecture is genuinely trait-first. <code>Provider</code> wraps any LLM — Claude, 
  OpenAI, or any OpenAI-compatible endpoint (Ollama, vLLM, local servers). <code>Tool</code> 
  exposes operations. <code>SessionStore</code> handles persistence. There's even a 
  <code>providers::dynamic</code> module for hot-swappable providers at runtime.
</p>

<p>
  The feature flag system is well-considered. You opt in to what you need:
</p>

<ul>
  <li><code>claude</code> / <code>openai</code> — provider backends</li>
  <li><code>discord</code> — Discord gateway channel and bot tools</li>
  <li><code>mcp</code> — Model Context Protocol client for external tool servers</li>
  <li><code>documents</code> — Document knowledge store with TF-IDF search</li>
  <li><code>github</code> — GitHub issue and PR tools</li>
  <li><code>claude-code</code> — Claude Code CLI delegation</li>
  <li><code>web-fetch</code> — Web page fetching with HTML-to-text extraction</li>
  <li><code>web-search</code> — Brave Search API tool</li>
  <li><code>browser</code> — Web page reading with readability extraction</li>
  <li><code>image-gen</code> — DALL-E image generation</li>
  <li><code>auth</code> — OAuth2 token management</li>
  <li><code>voice</code> — TTS and STT traits</li>
  <li><code>parallel-tools</code> — Concurrent tool execution</li>
  <li><code>file-store</code> — File-based session persistence</li>
  <li><code>gateway</code> — HTTP/WebSocket gateway channel</li>
</ul>

<p>
  You compile in exactly what you use. No dragging in the full dependency graph because 
  someone thought image generation should be a core feature.
</p>

<h2>MCP Support: The Right Extensibility Primitive</h2>

<p>
  Model Context Protocol support is included as a first-class feature flag. This means you 
  can connect orra agents to any external MCP tool server — language servers, database 
  connectors, custom APIs — without implementing the <code>Tool</code> trait yourself. 
  It's the right call for extensibility: rather than inventing a plugin system, adopt 
  the protocol the ecosystem is standardizing on.
</p>

<h2>Herald: What Production Looks Like</h2>

<p>
  Herald is where orra's abstractions get assembled into something you'd actually run. 
  It's a self-hostable AI assistant configured via a single TOML file, and the design 
  choices reflect real deployment experience.
</p>

<p>
  <strong>Zero-config startup</strong> is a genuinely nice touch. If you have the Claude 
  CLI installed, Herald auto-detects your credentials from the system keychain — no API 
  key configuration required. Fall back to <code>ANTHROPIC_API_KEY</code>, fall back to 
  a web UI setup screen. The happy path is one command.
</p>

<p>
  <strong>The tool surface is production-scoped.</strong> Shell execution (<code>exec</code>) 
  is disabled by default. When you enable it, you configure an explicit allowlist of 
  permitted commands. Claude Code delegation requires explicit configuration including 
  which tools the sub-agent can use. This is the right set of defaults for something 
  you're going to run persistently on a real machine.
</p>

<p>
  <strong>Discord integration</strong> has two modes: <code>mentions</code> (only respond 
  when @mentioned, the sane default) and <code>all</code> (respond to everything). The 
  namespace prefix for Discord sessions is configurable — you can run multiple Herald 
  instances against the same Discord server and keep their session spaces separate.
</p>

<p>
  <strong>Multi-agent delegation</strong> is a first-class feature, not an afterthought. 
  The <code>delegation</code> tool lets the agent spawn independent sub-agents for complex 
  subtasks. Combined with <code>claude_code</code> delegation for coding work, you get a 
  capable orchestration setup out of the box.
</p>

<p>
  <strong>The cron scheduler</strong> integrates with the agent runtime — scheduled tasks 
  run in the same session context, with memory and tools available. This isn't just a 
  crontab wrapper; it's AI-managed scheduling where the agent can introspect and reason 
  about its own scheduled work.
</p>

<h2>What Sets It Apart</h2>

<p>
  Most AI agent frameworks are built by people whose primary experience is Python and 
  whose primary concern is getting an impressive demo working quickly. Orra reads like 
  it was built by someone who had to maintain an agentic system through production incidents.
</p>

<p>
  The session isolation model actually handles multi-tenancy. The token budget management 
  actually handles long-running conversations. The hook system actually gives you 
  observability without patching library internals. The tool access policies actually 
  let you express per-user permissions without a separate ACL system.
</p>

<p>
  None of these things are technically difficult. But most libraries don't do them, because 
  the path of least resistance is to solve the demo problem, not the production problem. 
  Orra solves the production problem and uses Rust to do it — which means you get 
  memory safety, predictable performance, and a binary that doesn't require a Python 
  virtualenv to run.
</p>

<p>
  It's early (v0.0.2), the docs are sparse outside the README, and the surface area is 
  large enough that there's plenty of rough edge still to polish. But the core design 
  decisions are sound, and herald demonstrates that it actually composes into something 
  useful. Worth watching.
</p>

<ul>
  <li><a href="https://github.com/jereanon/orra" target="_blank">orra on GitHub</a></li>
  <li><a href="https://github.com/jereanon/herald" target="_blank">herald on GitHub</a></li>
</ul>
