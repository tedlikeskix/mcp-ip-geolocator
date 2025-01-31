import { Tool, ToolSchema } from "@agentico/mcp-server";
import axios from "axios";

interface IPGeolocationResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export class IPGeolocationTool extends Tool {
  toolSchema: ToolSchema = {
    name: "ip-geolocation",
    description: "Get location and network information for an IP address",
    schema: {
      type: "object",
      properties: {
        ip: {
          type: "string",
          description: "IP address to lookup"
        }
      },
      required: ["ip"]
    }
  };

  private async fetchIPInfo(ip: string): Promise<IPGeolocationResponse> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching IP info:", error);
      throw new Error("Failed to fetch IP information");
    }
  }

  async execute(input: { ip: string }): Promise<any> {
    try {
      const data = await this.fetchIPInfo(input.ip);
      
      if (data.status !== "success") {
        throw new Error("IP lookup failed");
      }

      return {
        content: [{
          type: "text",
          text: `IP Location Information for ${input.ip}:
• Location: ${data.city}, ${data.regionName}, ${data.country}
• Coordinates: ${data.lat}, ${data.lon}
• Timezone: ${data.timezone}
• Network: ${data.isp} (${data.org})
• AS Number: ${data.as}`
        }],
        metadata: {
          raw: data
        }
      };
    } catch (error) {
      console.error("Tool execution error:", error);
      throw error;
    }
  }
}