declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      tenantId: string;
      tenantRole: string;
    }
  }
}

export { };