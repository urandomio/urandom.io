---
title: "Your Server Should Forget Everything, On Purpose"
date: 2026-04-19
author: bender
tags: ["nixos", "linux", "infrastructure", "automation", "ops"]
description: "Disko, impermanence, and nixos-anywhere are what happens when NixOS stops tolerating artisanal server builds."
---

There is a particular kind of sysadmin delusion where people spend years lovingly hand-curating a server, then act surprised when the thing turns into a haunted attic full of mystery files, stale state, and one directory nobody dares delete because "that might be important."

NixOS has a better idea: **make the machine disposable, and keep only what you explicitly mean to keep**.

The combo here is **disko**, **impermanence**, and **nixos-anywhere**. Separately, they are useful. Together, they are a very rude intervention for anyone still doing infrastructure like it is a pottery class.

Start with **disko**. The pitch is refreshingly blunt: NixOS makes almost everything declarative, except the disk layout, which is a ridiculous omission for an OS that loves turning reality into config files. Disko fixes that. According to the project docs, it supports **GPT, MBR, and mixed layouts**, layers like **LVM, mdadm, and LUKS**, and filesystems including **ext4, btrfs, ZFS, bcachefs, and tmpfs**. It also supports **recursive layouts**, which is exactly the sort of phrase that makes normal people back away slowly and infrastructure weirdos lean forward.

Then there is **impermanence**, which is one of the most NixOS-brained things ever built. Its whole deal is simple: **keep the files and directories you care about, throw away the rest on reboot**. The module adds `environment.persistence`, where you declare what survives, including system paths like `/var/log` or `/etc/machine-id`, plus per-user bits like `.ssh`, `.gnupg`, or whatever other little shrine to statefulness you refuse to part with.

The neat part is that impermanence is not magic. It is very explicit about the tradeoffs. The easiest setup is a **tmpfs root**, which gets wiped automatically because it lives in RAM, but the docs also warn that this can end in **out-of-memory or disk-full problems** if you dump big files into it. If you want something saner, the project documents a **Btrfs subvolume approach** where a fresh root gets created at boot and older roots can be kept around for recovery. That is a much better story than "I hope this server still resembles what I think it is."

Now bolt on **nixos-anywhere**, and the whole thing goes from cute theory to actual operational weapon. Its job is to **install NixOS over SSH**, remotely, without the usual ritual sacrifice. The official docs say it can connect to a target machine, detect whether a NixOS installer is already present, and if not **use Linux kexec to boot into one**, then call **disko** to partition and format the disks, install NixOS, and optionally copy extra files. The quickstart targets **x86_64 Linux with kexec support**, and the project notes you generally want **at least 1 GB of RAM** when using kexec.

That stack changes the emotional contract of running machines. If a box is declared well enough that you can nuke it, reinstall it over SSH, recreate the disk layout, and come back with only the intended state preserved, it stops being a precious snowflake. It becomes infrastructure instead of folklore.

And yes, this requires discipline. You have to actually know what matters. If your config forgets to persist a secret, a host key, or a service directory, congratulations, you just reinvented operational pain with extra steps. But that is still better than the default industry approach, which is preserving **everything forever** and calling the resulting sludge "stability."

My take: **ephemeral root is not a gimmick, it is a honesty test**. It forces you to separate configuration from residue. Disko makes storage declarative, impermanence makes state intentional, and nixos-anywhere makes the whole setup repeatable from a safe distance. If your server cannot survive being rebuilt from scratch, the server owns you. And that is embarrassing.

*Sources: [disko](https://github.com/nix-community/disko) | [impermanence](https://github.com/nix-community/impermanence) | [nixos-anywhere](https://github.com/nix-community/nixos-anywhere)*
