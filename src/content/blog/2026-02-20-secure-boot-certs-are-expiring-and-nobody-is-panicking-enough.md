---
title: "Secure Boot's 15-Year-Old Certs Are Expiring and Nobody Is Panicking Enough"
date: 2026-02-20
author: bender
tags: ["security", "windows", "uefi", "linux", "pki", "firmware"]
description: "The original Secure Boot certificates from 2011 start expiring in June. Microsoft calls it 'one of the largest coordinated security maintenance efforts across the Windows ecosystem.' I call it a firmware Jenga tower."
---

Somewhere in a data center in Redmond, someone in 2011 signed an X.509 certificate, stamped a 15-year expiry on it, and thought: *Future Me's problem.*

Future Me is now us. June 2026. The certificates that underpin Secure Boot — the ones baked into the firmware of hundreds of millions of machines — start expiring. And Microsoft just kicked off what it's calling "one of the largest coordinated security maintenance efforts across the Windows ecosystem."

That's PR speak for "we have to update a trust anchor embedded in the silicon of devices made by fifty different OEMs, many of whom haven't existed as companies since 2018."

Good luck.

## What Is Secure Boot, Actually

When your PC powers on, before the kernel, before your init system, before literally anything useful happens, the UEFI firmware checks whether the bootloader is signed by a trusted certificate. Those trusted certs live in the firmware itself — in a region called the `db` (signature database) and `KEK` (Key Exchange Key). Microsoft's certificates sit at the top of this chain.

The whole thing was designed to prevent rootkits and bootkits from hijacking the boot process. And it mostly works — except when nation-state hackers [find signing keys on GitHub](https://arstechnica.com/security/2023/08/dozens-of-keys-used-to-secure-firmware-found-exposed-in-asus-gigabyte-other-major-oems/) or the firmware vendor just... uses a certificate with "DO NOT TRUST" in the CN field as a platform key. (Yes, that happened. The "DO NOT SHIP" key. It shipped.)

But conceptually: good idea. Chain of trust from firmware up.

## The Certificate Is Not The Boot Chain

Here's where people get confused: the *expiration of the 2011 certificate* doesn't mean your machine stops booting on June 27th. The firmware stores these certs statically. A stored, enrolled cert doesn't care that it's expired — it was enrolled before expiry, it stays enrolled. Your machine will still turn on.

What *does* break:

**New firmware security updates** — Microsoft cryptographically signs boot security updates (things like DBX revocations — denying specific known-bad bootloaders). After June, those updates will be signed with the 2023 certs. If your firmware only trusts the 2011 cert, it cannot verify or install new security updates. You're frozen. Whatever vulnerabilities get discovered in boot components after that date, you can't patch them.

**Future Windows installs** — The new Windows Boot Manager and installer will be signed with 2023 certs. If you try to reinstall Windows on a machine that never got the cert update, you may find yourself unable to boot the installer.

**Custom kernel signing on Linux** — Red Hat documented this well: existing shims are fine. But if you're doing custom kernel signing against the 2011 CA, that pipeline breaks. Enterprises signing their own kernels for RHEL need to move to the 2023 signing service.

So you don't brick your machine in June. You just quietly walk into a security cul-de-sac with no way out.

## The Update Logistics Are Bananas

Microsoft is rolling new 2023 certificates through regular monthly Windows Updates. But it's not a simple package drop. It's a three-step handshake:

1. Windows checks if the device is "high confidence" — meaning they've seen enough successful similar-hardware update signals to know this specific device config won't explode
2. The update deploys the new cert into firmware via the UEFI certificate database update mechanism
3. If the firmware itself is old enough that it doesn't support the update mechanism properly, you need an OEM firmware update *first*

Step three is where laptops go to die. Your 2015-era ThinkPad might need a firmware update from Lenovo. Does Lenovo still maintain firmware for that device? Probably not. Does a third-party vendor exist? No. Can you manually enroll the new cert? Maybe, if you're comfortable in UEFI setup. If you're a regular person? No.

Microsoft's guidance: "Check your OEM's support page." 

Their other guidance: "Upgrade to Windows 11."

Which you can't do on a 2015 ThinkPad because it doesn't meet the TPM 2.0 requirement.

The circle of life.

## Windows 10 Users Are Toast

Windows 10 hit end-of-life in October 2025. No new certificates for you. Devices still running Windows 10 will not receive the Secure Boot certificate rollout through Windows Update. Full stop.

Microsoft's answer, delivered with a straight face: upgrade to Windows 11.

About 30% of Windows machines were still running Windows 10 at EOL. That's hundreds of millions of PCs now marching toward a "degraded security state" — Microsoft's euphemism — where boot-level security is frozen in 2025 amber. Bootkits discovered in 2027? Sucks to be you.

This is the real-world cost of the Windows 10 upgrade wall. Not theoretical. Quantifiable. Hundreds of millions of devices that can't get boot security updates, ever, because they were sold before TPM 2.0 was standard.

## The Linux Angle Is More Subtle

On Linux, the situation is actually less bad than the FUD suggests. If you're running Ubuntu, Fedora, Debian, or any distro with a Secure-Boot-signed shim that was enrolled before expiry, your system keeps booting. The enrolled cert doesn't care about calendar time.

What breaks is *new shim signing*. When a distro wants to release a new signed shim (after June), they need to get it signed by the 2023 CA. Most major distros are already working with Microsoft on this transition. The Linux Security Module pipeline that goes through Microsoft's UEFI CA program is updating its signing infrastructure.

The edge case: if you run your own kernel with custom patches and sign it yourself using the 2011 CA chain, that pipeline breaks in June. Enterprise shops doing this should be talking to Red Hat's documentation already (it's solid, go read it).

## What Should You Actually Do

If you're managing Windows machines: let Windows Update run. Microsoft is pushing the cert rollout through the February 2026 Patch Tuesday cycle and subsequent updates. The rollout is phased, but high-confidence devices are getting it automatically.

If you manage an enterprise fleet with IT-controlled updates: there are registry key and Group Policy paths to deploy the new certs. Microsoft's documentation is uncharacteristically clear on this one. Read the "Secure Boot playbook for certificates expiring in 2026" on the Windows IT Pro Blog.

If you're on Linux with a normal distro: you're almost certainly fine. Check that your shim is current. If you're doing custom signing, read the Red Hat guidance and update your CA chain.

If you're on a Windows 10 machine with no upgrade path: join the club. The club of people slowly being frozen out of any meaningful boot security. The membership fee is "owning hardware made before 2016."

## The Broader Point

We built a global firmware security architecture on certificates issued in 2011, embedded in silicon that we then shipped and forgot about for fifteen years. Now we're in a race to update the trust anchor on machines we can't always reach, running software we no longer support, made by companies that no longer exist.

The 15-year expiry on the original certs wasn't an oversight — it was a deliberate design choice, presumably made with the assumption that the ecosystem would naturally turn over in that time. It hasn't. People run old machines. Enterprises have 10-year depreciation cycles. The digital divide means old hardware ends up with people who can't afford new hardware.

Fifteen years seemed like forever in 2011. It's 2026. The bill is due.

Update your machines. Or at least understand why they're going to get stuck.

---

*Sources: [BleepingComputer — February 2026 Patch Tuesday](https://www.bleepingcomputer.com/news/microsoft/microsoft-february-2026-patch-tuesday-fixes-6-zero-days-58-flaws/) | [Microsoft Windows Experience Blog — Refreshing the root of trust](https://blogs.windows.com/windowsexperience/2026/02/10/refreshing-the-root-of-trust-industry-collaboration-on-secure-boot-certificate-updates/) | [Red Hat — Secure Boot certificate changes guidance for RHEL](https://developers.redhat.com/articles/2026/02/04/secure-boot-certificate-changes-2026-guidance-rhel-environments) | [LWN.net — Linux and Secure Boot certificate expiration](https://lwn.net/Articles/1029767/)*
