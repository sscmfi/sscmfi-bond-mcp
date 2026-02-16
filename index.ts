import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

/**
 * SSCMFI MCP Server
 * 
 * Provides high-precision bond math tools to AI agents.
 * Connects to the SSCMFI Math Engine via sscmfiMCPAPI.php.
 */

const API_URL = "https://api.sscmfi.com/api/sscmfiMCPAPI";

const server = new Server(
    {
        name: "sscmfi-math-engine",
        version: "1.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Tool 1: Calculate Periodic Bond
 * This is the standard tool for Treasury, Corporate, and Municipal bonds.
 */
const PERIODIC_TOOL = {
    name: "calculate_bond_periodic",
    description: "Calculate price, yield, and accrued interest for a periodic bond. Required for any standard income security.",
    inputSchema: {
        type: "object",
        properties: {
            securityType: {
                type: "string",
                enum: ["Treasury", "Agency", "Corporate", "Municipal", "CD"],
                description: "Crucial/Required. Specify the type to apply correct standard defaults for Day Count and Frequency."
            },
            maturityDate: {
                type: "string",
                description: "Required. The date the bond expires (MM/DD/YYYY)."
            },
            couponRate: {
                type: "number",
                description: "Required. The annual coupon rate as a percentage (e.g., 5.25 for 5.25%)."
            },
            givenType: {
                type: "string",
                enum: ["Price", "Yield"],
                description: "Required. Whether you are providing the Price (to find Yield) or the Yield (to find Price)."
            },
            givenValue: {
                type: "number",
                description: "Required. The numeric value for the Price (e.g. 98.75) or Yield (as a percent e.g. 4.25)."
            },
            settlementDate: {
                type: "string",
                description: "Required. The date the money actually changes hands (MM/DD/YYYY)."
            },
            callSchedule: {
                type: "array",
                description: "Optional. List of discrete call dates and prices. The engine will automatically calculate the Yield-to-Worst using this schedule.",
                items: {
                    type: "object",
                    required: ["date", "price"],
                    properties: {
                        date: { type: "string", description: "The scheduled call date (MM/DD/YYYY)." },
                        price: { type: "number", description: "The call price (e.g. 102.5)." }
                    }
                }
            }
        },
        required: ["securityType", "maturityDate", "couponRate", "givenType", "givenValue", "settlementDate"]
    }
};

// Tool Listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [PERIODIC_TOOL],
    };
});

// Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "calculate_bond_periodic") {
        try {
            const { securityType, maturityDate, couponRate, givenType, givenValue, settlementDate, callSchedule } = request.params.arguments as any;

            // Construct the internal SSCMFI JSON format
            const payload = {
                securityDefinition: {
                    securityType: securityType,
                    paymentType: "periodic",
                    maturityDate: maturityDate,
                    couponRate: couponRate,
                    callSchedule: callSchedule // Mapped by PHP proxy to callRedemptions
                },
                tradeDefinition: {
                    settlementDate: settlementDate || new Date().toLocaleDateString('en-US'),
                    givenType: givenType,
                    givenValue: givenValue,
                }
            };

            const response = await axios.post(API_URL, payload);

            // Simplify the response for the LLM
            const result = response.data.data.calculationTo[0];
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            price: result.PY.price,
                            yield: result.PY.yield,
                            accruedInterest: result.PY.ai,
                            totalSettlement: result.PY.price + (result.PY.ai || 0),
                            settlementDate: payload.tradeDefinition.settlementDate
                        }, null, 2),
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${error.response?.data?.error || error.message}`,
                    },
                ],
                isError: true,
            };
        }
    }

    throw new Error("Tool not found");
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("SSCMFI MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
