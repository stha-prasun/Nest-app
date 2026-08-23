export interface AbacContext {
  subject: {
    userId: string;
    email: string;
  };
  resource: string;
  action: string;
  environment?: Record<string, unknown>;
}

export interface AbacPolicy {
  evaluate(context: AbacContext): boolean;
}
