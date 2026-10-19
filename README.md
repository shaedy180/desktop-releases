# Desktop releases

Public release approval for [releases.shaedy.de](https://releases.shaedy.de).
Native source and previews live in public
[CaseSim-Desktop](https://github.com/shaedy180/CaseSim-Desktop); hosted game/API/auth
source remains private. Development rules are in [AGENTS.md](AGENTS.md).

The private CaseSim repository first verifies the exact public Desktop main commit
and its current successful PR/main provenance, separately validates the approved
CaseSim compatibility commit and images, rebuilds and signs the Windows NSIS
installer from the public native source, tests the installed application and stages
the package privately through an upload-only server key. This repository has no
application source, signing key, broad GitHub token or upload capability.

Run **Publish Desktop** on `main` with the exact staged version and full 40-character
Desktop source SHA and approved CaseSim compatibility SHA recorded by private
preparation. Review that evidence and
approve the pending `desktop-release` environment. It requires owner review and
accepts only main. Its separate SSH key permits only promotion of this staged
version and both source SHAs. The root-owned server controller independently verifies
Ed25519 signatures, the signed version, public Desktop source owner, both approved
source identities, private preparation identity, expected URLs and SHA-256
before publishing. Published versions are immutable and downgrades are refused.
The manifest switches atomically after all versioned assets are public.

The protected environment uses `DESKTOP_PUBLISH_HOST`, `DESKTOP_PUBLISH_USER`,
`DESKTOP_PUBLISH_SSH_KEY`, `DESKTOP_PUBLISH_HOST_FINGERPRINT`. Private keys never
belong in this public repository or Actions logs. Host identity is pinned and
the SSH capability has no shell, forwarding, SCP or arbitrary path access.

build-info.json records Desktop commit/source, casesim_commit compatibility identity,
preparation_commit, Desktop version and installer hash. Public CI never imports
private game code and unsigned preview artifacts cannot become official releases.

The workflow verifies public manifest/both source identities and downloads all package
assets to check their hashes. The public channel is
`https://releases.shaedy.de/casesim/windows/latest.json`; immutable downloads live
under `casesim/windows/desktop-vVERSION/`. Release metadata and source commit IDs
are public. A Tauri updater signature authenticates updates; Windows Authenticode
status is recorded separately in each build's metadata.

Keep previous assets. Stop publication on failure; fix a faulty release with a
newer signed patch, never overwrite an old package or change latest to an older
version. Host routing/key recovery belongs to the private infrastructure owner.
This repository never deploys the hosted CaseSim service.
