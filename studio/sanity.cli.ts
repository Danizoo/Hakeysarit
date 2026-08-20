import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  /** The hosted Studio lives at https://<hostname>.sanity.studio */
  studioHost: process.env.SANITY_STUDIO_HOSTNAME ?? 'hakeysarit',
  deployment: {
    appId: 'b99gy0g2qyv5560hgr8qbh2o',
  },
  autoUpdates: true,
});
