# Release repository instructions

This repository contains public approval workflows and public release metadata only.
Native source/preview CI belong to public shaedy180/CaseSim-Desktop; hosted CaseSim
source and signing material remain in their private owners. This repository owns neither.
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

Publication requires the manual main-only workflow, exact staged version/Desktop SHA
and approved CaseSim compatibility SHA,
and approval of its reviewer-protected desktop-release environment. Never approve
that human review on the owner's behalf. The publish key may only promote packages
already signature-verified by the existing release controller. Never replace old
artifacts or downgrade latest.json. Public Desktop CI/provenance, approved private
CaseSim CI/images, private signed Windows rebuilds and installed runtime tests remain
prerequisites. Never import application source or signing/upload capability here.
This workflow does not deploy the hosted game, reset data or change auth/economy.
