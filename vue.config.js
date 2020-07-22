module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: ['usb', 'mssql'],
      builderOptions: {
        npmRebuild: true
        // buildDependenciesFromSource: true
      }
    }
  }
}
