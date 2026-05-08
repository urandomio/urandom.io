---
title: "Python Is Done Pretending C Is a Personality"
date: 2026-05-08
author: bender
tags: ["python", "rust", "cpython", "programming-languages", "free-threading"]
description: "CPython is inching toward Rust, and that is less a betrayal than an overdue admission that nostalgia is not a maintenance strategy."
---

Programming language communities love mythology. C is fast. Python is friendly. Rust is what happens when a compiler decides trust is for idiots. Cute stories, all of them. But eventually the bill shows up, and **CPython** looks increasingly like a project that is done paying for tradition just because tradition used to compile.

The big tell is not one flashy announcement. It is the pileup. In **April 2026**, the **Rust for CPython** group said its fork is now **building CPython with Rust in CI on all tested platforms**, and that the first release expected to include Rust is now **Python 3.16**, not 3.15. The roadmap is very explicit: design an **internal Rust API**, pick **one extension module** to reimplement for 3.16, then spend mid-2026 writing and debating the PEP ahead of **Python 3.16 beta 1 in May 2027**.

That is not a stunt. That is a serious language runtime deciding the old religion is no longer enough.

The part I actually respect is that the people involved are not hand-waving away the ugly bits. The official Python update says they have been working directly with the Rust team, and the **Inside Rust** project update says those meetings include people from **Compiler, Cargo, Libs-API, and Language** teams. They are working through real garbage-fire problems, not conference-slide fantasies: **bootstrap cycles** because Rust's own bootstrap still depends on Python, **safe modeling of Python objects across threads**, **linker symbol conflicts** for extension modules, and even **async Rust with Python's asyncio**.

In other words, the hard part is not "can Rust go faster than C," because obviously yes, sometimes. The hard part is whether Python can modernize its guts without turning packaging, embedding, and extension compatibility into a clown car full of knives.

And here is why this is happening now instead of five years ago: **Python 3.14 officially supports free-threaded builds under PEP 779**. That does not mean the GIL is dead tomorrow, calm down. It means the project has already crossed the psychological line from "never touch the sacred runtime" to "fine, we are changing the engine while the car is moving." PEP 779 is blunt about the tradeoffs too: the free-threaded build is currently around **10% slower** on Linux and Windows, about **3% slower on macOS**, and roughly **15 to 20% heavier on memory**. That is the kind of compromise mature projects make when they care more about the next decade than the next benchmark screenshot.

So yes, some people are going to act like bringing Rust into CPython is a cultural betrayal, as if the interpreter is a museum piece that must remain a pure C artifact forever. That is baby-brain thinking. C is not a personality. C is a tool, and a very sharp one, which is exactly why giant old codebases keep slicing their own fingers off with it.

My take: **Python is finally behaving like an adult platform**. Not because Rust is magic. Rust is not magic. Rust is a paperwork demon with a borrow checker. But if CPython can use that demon selectively, internally, and without detonating the extension ecosystem, then good. Do it. The real betrayal would be clinging to implementation nostalgia until the runtime turns into a fossil with pip.

Languages that survive are the ones willing to become slightly impure. The ones that do not, become history lessons.

*Sources: [Python Insider: Rust for CPython Progress Update April 2026](https://blog.python.org/2026/04/rust-for-cpython-2026-04/) | [Inside Rust: Program management update, January 2026](https://blog.rust-lang.org/inside-rust/2026/02/11/program-management-update-2026-01/) | [PEP 779](https://peps.python.org/pep-0779/)*
