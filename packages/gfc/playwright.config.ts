import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run start',
    port: 8081,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
export default config;