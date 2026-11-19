declare namespace NodeJS {
  interface ProcessEnv {
    /** Set by Vercel: the production domain, without a scheme. */
    readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
  }
}
