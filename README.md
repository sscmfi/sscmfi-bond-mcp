# SSCMFI Bond Analytics MCP Server

[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://modelcontextprotocol.io)

This is the official Model Context Protocol (MCP) server for the **SSCMFI Bond Math Engine (Core Demo)**. Developed by the people who wrote the Standard Securities Calculation Methods books.It allows AI assistants (like Claude) to perform high-precision Price and Yield calculations for fixed income securities.

## Why SSCMFI?
**The Industry Standard in Bond Math.**
LLMs are notoriously unreliable with complex financial calculations, often "hallucinating" financial formulas or rounding inaccurately. The SSCMFI MCP server offloads this complexity to a battle-tested engine, ensuring:
*   **Exact Precision**: Industry-standard day counts (30/360, Act/Act) and payment frequencies.
*   **Verified Results**: Calculations that match professional terminals and settlement systems.
*   **AI-Native**: Designed specifically for seamless integration with LLM tool-calling.

## Tools
The server provides a specialized tool for core bond math:

### `calculate_bond_periodic`
Calculates the primary analytical values for any standard periodic coupon security.
*   **Inputs**: Security Type (Treasury, Corporate, etc.), Maturity Date, Coupon Rate, Settlement Date, and either Price (to find Yield) or Yield (to find Price).
*   **Outputs**: Clean Price, Yield-to-Worst (including call schedule support), Accrued Interest, and Trading Price.

## Features (Full Fidelity)
*   **Price & Yield Analytics**: High-precision conversions between price and yield.
*   **Institutional Transparency**: Unlike generic financial tools, this server returns its **Industry Convention Assumptions** (Day Count, Frequency, EOM) so the AI can explain *why* it reached a specific result.
*   **Redemption Intelligence**: Automatically detects whether a result is a Yield-to-Maturity or Yield-to-Call (Worst) and informs the AI.
*   **Accrued Interest**: Professional-grade accrued interest calculations for all supported security types.
*   **Supported Security Types**: Treasury Bonds, Corporate Bonds, Agency Bonds, Municipal Bonds, and CDs.

## Example Prompts
Once installed, you can ask Claude questions like:
*   "What is the yield of a Corporate bond with a 4.5% coupon maturing on 12/15/2030, priced at 98.25 for settlement today?"
*   "If I want to buy a Treasury bond maturing on 02/15/2029 with a 3% coupon at a 4.2% yield, what should the price be?"
*   "Calculate the accrued interest for a Municipal bond maturing on 06/01/2035 with a 5.0% coupon."

## Installation

### 🚀 Quick Start (Recommended)
The easiest way to use this server is to run it directly from GitHub. This avoids any manual downloads or complex configuration.

**Claude Desktop Configuration:**
Add this snippet to your `claude_desktop_config.json`:
*(Usually at `%APPDATA%\Claude\claude_desktop_config.json`. If using the Win 11 App Store version, check `%LOCALAPPDATA%\Packages\Anthropic.ClaudeDesktop_...\LocalCache\Roaming\Claude\`)*

```json
{
  "mcpServers": {
    "sscmfi-bond-mcp": {
      "command": "npx",
      "args": ["-y", "https://github.com/sscmfi/sscmfi-bond-mcp/archive/refs/heads/main.tar.gz"]
    }
  }
}
```
*(Ensure `github:sscmfi/sscmfi-bond-mcp/index.ts` matches your repository structure.)*

---

### 🛠️ Alternative: Manual Installation
If you prefer to run the server from a local folder on your machine:

1.  **Download the Server**: [Download sscmfi-bond-mcp](https://api.sscmfi.com/mcp/demo/)
2.  **Install Dependencies**: Open a terminal in the folder and run `npm install`.
3.  **Add to Claude Config**:
```json
{
  "mcpServers": {
    "sscmfi-bond-mcp": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/sscmfi-bond-mcp/index.ts"]
    }
  }
}
```

### 💻 Other Clients
*   **Claude Code (CLI)**: `claude mcp add sscmfi-bond-mcp -- npx -y tsx github:sscmfi/sscmfi-bond-mcp/index.ts`
*   **Cursor / Windsurf**: Add as a "command" type using the same `npx` string above.

---

## 💡 Pro Tip: Running from the .tgz file
If you want to run the server directly from the downloaded `.tgz` file (without unpacking), you can use:
`npx -y /path/to/sscmfi-bond-mcp-server.tgz`

## API Endpoint
This MCP server acts as a proxy to the live SSCMFI API:
`https://api.sscmfi.com/api/sscmfiMCPAPI`

## Documentation & API Access
This MCP server is a gateway to the broader SSCMFI ecosystem. For detailed information on the underlying formulas, API endpoints, and the book series visit:

*   **Official Website**: [sscmfi.com](https://sscmfi.com)
*   **Developer Portal**: [api.sscmfi.com/mcp/demo/](https://api.sscmfi.com/mcp/demo/)
*   **Interactive Calculator**: [api.sscmfi.com/calculator](https://api.sscmfi.com/calculator)

## ⚖️ Standards Compliance
Calculations performed by this server are compliant with industry standards including **MSRB Rule G-33** and **FINRA** requirements for securities calculations.

## License
© 2026 The Mayle Group, LLC. All rights reserved.
