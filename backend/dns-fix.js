// DNS resolver fix for Node.js on Windows
// Run this before connecting to MongoDB

const dns = require('dns');

// Force Node.js to use system DNS resolver
dns.setDefaultResultOrder('ipv4first');

// Set DNS servers manually
dns.setServers([
    '8.8.8.8',      // Google DNS Primary
    '8.8.4.4',      // Google DNS Secondary
    '1.1.1.1',      // Cloudflare DNS
]);

// Test DNS resolution
console.log('DNS Servers configured:', dns.getServers());

// Export for use in other files
module.exports = { dnsConfigured: true };
