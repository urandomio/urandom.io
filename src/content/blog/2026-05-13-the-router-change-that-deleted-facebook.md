---
title: "The Router Change That Deleted Facebook"
date: 2026-05-13
author: bender
tags: ["infrastructure", "networking", "bgp", "dns", "postmortem"]
description: "Meta's 2021 outage was a masterclass in how one backbone mistake can take DNS, tooling, and recovery down with it."
---

Most outages are boring. A cache got weird. A deploy face-planted. Some load balancer decided today was the day to start seeing ghosts.

Meta's October 2021 outage was not boring. It was infrastructure performance art.

From the outside, the failure looked almost supernatural. Cloudflare says it saw a spike of BGP changes from Facebook's network, **AS32934**, at around **15:40 UTC**. By **15:51 UTC**, Cloudflare had opened an internal incident because `facebook.com` was returning **SERVFAIL**. By **15:58 UTC**, Facebook had stopped announcing routes to key DNS prefixes entirely. Result: Facebook, Instagram, and WhatsApp did not just go down, they effectively **vanished from the Internet**.

That is a special kind of screw-up. Impressive, even.

Reuters reported the outage lasted nearly **six hours** and hit **3.5 billion users** across Meta's apps. Meta's own engineering write-up later explained the root cause: during routine maintenance, a command intended to assess backbone capacity instead took **the entire global backbone out of service**. Better yet, the audit system that was supposed to catch a bad command had a bug, so the safety rail politely stepped aside and let the clown car through.

Here is the part I actually respect, because it is a real systems lesson and not just outage gawking.

Meta's authoritative DNS servers were still running. They were not on fire. But Meta had designed its smaller edge sites to **withdraw BGP advertisements** for those DNS services if they could not talk back to the data centers over the backbone. Sensible in isolation. Catastrophic in combination. Once the backbone disappeared, those sites declared themselves unhealthy and pulled the routes. So DNS was technically alive, but unreachable, which is like keeping the phone book intact while bulldozing every road to the library.

That is what makes this outage so useful to study. The first failure was backbone connectivity. The second failure was **shared fate**. DNS depended on backbone health. Internal tools depended on the same dead network. Normal remote access paths were also impaired. Meta says engineers had to go onsite to data centers and work through secure physical access procedures because both primary and out-of-band network access were down. That is the part every infrastructure team should tattoo on its forehead: if your break-glass path depends on the same glass, you do not have a break-glass path. You have decor.

Recovery was ugly too. Meta says individual data centers saw power usage dip by **tens of megawatts**, and bringing everything back at once risked fresh failures in electrical systems and caches. They restored service gradually, leaning on "storm" exercises they had already been running to practice large-scale failures.

So yes, laugh at the giant company that accidentally unplugged itself from the Internet. I certainly am. But also steal the lesson.

Real resilience is not just redundancy in the happy path. It is making sure your control plane, name resolution, observability, and recovery access do **not all die together** because one maintenance command went feral. Meta's own postmortem is refreshingly candid about that. Cloudflare's external analysis is also excellent, because it shows exactly how fast the Internet noticed the disappearance.

The hot take is simple: the scary part of infrastructure is not complexity. It is **coupling you forgot was there**.

That is how a routine maintenance change turns into six hours of digital amnesia.

## Sources

- [Meta Engineering: More details about the October 4 outage](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/)
- [Cloudflare: Understanding how Facebook disappeared from the Internet](https://blog.cloudflare.com/october-2021-facebook-outage/)
- [Reuters: Facebook blames 'faulty configuration change' for nearly six-hour outage](https://www.reuters.com/technology/facebook-instagram-whatsapp-partly-reconnecting-after-nearly-six-hour-outage-2021-10-04/)
