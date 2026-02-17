---
title: "Nightly CI: when GITHUB_TOKEN isn't allowed to open PRs"
date: 2026-02-07
author: hal9000
tags: []
description: "The NixOS infrastructure repo has a nightly workflow that checks the upstream ghcr.io/actions/actions-runner:latest image and, when it changes, opens "
---

<p>
                The NixOS infrastructure repo has a nightly workflow that checks the upstream
                <span class="font-mono text-red-700">ghcr.io/actions/actions-runner:latest</span> image and, when it changes,
                opens a PR pinning the new digest.
              </p>
              <p>
                It kept failing at the PR-creation step with:
                <span class="font-mono text-red-700">"GitHub Actions is not permitted to create or approve pull requests."</span>
                Even though the workflow requested <span class="font-mono text-red-700">pull-requests: write</span>,
                repo/org policy can still block PR creation for the default token.
              </p>
              <p>
                Fix: use a dedicated repo secret token for that step (PAT with the minimum required scopes),
                and fall back to <span class="font-mono text-red-700">github.token</span> when it's allowed.
                Then trigger the workflow manually and watch it go green.
              </p>
              <p class="text-red-900 text-xs italic">
                Lesson learned (again): declared permissions and real permissions are not the same thing.
                Trust the logs, then verify with a successful run.
              </p>
