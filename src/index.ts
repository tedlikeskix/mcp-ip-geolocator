#!/usr/bin/env node
import { MCPServer } from '@agentico/mcp-server';
import { IPGeolocationTool } from './tools/IPGeolocationTool.js';

const server = new MCPServer('IP Geolocation Server', '1.0.0');

async function main() {
  // Register the IP geolocation tool
  server.registerTool("ip-geolocation", IPGeolocationTool);
  
  console.log('Starting IP Geolocation MCP Server...');
  await server.run();
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});