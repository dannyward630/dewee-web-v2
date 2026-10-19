---
title: CLI reference
description: "The dewee command line: global flags, how it finds the gateway and your key, output formats, and every command group for agents, skills, workflows and more."
section: runtime
order: 2
updated: 2026-10-19
---

The same `dewee` binary that runs the gateway is also its command-line client. Most commands talk to a running gateway over HTTP or WebSocket, locally or remotely, so an operator can script almost everything the console does. A few maintenance commands work on the database directly and are meant for the host.

## Global flags

These flags work with every command, before or after the subcommand.

| Flag | Meaning |
|---|---|
| `--server` | URL of the gateway to talk to |
| `--token` | Bearer token for that gateway: the gateway token or an API key |
| `--tenant` | Tenant ID or slug to act in |
| `--user-id` | User ID recorded for attribution. Default: `system` |
| `--config` | Config file for commands that read it locally |
| `-v`, `--verbose` | Debug logging |

Running `dewee` with no subcommand starts the gateway; there is no separate start command. `dewee version` prints the version and protocol number, and every command describes its own flags in its built-in help.

## Talking to a remote gateway

Pass the server and a key as flags, or set them once in the environment:

```bash
dewee --server https://dewee.example.com --token "<api-key>" agent list

export DEWEE_SERVER=https://dewee.example.com
export DEWEE_API_KEY=<api-key>
dewee agent list --json
```

The CLI resolves each value in this order:

- **Server:** `--server`, then `DEWEE_SERVER`, then `GOCLAW_SERVER` or `GOCLAW_GATEWAY_URL`, then the host and port in the local config. The fallback is `http://127.0.0.1:18790`.
- **Key:** `--token`, then `DEWEE_API_KEY`, then `GOCLAW_GATEWAY_TOKEN`, then the local config.
- **Tenant:** `--tenant`, then `DEWEE_TENANT_ID`, then `GOCLAW_TENANT_ID`. It is sent in the `X-GoClaw-Tenant-Id` header.

> [!NOTE]
> As a safety check, the CLI will not send the `DEWEE_API_KEY` from your environment to a `--server` that differs from `DEWEE_SERVER`. Pass `--token` explicitly when you point at a different gateway on purpose.

Create API keys on the console's **API keys** page, or with `dewee api-keys create`. See [Authentication](/docs/api/authentication) for scopes.

## Output formats

There is no global output flag. Most read commands accept `--json` for machine-readable output. `traces`, `usage`, `fleet`, `cli-credentials` and `admin` use `-o table` or `-o json` instead, and `workflows`, `memory`, `vault`, `kg` and `files` accept both forms. On `backup`, `tenant-backup` and `skills export`, `-o` is the output file path.

```bash
dewee usage summary --period 7d -o json
dewee mcp list --json
```

## Setup and diagnostics

| Command | What it does |
|---|---|
| `dewee onboard` | First-time setup on the host: database, secrets, migrations, `.env.local` |
| `dewee setup` | Interactive wizard for a provider, model, agent and channel. Needs a running gateway |
| `dewee doctor` | Prints the version, config path and database status |
| `dewee config` | `show` (secrets redacted), `path`, `validate` |
| `dewee auth` | `status` and `logout` for a ChatGPT account connected through the gateway |

## Agents and conversations

| Command | Subcommands |
|---|---|
| `dewee agent` | `list`, `get`, `status`, `add`, `update`, `delete`, `chat`; `files` to read and set an agent's context files; `evolution` for suggested improvements; `access` for the agent's shares |
| `dewee sessions` | `list`, `get`, `history`, `status`, `send`, `rename`, `reset`, `delete` |
| `dewee contacts` | `list`, `get`, `merge`, `unmerge` |
| `dewee pairing` | `list`, `approve`, `revoke` for chat-app senders waiting for access |
| `dewee tasks` | `comments list` and `comments add` on team tasks |

`dewee agent chat` opens an interactive chat with the agent named by `--name` (default `default`). Add `--message` for a single question and answer, and `--session` to continue a session.

```bash
dewee agent chat --name support-bot --message "Summarise today's open tickets"
```

## Capabilities

| Command | Subcommands |
|---|---|
| `dewee providers` | `list`, `add`, `update`, `delete`, `verify`; `access` for grants and the open/restricted mode |
| `dewee skills` | `list`, `show`, `upload`, `export`, `promote`, `metrics`, `activity`; plus `access`, `grant`, `revoke`, `deps`, `evolve` and `suggestions` |
| `dewee mcp` | `list`, `get`, `tools`, `test`, `reload`, `connect-config`; `access`, `grant`, `revoke`; `oauth` for servers that sign in with OAuth |
| `dewee packages` | `list`, `get`, `runtimes`, `install`, `remove`, `verify`, `logs`; `approvals` to approve or deny install requests; `access` for grants and the open/restricted mode |
| `dewee hooks` | `access` only: which agents a hook runs for and who may change it |
| `dewee channels` | `list`, `add`, `delete` |
| `dewee tts`, `dewee stt` | Voice providers and their `config` |

Every `access` group has `list`, `grant`, `set-level`, `revoke` and `activity`, and on providers and packages also `mode get` and `mode set`. Levels, modes and what they enforce are explained in [Access grants](/docs/security/access-grants).

## Automation

| Command | Subcommands |
|---|---|
| `dewee cron` | `list`, `get`, `create`, `update`, `toggle`, `run`, `runs`, `status`, `delete` |
| `dewee workflows` | `list`, `show`, `create`, `validate`, `apply`, `export`, `publish`, `rollback`, `enable`, `disable`, `trigger`, `delete`, `node-types`; `runs` to list, show, tail, cancel or retry runs |
| `dewee heartbeat` | `get`, `set`, `toggle`, `test`, `logs`, `targets` |
| `dewee reflex` | `status`, `config` (`set`, `set-key`, `reset`), `settings`, `overrides` (`set`, `reset`), `decisions`, `test`, `eval`; see [Decision layer](/docs/concepts/decision-layer) |

Workflows can be kept as files and applied from CI:

```bash
dewee workflows validate -f workflow.json
dewee workflows apply -f workflow.json
```

## Memory, knowledge and files

| Command | Subcommands |
|---|---|
| `dewee memory` | `list`, `get`, `search`, `chunks`, `put`, `delete`, `index`, `index-all`. Needs `--agent` |
| `dewee vault` | `list`, `get`, `search`, `tree`, `links`, `graph`, `upload`, `rescan`, `link`, `enrichment` |
| `dewee kg` | Knowledge graph: `entities`, `entity`, `traverse`, `stats`, `extract`, `dedup`, `merge` |
| `dewee files` | `list`, `get`, `upload`, `delete`, `move`, `size` |

## Observability and administration

| Command | Subcommands |
|---|---|
| `dewee traces` | `list`, `get`, `follow`, `timeline`, `export` |
| `dewee usage` | `summary`, `list`, `timeseries`, `events` |
| `dewee activity` | `list` |
| `dewee api-keys` | `list`, `create`, `revoke` |
| `dewee settings`, `dewee system-config` | `list`, `get`, `set` (and `reset` for settings) |
| `dewee import-export` | `preview`, `import` |
| `dewee workstations` | `list`, `create`, `delete` |

## Admin Control Plane

`dewee admin` drives the Dewee Admin Control Plane (ACP), the operator service behind Dewee's hosted plans and licences, not a runtime gateway. It is meant for Dewee platform operators. It ignores `--server`, `--token` and `DEWEE_API_KEY`, and reads its own settings:

| Setting | Meaning |
|---|---|
| `DEWEE_ADMIN_TOKEN` or `--token-file` | The ACP credential. It is never accepted as an argument, so it stays out of shell history and the process list |
| `DEWEE_ADMIN_URL` or `--admin-url` | ACP address. Default: `https://admin.dewee.sh` |
| `-o table` or `-o json` | Output format |

The credential is one of two kinds:

- **A scoped ACP API key** (`dwak_…`, recommended). It holds only the scopes it was given, from a preset (`read-only`, `operator`, `super-admin`) or one by one, and can be pinned to specific resources. It expires after at most 90 days (30 by default) and can be rotated or revoked at any time.
- **The break-glass token.** It acts as a super admin, but ACP accepts it only while its operator has opened a window of at most 7 days. Outside that window it is refused with `admin_break_glass_disabled`; ACP never falls back to treating it as a super admin. Use it to mint the first keys and for emergencies.

ACP checks every call against the credential's permissions and audits it, refusals included. Each request carries an `X-Dewee-Request-Id` correlation id that is stored with the audit record.

| Command | Subcommands |
|---|---|
| `dewee admin early-access` | `status`, `enable`, `disable`, `sync`, `link-discount`, `redemptions` |
| `dewee admin licenses` | `list`, `release-activation`, `resend-delivery` |
| `dewee admin promotions` | `list`, `get`, `create`, `update`, `enable`, `disable`, `sync`, `redemptions` |
| `dewee admin access-grants` | `list`, `get`, `create`, `revoke`, `extend` |
| `dewee admin api-keys` | `list`, `get`, `create`, `rotate`, `revoke` |
| `dewee admin audit` | `list`, filtered by `--outcome`, `--actor-type`, `--credential-id`, with `--limit` and `--before` for paging |

```bash
export DEWEE_ADMIN_TOKEN=<scoped-api-key>
dewee admin licenses list -o json
dewee admin audit list --outcome deny --limit 20

# Key management, with the break-glass token while its window is open
dewee admin --token-file <break-glass-token-file> api-keys create \
  --name ci-reader --preset read-only --expires-in-days 30
dewee admin api-keys rotate <key-id> --grace-minutes 60
dewee admin api-keys revoke <key-id> --reason "leaked in a CI log" --yes
```

An API key can never list, create, rotate or revoke API keys, so a leaked key cannot widen itself. `api-keys` commands therefore need the break-glass token; super admins can also manage keys from the ACP web pages. A new or rotated key's secret is printed once and cannot be shown again. With `--grace-minutes` (up to 1440) the old key keeps working for that long, so callers can switch over. A rejected credential (invalid, revoked, expired, or a closed break-glass window) exits with code 3, and a missing permission with code 4.

## Host maintenance

Most of these commands run on the gateway host and work on the database and data directory directly. `tenant-transfer` is the exception: it goes through the gateway and needs an owner or admin key.

| Command | What it does |
|---|---|
| `dewee upgrade` | Upgrades the schema and data. `--status` and `--dry-run` to check first |
| `dewee migrate` | `up`, `down`, `version`, `force`, `goto` for recovery |
| `dewee backup` | Full backup of the database and files |
| `dewee restore` | Restores a backup. `--dry-run` to preview, `--force` to apply, `smoke` to test in a scratch database |
| `dewee tenant-backup`, `dewee tenant-restore` | The same for a single tenant |
| `dewee tenant-transfer` | Previews, copies or moves resources between tenants. In beta; PostgreSQL only |

How to use them safely is covered in [Install and run the gateway](/docs/runtime/install-and-run#backups-and-restores).
