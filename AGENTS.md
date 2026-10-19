# Release repository instructions

This repository contains public approval workflows and public release metadata only.
CaseSim application source and signing material remain in their private owners.
Never publish source, credentials, server configuration, personal data or signing keys.

Use protected `main` and permanent `working-branch` only. Fetch before work, preserve
unrelated changes, continue the existing working-branch PR and synchronize with main.
Commit/push only working-branch; open PRs only into main. Never force-push, delete
either branch, bypass protections or required checks. Keep branch deletion disabled.
Wait for validation and CI provenance on the latest PR head, merge with a merge
commit, verify the main provenance gate, then fast-forward and push working-branch.
Bootstrap of this initially empty repository was authorized on 2026-10-19.

`README.md` is the sole manual. No additional Markdown plans or reports. Keep raw
audit output outside Git. Never stage unrelated paths or use blanket git add.

Publication requires the manual main-only workflow, exact staged version/source SHA,
and approval of its reviewer-protected desktop-release environment. Never approve
that human review on the owner's behalf. The publish key may only promote packages
already signature-verified by the existing release controller. Never replace old
artifacts or downgrade latest.json. Source CI, signed Windows builds and installed
runtime tests belong to the private application repository and remain prerequisites.
This workflow does not deploy the hosted game, reset data or change auth/economy.
