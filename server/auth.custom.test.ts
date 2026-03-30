import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import bcrypt from "bcryptjs";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 999,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "local",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...user,
  };

  return {
    user: user === null ? null : defaultUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("Custom Authentication System", () => {
  describe("Password Hashing", () => {
    it("should hash passwords securely with bcryptjs", async () => {
      const password = "testpassword123";
      const hash = await bcrypt.hash(password, 12);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare("wrongpassword", hash);
      expect(isInvalid).toBe(false);
    });

    it("should produce different hashes for same password", async () => {
      const password = "testpassword123";
      const hash1 = await bcrypt.hash(password, 12);
      const hash2 = await bcrypt.hash(password, 12);

      expect(hash1).not.toBe(hash2);
      expect(await bcrypt.compare(password, hash1)).toBe(true);
      expect(await bcrypt.compare(password, hash2)).toBe(true);
    });
  });

  describe("Auth Router Structure", () => {
    it("should have register procedure", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.auth).toBeDefined();
      expect(caller.auth.register).toBeDefined();
    });

    it("should have loginLocal procedure", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.auth).toBeDefined();
      expect(caller.auth.loginLocal).toBeDefined();
    });

    it("should have logout procedure", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.auth).toBeDefined();
      expect(caller.auth.logout).toBeDefined();
    });
  });

  describe("User Management Router", () => {
    it("should have userManagement router", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      expect(caller.userManagement).toBeDefined();
    });

    it("should have getAll procedure in userManagement", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      expect(caller.userManagement.getAll).toBeDefined();
    });

    it("should have approve procedure in userManagement", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      expect(caller.userManagement.approve).toBeDefined();
    });

    it("should have reject procedure in userManagement", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      expect(caller.userManagement.reject).toBeDefined();
    });

    it("should have delete procedure in userManagement", async () => {
      const ctx = createMockContext({ role: "admin" });
      const caller = appRouter.createCaller(ctx);

      expect(caller.userManagement.delete).toBeDefined();
    });
  });

  describe("Logout Procedure", () => {
    it("should clear session cookie on logout", async () => {
      const clearedCookies: any[] = [];
      const ctx = createMockContext();
      ctx.res.clearCookie = (name: string, options: any) => {
        clearedCookies.push({ name, options });
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies.length).toBeGreaterThan(0);
    });
  });
});
