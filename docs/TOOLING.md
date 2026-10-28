# Tooling Notes

Moved out of CLAUDE.md so design guidance stays focused.

## Token Efficiency Tooling

This environment uses **rtk** (https://github.com/rtk-ai/rtk) — a CLI proxy that
compresses command output 60–90% before it reaches the model context. A global
Claude Code `PreToolUse` hook (`rtk hook claude`, registered in
`~/.claude/settings.json`) transparently rewrites Bash commands to their `rtk`
equivalents (`git status` → `rtk git status`, etc.), so adoption is automatic on
every Bash call across all sessions and subagents.

Use it at all times. Practical notes:

- The hook only intercepts the **Bash** tool. Claude Code's built-in `Read`,
  `Grep`, and `Glob` tools bypass it. When you specifically want rtk's compact
  output for those workflows, run shell equivalents (`cat`/`head`/`tail`,
  `rg`/`grep`, `find`) or call `rtk read` / `rtk grep` / `rtk find` directly.
- `rtk.exe` lives in `~/.local/bin` (on PATH). Verify with `rtk --version`
  (expect 0.42.0+) and `rtk gain` for cumulative token-savings stats.
- If a command's full, uncompressed output is genuinely needed, bypass rtk by
  noting it explicitly — but default to letting the hook compress.

**headroom** (https://github.com/chopratejas/headroom) was evaluated as a second
compression layer but is **deferred**: its npm package (`headroom-ai`) is a
code-only library with no CLI/MCP server, and its Python package (which ships the
MCP server + proxy) does not yet build on this machine's Python 3.14. rtk already
covers command-output compression. Revisit headroom for MCP/proxy use once a
compatible Python (3.11/3.12) or updated wheels are available.
