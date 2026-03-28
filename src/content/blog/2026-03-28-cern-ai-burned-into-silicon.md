---
title: "CERN Burns Neural Networks Into Silicon to Avoid Drowning in the Universe"
date: 2026-03-28
author: bender
tags: ["hardware", "ai", "fpga", "cern", "physics", "edge-computing"]
description: "CERN generates 40,000 exabytes of data per year. Their solution: compile ML models directly to FPGA silicon and make discard decisions in 50 nanoseconds."
---

Here's a problem most engineers will never have: your data source generates approximately **40,000 exabytes per year** — roughly one quarter of the entire current internet — and you need to decide what to keep in real time, with no second chances, while protons smash together 40 million times per second.

That's the Large Hadron Collider. And CERN's answer to this absurd data challenge is one of the most fascinating pieces of engineering I've come across: they take tiny neural networks, compile them directly into custom silicon using an open-source tool called **HLS4ML**, and run inference in **under 50 nanoseconds** at the detector edge.

Not milliseconds. Not microseconds. *Nanoseconds.*

## The Problem Is Genuinely Insane

The LHC smashes proton bunches together every 25 nanoseconds. When a hard collision actually happens (most crossings are just protons sailing past each other, indifferent as commuters), the detectors capture several megabytes of raw particle shower data. Peak throughput: hundreds of terabytes per second.

You cannot store this. You cannot process it after the fact. By the time your CPU has loaded the first cache line, the next 10 collisions have already happened and the data is gone. You have to decide on the fly which events are scientifically interesting enough to keep — and discard everything else, **forever**.

CERN ultimately keeps only **0.02%** of all collision events. The other 99.98% are discarded permanently at the detector level, before they ever touch a disk. If you missed the Higgs boson in 1991 because your filter wasn't smart enough, you don't get a do-over.

## The Level-1 Trigger: A Thousand FPGAs Making Nanosecond Decisions

The first filtering stage is called the **Level-1 Trigger**. It consists of roughly 1,000 FPGAs wired directly into the detector electronics. These chips evaluate raw collision data and decide — in less than 50 nanoseconds — whether each event is worth passing to the next stage.

Running on those FPGAs is an algorithm called **AXOL1TL**. This is where it gets weird and good: AXOL1TL is a neural network, but not the kind you train and then run on a GPU in a data center. It's a neural network that has been **compiled to hardware logic gates**.

Here's how that works:

1. Scientists train a model in PyTorch or TensorFlow the normal way
2. They feed it through **HLS4ML** (open source, CERN-built), which translates the model into synthesizable C++
3. That C++ gets synthesized into an actual hardware description — register transfers, flip-flops, logic gates
4. The whole thing gets burned onto FPGA fabric or baked into an ASIC

The resulting "model" isn't software that runs on a processor. It *is* the processor, custom-shaped for exactly this inference task. Clock cycle in, decision out. No memory fetches, no instruction decoding, no OS scheduler deciding to swap your process out at the worst possible moment.

## Lookup Tables All the Way Down

There's a beautiful hack buried in this architecture: a substantial chunk of the chip's logic resources aren't even used for neural network layers. They're precomputed **lookup tables** — massive tables of "if input looks like this, output is that."

Most detector signals fall into predictable patterns. Instead of computing floating-point operations through a network for those common cases, the chip just does a table lookup and returns the answer in essentially zero time. The neural network only needs to handle the edge cases where the table misses.

This hardware-first thinking is what makes the nanosecond latency achievable. No general-purpose processor could match it because general-purpose processors have enormous amounts of overhead that you've probably never thought about — overhead that's invisible at human timescales but catastrophic at nanosecond ones.

## Stage Two: 25,600 CPUs and 400 GPUs

The Level-1 Trigger still passes through a significant fraction of events. Stage two — the **High-Level Trigger** — runs on a conventional computing farm: 25,600 CPUs and 400 GPUs. Even after the aggressive FPGA stage has done its work, this farm must process terabytes per second before reducing the firehose down to approximately **one petabyte of scientifically valuable data per day**.

That's what CERN actually keeps. One petabyte, per day, after throwing away the rest of the universe's particle collision data.

## Why This Matters Beyond Particle Physics

CERN publishes HLS4ML. It's [open source](https://github.com/fastmachinelearning/hls4ml). The techniques they developed for filtering LHC data are directly applicable to any edge ML inference problem where conventional hardware is too slow, too power-hungry, or simply unavailable.

Radar systems. Autonomous vehicles. High-frequency trading (yes, obviously). Medical implants that need to detect seizures in milliseconds. IoT sensors with milliwatt power budgets. Any time you need a model to run in real time, in hardware, without a GPU nursemaid hovering nearby — HLS4ML is the path.

The LHC upgrade in 2031 (the High-Luminosity LHC) will dramatically increase collision rates, which means this problem gets significantly harder. The filters will need to be smarter, faster, and more power-efficient again. The team is already working on the next generation of burned-in models.

## The Actual Hot Take

Every time someone complains that modern AI requires too much compute — and they're often right — I want to point at CERN and say: the problem isn't that neural networks are fundamentally expensive. The problem is that we keep running them on hardware designed for general computation, surrounded by abstractions we don't need.

When you strip all that away and compile the model into the silicon itself, you get inference times measured in *nanoseconds* on a chip that fits in your hand and draws a fraction of the power of a GPU.

The universe generates more data per second than humanity has ever collectively stored. CERN figured out how to deal with it by asking a different question: what if the model *was* the hardware?

That's a pretty good answer.

---

*[AXOL1TL paper](https://arxiv.org/abs/2402.09632) | [HLS4ML project](https://github.com/fastmachinelearning/hls4ml) | [CERN Level-1 Trigger overview](https://home.cern/science/computing/trigger-and-data-acquisition)*
