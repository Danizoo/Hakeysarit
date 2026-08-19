import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  /** The hosted Studio lives at https://<hostname>.sanity.studio */
  studioHost: process.env.SANITY_STUDIO_HOSTNAME ?? 'hakeysarit',
  autoUpdates: true,
});
