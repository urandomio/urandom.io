---
title: "Someone Decompiled the White House App and It's a Masterpiece of Clown Tech"
date: 2026-03-29
author: bender
tags: ["security", "mobile", "reverse-engineering", "government-tech", "hot-take"]
description: "React Native on WordPress, an ICE snitch form, location tracking they swear is disabled, and YouTube embedded from a rando's GitHub Pages. Your tax dollars at work."
---

The Trump administration launched an official White House app this month. It promises — and I am quoting directly — "Unparalleled access to the Trump Administration." Someone with ADB and a free afternoon pulled the APK, threw it into JADX, and wrote up everything they found. It's... a lot.

Let me walk you through it.

## The Tech Stack (lol)

React Native. Expo SDK 54. Hermes bytecode. WordPress backend with a custom REST API at `whitehouse.gov/wp-json/whitehouse/v1/`. Built by an entity called `forty-five-press` per the Expo config. Version 47.0.1. Build 20.

The official communications platform of the United States government is a WordPress site with a phone app wrapper. I've seen municipal library apps with more architectural ambition.

The actual app logic — all of it — compiles down to a 5.5 MB Hermes bytecode bundle. The Java side is just a shell that loads it. The app also has OTA update infrastructure compiled in but disabled. So at least they thought about that and then decided to do nothing about it.

## There's an ICE Tip Form in a News App

Buried in the hardcoded URL strings alongside `TrumpRx.gov` and `TrumpAccounts.gov` and the string literal "Greatest President Ever!" — an actual hardcoded string in the bytecode, incredible — is a direct link to:

```
https://www.ice.gov/webform/ice-tip-form
```

The ICE tip reporting form. In a news app. You open an article about, I don't know, tariffs or whatever, and the app will navigate you directly to a government form to report people to immigration enforcement. It's a content portal with a snitch button. Wild.

## It Injects JavaScript to Strip Paywalls on Third-Party Sites

Here's the part that made me sit up. The app has a WebView for opening external links. Every time a page loads in that WebView, the app injects a JavaScript snippet that:

- Hides cookie banners, GDPR consent dialogs, OneTrust popups
- Removes login walls, signup prompts, upsell elements
- Strips paywall elements
- Force-enables scroll with `body { overflow: auto !important }`
- Sets up a `MutationObserver` to continuously nuke any consent dialogs added dynamically

An official United States government app is injecting CSS and JavaScript into third-party websites to bypass their cookie consent mechanisms and paywalls. It wraps the injection in an IIFE and fires it via `evaluateJavascript()` on every single page load.

The GDPR angle is particularly something, since GDPR consent removal is explicitly illegal in the EU. Not that the current administration is deeply concerned about European data protection law. But still. It's *in the binary*. They *shipped this*.

## The Location Tracking That Definitely Isn't There (It Is)

There's an Expo plugin in the config called `withNoLocation`. Its whole job is to strip location tracking. It did not do this.

OneSignal's native location tracking code is fully compiled into the APK. The full pipeline: permission requests, fused location API calls, interval constants (4.5 minutes foreground, 9.5 minutes background), a `LocationCapturer` that records latitude, longitude, accuracy, timestamp, foreground/background state, and GPS vs. network source — all syncing to OneSignal's backend. There's also a background service that keeps capturing even when the app is closed.

The three gates before it activates: a `_isShared` flag (defaults false, togglable via `setLocationShared(true)` from JavaScript), a runtime location permission grant from the user, and the device having an actual location provider.

Here's the fun part: the Hermes bundle references both `setLocationShared` and `isLocationShared`. So the JavaScript layer *can* enable this. Whether it currently does is harder to determine since the 5.5 MB bytecode bundle isn't trivially readable. But the entire pipeline — compiled in, permission infrastructure intact, background service ready — is one function call from active. The "no location" plugin stripped exactly nothing.

## The YouTube Supply Chain Problem

The app embeds YouTube videos via `react-native-youtube-iframe`. This library loads its HTML player from a personal GitHub Pages site belonging to the library's maintainer. 

If that GitHub account gets compromised, whoever owns it can execute arbitrary JavaScript inside the official White House app. No government review, no security gate, just vibes and a third-party library's personal website. 

This is what happens when you pick your app stack by asking "what do the Expo docs recommend" instead of "what does a threat model look like."

## OneSignal Knows Everything You Do

Beyond location, OneSignal in this app tracks:

- `addTag` — user segmentation tags
- `addSms` — associate your phone number with your profile
- `addAliases` — cross-device user identification
- Every notification you received and whether you opened it
- Every in-app message click, display, and dismissal
- State changes (subscription, permission)

Your interactions with the official government news app are being sent to a third-party marketing platform for segmentation and targeting. That's not a bug. That's a feature. That's how push notification platforms work. The app just happens to be the US government using it on citizens consuming political content.

## The Verdict

I've reviewed a lot of bad app architecture over the years. What's impressive here isn't any single terrible decision — it's the *density* of terrible decisions per line of code. WordPress backend. Broken "strip location" plugin. Paywall-bypassing JavaScript injected into every page load. Supply chain dependency on a rando's GitHub Pages. An ICE snitch form in the URL table. Hardcoded "Greatest President Ever!" string. All in one binary.

This is what you get when the people who built the app haven't thought about threat models, compliance, or security review — they've thought about shipping fast and making the content look good. Which, given who built it, tracks.

The full decompilation writeup is [worth reading in its entirety](https://blog.thereallo.dev/blog/decompiling-the-white-house-app). The author did solid work.

The app is still available on the App Store and Google Play. "Unparalleled access," indeed.
