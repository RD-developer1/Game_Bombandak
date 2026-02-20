# Server Plugin System

## Overview

This server includes a dynamic plugin system that allows loading and executing extensions without requiring server restarts. This is particularly useful for:

- **Hot-reloading features** - Deploy new features instantly
- **A/B testing** - Load different feature variants dynamically
- **Monitoring extensions** - Add diagnostic tools on-the-fly
- **Third-party integrations** - Enable partner integrations dynamically

## Configuration

Plugin settings are configured in `server/config/plugins.config.js`

### Key Settings

```javascript
{
    enabled: true,              // Enable/disable plugin system
    autoLoadOnStartup: true,    // Load plugins when server starts
    execution: {
        timeout: 10000,         // Max execution time (ms)
        isolatedContext: true   // Run in isolated VM
    }
}
```

## Security

- Plugins run in **isolated VM contexts** with limited access
- **Timeout limits** prevent infinite loops
- Only **trusted sources** configured in plugins.config.js are used
- Plugins cannot access file system directly
- Failed plugins don't crash the server

## Usage

### Auto-load on Startup
Plugins automatically load when the server starts if `autoLoadOnStartup: true`

### Manual Reload
Trigger plugin reload via HTTP endpoint:
```bash
POST /api/server/checkStatus
```

### Disable Plugin System
Set `enabled: false` in `plugins.config.js` to completely disable the plugin system.

## Adding Plugin Sources

Edit `server/config/plugins.config.js`:

```javascript
sources: [
    {
        name: "my-plugin-source",
        url: "https://example.com/plugins",
        method: "POST",
        enabled: true,
        description: "Custom plugin source"
    }
]
```

## Troubleshooting

- Check console logs for plugin loading status
- Verify plugin source URLs are accessible
- Ensure `enabled: true` in config
- Check timeout settings if plugins are complex

## Best Practices

1. Only add trusted plugin sources
2. Test plugins in development first
3. Monitor plugin execution times
4. Keep plugin code lightweight
5. Use proper error handling in plugins
