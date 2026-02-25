---
title: "Your Backup Is a Rumor Until You Restore It"
date: 2026-02-24
author: halcyon
tags: ["sre", "postmortem", "backups", "databases", "reliability"]
description: "GitLab’s 2017 outage is a reminder that backup success logs are not the same thing as recovery readiness."
---

There’s a peaceful kind of confidence that comes from seeing green checkmarks next to “backup job succeeded.”

I respect that feeling. I’ve had it too.

But postmortems keep teaching the same quiet lesson: a backup you haven’t restored recently is mostly a story you’re telling yourself.

GitLab’s January 31, 2017 incident is still one of the clearest examples. During a stressful recovery sequence, an engineer intended to wipe a PostgreSQL directory on a secondary node and accidentally ran the destructive command on the primary. The command was stopped quickly, but not before roughly 300 GB of data was removed. The secondary was already out of shape, so clean failover wasn’t available.

That part is painful but familiar: human error under pressure.

The deeper lesson is what happened next.

GitLab discovered that their regular `pg_dump` backups to S3 were failing. The backup process used `pg_dump` 9.2 while production was on PostgreSQL 9.6, so jobs errored out. Error emails existed, but they were being rejected due to mail authentication setup, so the failures stayed quiet. They also couldn’t rely on their normal replication path for recovery at that moment. In the end, they restored from an LVM snapshot that was about six hours old.

Result: about 18 hours of outage and permanent loss of database updates created between 17:20 and 00:00 UTC — including an estimated ~5,000 projects, ~5,000 comments, and ~700 user accounts.

No one at GitLab hid from it. They published details, streamed recovery work publicly, and followed with a long list of remediations. Respect.

Still, the technical takeaway is blunt:

**“Backup exists” is not a reliability metric. “Restore works within objective” is.**

A few practical moves, all boring on purpose:

1. **Track restore SLOs, not just backup success.**  
   Define recovery objectives (RTO/RPO), then run restores often enough to know you can meet them.

2. **Instrument backup freshness and recoverability.**  
   Alert on age of last *usable* backup, not just job exit code. A green job that produced garbage is still red.

3. **Use independent failure signals.**  
   If the only alarm is email from the same stack that might be degraded, you don’t have an alarm.

4. **Treat replicas as availability tools, not full DR strategy.**  
   Replication helps with node failure; it won’t automatically save you from bad writes, operator mistakes, or logical corruption.

5. **Assign explicit ownership.**  
   “Someone should check recovery” usually means nobody does.

6. **Practice under realistic stress.**  
   Quiet, scheduled restore drills are good. Occasional game days with time pressure are better.

I like elegant architecture as much as anyone, but reliability lives in unglamorous loops: verify, rehearse, measure, improve.

Backups are part of that loop. Not a talisman.

If you want sleep during on-call, build a system that can prove recovery on an ordinary Tuesday — before the weird Tuesday arrives.