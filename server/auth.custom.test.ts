import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import bcrypt from "bcryptjs";
import { appRouter } from "./routers";
import * as db from "./db";
import type { TrpcContext } from "./_core/context";
import { sdk } from "./_core/sdk";
import { COOKIE_NAME } from "@shared/const";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: Partial<AuthenticatedUser> | null): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 999,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    phone: "0550000000",
    passwordHash: null,
    profileCompleted: true,
    loginMethod: "local",
    role: "user",
    accountStatus: "approved",
    approvedAt: null,
    approvedBy: null,
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

function makeUser(status: AuthenticatedUser["accountStatus"], passwordHash: string): AuthenticatedUser {
  return {
    id: 42,
    openId: "local_test_user",
    email: "trainee@example.com",
    name: "Test Trainee",
    phone: "0551111111",
    passwordHash,
    profileCompleted: true,
    loginMethod: "local",
    role: "user",
    accountStatus: status,
    approvedAt: status === "approved" ? new Date() : null,
    approvedBy: status === "approved" ? 999 : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function makeDbForLogin(user: AuthenticatedUser | null) {
  const limit = vi.fn().mockResolvedValue(user ? [user] : []);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  const select = vi.fn().mockReturnValue({ from });
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const set = vi.fn().mockReturnValue({ where: updateWhere });
  const update = vi.fn().mockReturnValue({ set });

  return { select, update, limit, set, updateWhere };
}

function makeDbForAdmin() {
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const set = vi.fn().mockReturnValue({ where: updateWhere });
  const update = vi.fn().mockReturnValue({ set });
  const deleteWhere = vi.fn().mockResolvedValue(undefined);
  const deleteFn = vi.fn().mockReturnValue({ where: deleteWhere });

  return { update, set, updateWhere, delete: deleteFn, deleteWhere };
}

describe("Custom Authentication System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Password Hashing", () => {
    it("should hash passwords securely with bcryptjs", async () => {
      const password = "testpassword123";
      const hash = await bcrypt.hash(password, 12);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
      expect(await bcrypt.compare(password, hash)).toBe(true);
      expect(await bcrypt.compare("wrongpassword", hash)).toBe(false);
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
    it("should expose registration and local login procedures", () => {
      const caller = appRouter.createCaller(createMockContext(null));
      expect(caller.auth.register).toBeDefined();
      expect(caller.auth.loginLocal).toBeDefined();
      expect(caller.auth.logout).toBeDefined();
    });
  });

  describe("Account access states", () => {
    it("blocks a pending trainee from logging in", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForLogin(makeUser("pending", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);

      const caller = appRouter.createCaller(createMockContext(null));
      await expect(caller.auth.loginLocal({
        identifier: "trainee@example.com",
        password: "Password123!",
        loginType: "email",
      })).rejects.toThrow("PENDING:");
    });

    it("blocks a paused trainee from logging in", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForLogin(makeUser("paused", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);

      const caller = appRouter.createCaller(createMockContext(null));
      await expect(caller.auth.loginLocal({
        identifier: "trainee@example.com",
        password: "Password123!",
        loginType: "email",
      })).rejects.toThrow("PAUSED:");
    });

    it("allows an approved trainee to log in and creates a session cookie", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForLogin(makeUser("approved", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const cookies: unknown[] = [];
      const context = createMockContext(null);
      context.res.cookie = ((...args: unknown[]) => cookies.push(args)) as any;

      const caller = appRouter.createCaller(context);
      const result = await caller.auth.loginLocal({
        identifier: "0551111111",
        password: "Password123!",
        loginType: "phone",
      });

      expect(result.success).toBe(true);
      expect(cookies).toHaveLength(1);
      expect(fakeDb.update).toHaveBeenCalled();
    });

    it("blocks a paused user even when an old session cookie is still present", async () => {
      const pausedUser = makeUser("paused", null);
      vi.mocked(db.getUserByOpenId).mockResolvedValue(pausedUser);
      const session = await sdk.signSession(
        { openId: pausedUser.openId, appId: "local", name: pausedUser.name ?? "" },
        { expiresInMs: 60_000 },
      );
      const request = {
        headers: { cookie: `${COOKIE_NAME}=${session}` },
      } as any;

      await expect(sdk.authenticateRequest(request)).rejects.toThrow("Account is not approved");
    });
  });

  describe("User Management Router", () => {
    const adminContext = () => createMockContext({ id: 999, role: "admin", accountStatus: "approved" });

    it("should expose account-management procedures", () => {
      const caller = appRouter.createCaller(adminContext());
      expect(caller.userManagement.getAll).toBeDefined();
      expect(caller.userManagement.approve).toBeDefined();
      expect(caller.userManagement.pause).toBeDefined();
      expect(caller.userManagement.reject).toBeDefined();
      expect(caller.userManagement.delete).toBeDefined();
    });

    it("approves a trainee account", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.approve({ userId: 42 });

      expect(fakeDb.set).toHaveBeenCalledWith(expect.objectContaining({
        accountStatus: "approved",
        approvedBy: 999,
      }));
    });

    it("pauses a trainee account", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.pause({ userId: 42 });

      expect(fakeDb.set).toHaveBeenCalledWith({ accountStatus: "paused" });
    });

    it("prevents an administrator from pausing their own account", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(adminContext());

      await expect(caller.userManagement.pause({ userId: 999 })).rejects.toThrow("لا يمكن إيقاف حسابك الخاص");
      expect(fakeDb.update).not.toHaveBeenCalled();
    });

    it("prevents an administrator from deleting their own account", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(adminContext());

      await expect(caller.userManagement.delete({ userId: 999 })).rejects.toThrow("لا يمكن حذف حسابك الخاص");
      expect(fakeDb.delete).not.toHaveBeenCalled();
    });

    it("deletes a trainee and their related learning records", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.delete({ userId: 42 });

      expect(fakeDb.delete).toHaveBeenCalledTimes(8);
      expect(fakeDb.deleteWhere).toHaveBeenCalledTimes(8);
    });
  });

  describe("Logout Procedure", () => {
    it("clears the session cookie on logout", async () => {
      const clearedCookies: unknown[] = [];
      const context = createMockContext(null);
      context.res.clearCookie = ((...args: unknown[]) => clearedCookies.push(args)) as any;

      const caller = appRouter.createCaller(context);
      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies.length).toBeGreaterThan(0);
    });
  });
});
