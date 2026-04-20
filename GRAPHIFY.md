# Graphify: Step-by-Step Setup Guide

## 1. Prerequisites
Make sure you have:
*   **Python 3.10+** installed
*   **pip** available
*   **An AI coding assistant**, such as:
    *   Claude Code
    *   Codex
    *   Cursor
    *   Gemini CLI
    *   GitHub Copilot CLI
    *   VS Code Copilot Chat

## 2. Install Graphify
Run:
```bash
pip install graphifyy && graphify install
```

> [!WARNING]  
> The correct package name is `graphifyy` (double y). Other similarly named packages are not official.

## 3. Platform-Specific Setup
Depending on your tool:

**Claude Code**
```bash
graphify install
```

**Cursor**
```bash
graphify cursor install
```

**Codex**
```bash
graphify install --platform codex
```

**Gemini CLI**
```bash
graphify install --platform gemini
```

**GitHub Copilot CLI**
```bash
graphify install --platform copilot
```

**VS Code Copilot Chat**
```bash
graphify vscode install
```

## 4. Run Graphify on Your Codebase
Navigate to your project folder and run:
```bash
/graphify .
```

*For Codex:*
```bash
$graphify .
```

This will generate:
```text
graphify-out/
├── graph.html
├── GRAPH_REPORT.md
├── graph.json
└── cache/
```

## 5. Make Graph Always Available to AI (Recommended)
Run:
```bash
graphify claude install
```
Or equivalent for your platform:
*   `graphify cursor install`
*   `graphify codex install`
*   `graphify gemini install`

**This ensures:**
*   AI reads graph before searching files
*   Better architectural understanding
*   Reduced token usage

## 6. Ignore Unnecessary Files
Create a `.graphifyignore` file:
```text
node_modules/
dist/
vendor/
*.generated.py
```

## 7. Query Your Graph
Examples:
```bash
graphify query "show auth flow"
graphify query "what connects X to Y"
graphify path "A" "B"
graphify explain "SomeConcept"
```

## 8. Give context to Agent
**Prompt** *(Paste as it is in agent, just update the `GRAPHIFY_OUT_PATH`)*:

---

You have access to a Graphify knowledge graph at:
`<GRAPHIFY_OUT_PATH>`

For every question:
1.  **First run:**
    `graphify query "<user question>" --graph <GRAPHIFY_OUT_PATH>/graph.json`
2.  Use **ONLY** the returned graph context to answer.
3.  If the graph context is insufficient, then (and only then) read specific files.

**Rules:**
*   Do NOT scan the entire codebase
*   Do NOT load full files unless absolutely necessary
*   Prefer relationships, dependencies, and paths from the graph
*   Cite source files mentioned in the graph output when possible

---

## How to Keep Growing the Graph
Graphify becomes more powerful as your corpus grows. To continuously improve it:

*   **Re-run periodically**
    `/graphify .`
    This updates the graph with new files and changes.
*   **Add more context sources**
    Include:
    *   Docs (`.md`, `.txt`)
    *   PDFs (papers, specs)
    *   Screenshots / diagrams
    *   Notes / raw ideas
*   **Use `add` for external knowledge**
    `graphify add <url>`
    *Example: papers, blogs, tweets, videos*
*   **Keep raw knowledge folder**
    Maintain something like `/raw`. Drop everything there → Graphify connects it.
*   **Use `update` instead of full rebuild (faster)**
    `graphify update ./`
*   **Think in signals, not files**
    The graph improves when you add logic, reasoning, comments, and architectural decisions.
    
Over time, your graph becomes a persistent memory layer for all agents, not just a one-time analysis.

---
**Reference**
Based on official repo instructions. Source: https://github.com/safishamsi/graphify
