import { defineConfig } from 'cypress'

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  blockHosts: ['*ericchristenson.com*'],
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:4200',
  },
})
