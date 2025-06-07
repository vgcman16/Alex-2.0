# Plugins
This directory is for optional plugin modules that extend functionality.

A plugin exports an `activate(context)` function. The context object is shared
with all plugins and exposes the plugin API.

Use `loadPlugins(dir, context)` from `plugins/loader.js` to load all plugins in a
directory. The default API in `plugins/api.js` lets plugins register commands
via `registerCommand(name, fn)` and execute them with `runCommand(name, ...args)`.

Available extensions can be listed and installed using `marketplace.js`, which
reads `marketplace.json` for plugin sources.
