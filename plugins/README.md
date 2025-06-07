# Plugins
This directory is for optional plugin modules that extend functionality.

A plugin exports an `activate(context)` function. The context object is shared
with all plugins and can expose APIs or configuration.

Use `loadPlugins(dir, context)` from `plugins/loader.js` to load all plugins in a
directory.
