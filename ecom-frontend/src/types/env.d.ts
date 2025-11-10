declare const process: {
  env: Record<string, string | undefined>;
};

interface ImportMeta {
  readonly env: Record<string, string | undefined>;
}

