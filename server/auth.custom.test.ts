import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn(),
  getUserByOpenId: vi.fn(),
  getUserById: vi.fn(),
  createUserNotification: vi.fn().mockResolvedValue(undefined),
  getUserNotifications: vi.fn().mockResolvedValue([]),
  markUserNotificationRead: vi.fn().mockResolvedValue(undefined),
  markAllUserNotificationsRead: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import bcrypt from "bcryptjs";
import { appRouter, getCertificateVerificationUrl } from "./routers";
import * as db from "./db";
import type { TrpcContext } from "./_core/context";
import { sdk } from "./_core/sdk";
import { COOKIE_NAME } from "@shared/const";
import { getLoginRedirectForError } from "../client/src/pages/Login";

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

function makeDbForRegister() {
  const limit = vi.fn().mockResolvedValue([]);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  const select = vi.fn().mockReturnValue({ from });
  const insertValues = vi.fn().mockResolvedValue(undefined);
  const insert = vi.fn().mockReturnValue({ values: insertValues });

  return { select, insert, insertValues, limit };
}

function makeDbForUserLifecycle(initialUser: AuthenticatedUser | null) {
  let currentUser = initialUser;
  const limit = vi.fn().mockImplementation(async () => currentUser ? [currentUser] : []);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  const select = vi.fn().mockReturnValue({ from });
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const set = vi.fn().mockImplementation((values: Record<string, unknown>) => {
    if (currentUser && typeof values.accountStatus === "string") {
      currentUser = { ...currentUser, accountStatus: values.accountStatus as AuthenticatedUser["accountStatus"] };
    }
    return { where: updateWhere };
  });
  const update = vi.fn().mockReturnValue({ set });
  const deleteWhere = vi.fn().mockImplementation(async () => {
    currentUser = null;
  });
  const deleteFn = vi.fn().mockReturnValue({ where: deleteWhere });
  const insertValues = vi.fn().mockImplementation(async (values: Partial<AuthenticatedUser>) => {
    currentUser = {
      ...makeUser("pending", typeof values.passwordHash === "string" ? values.passwordHash : ""),
      ...values,
      id: 42,
      accountStatus: "pending",
    } as AuthenticatedUser;
  });
  const insert = vi.fn().mockReturnValue({ values: insertValues });

  return { select, update, set, updateWhere, delete: deleteFn, deleteWhere, insert, insertValues };
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

  describe("Login Page Redirects", () => {
    it("redirects pending accounts to the pending-approval page", () => {
      expect(getLoginRedirectForError("PENDING: account awaiting approval")).toBe("/pending-approval");
    });

    it("does not redirect paused or invalid-login errors", () => {
      expect(getLoginRedirectForError("PAUSED: account suspended")).toBeNull();
      expect(getLoginRedirectForError("UNAUTHORIZED: invalid credentials")).toBeNull();
    });
  });

  describe("Certificate Verification URL", () => {
    it("builds a public verification URL for certificate PDFs", () => {
      expect(getCertificateVerificationUrl("ALM-ABC-1234")).toBe("https://almog.vip/verify/ALM-ABC-1234");
    });
  });

  describe("Auth Router Structure", () => {
    it("should expose registration and local login procedures", () => {
      const caller = appRouter.createCaller(createMockContext(null));
      expect(caller.auth.register).toBeDefined();
      expect(caller.auth.loginLocal).toBeDefined();
      expect(caller.auth.logout).toBeDefined();
    });

    it("registers a new trainee as pending and notifies the administrator", async () => {
      const fakeDb = makeDbForRegister();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(createMockContext(null));

      const result = await caller.auth.register({
        name: "New Trainee",
        email: "new.trainee@example.com",
        phone: "0552222222",
        password: "Password123!",
      });

      expect(result.success).toBe(true);
      expect(fakeDb.insertValues).toHaveBeenCalledWith(expect.objectContaining({
        name: "New Trainee",
        email: "new.trainee@example.com",
        phone: "0552222222",
        accountStatus: "pending",
        loginMethod: "local",
      }));
      const values = fakeDb.insertValues.mock.calls[0]?.[0] as { passwordHash?: string };
      expect(values.passwordHash).toBeTruthy();
      expect(await bcrypt.compare("Password123!", values.passwordHash ?? "")).toBe(true);
    });

    it("rejects invalid registration passwords before reaching the database", async () => {
      const fakeDb = makeDbForRegister();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(createMockContext(null));

      await expect(caller.auth.register({
        name: "New Trainee",
        email: "new.trainee@example.com",
        phone: "0552222222",
        password: "short",
      })).rejects.toThrow();
      expect(fakeDb.insert).not.toHaveBeenCalled();
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

    it("allows an approved trainee to log in by phone and creates a session cookie", async () => {
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

    it("allows an approved trainee to log in by email", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForLogin(makeUser("approved", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(createMockContext(null));

      const result = await caller.auth.loginLocal({
        identifier: "trainee@example.com",
        password: "Password123!",
        loginType: "email",
      });

      expect(result.success).toBe(true);
    });

    it("allows login after an administrator approves the trainee", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForUserLifecycle(makeUser("pending", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const adminCaller = appRouter.createCaller(createMockContext({ id: 999, role: "admin" }));

      await adminCaller.userManagement.approve({ userId: 42 });
      const traineeCaller = appRouter.createCaller(createMockContext(null));
      const result = await traineeCaller.auth.loginLocal({
        identifier: "trainee@example.com",
        password: "Password123!",
        loginType: "email",
      });

      expect(result.success).toBe(true);
    });

    it("blocks login after an administrator rejects the trainee", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForUserLifecycle(makeUser("approved", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const adminCaller = appRouter.createCaller(createMockContext({ id: 999, role: "admin" }));

      await adminCaller.userManagement.reject({ userId: 42 });
      const traineeCaller = appRouter.createCaller(createMockContext(null));
      await expect(traineeCaller.auth.loginLocal({
        identifier: "trainee@example.com",
        password: "Password123!",
        loginType: "email",
      })).rejects.toThrow("REJECTED:");
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

    it("approves a trainee account and creates an approval notification", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      vi.mocked(db.getUserById).mockResolvedValue(makeUser("pending", null));
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.approve({ userId: 42 });

      expect(fakeDb.set).toHaveBeenCalledWith(expect.objectContaining({
        accountStatus: "approved",
        approvedBy: 999,
      }));
      expect(db.createUserNotification).toHaveBeenCalledWith(expect.objectContaining({
        userId: 42,
        type: "account_approved",
        title: "تم قبول حسابك",
      }));
    });

    it("creates a reactivation notification when a paused account is restored", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      vi.mocked(db.getUserById).mockResolvedValue(makeUser("paused", null));
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.approve({ userId: 42 });

      expect(db.createUserNotification).toHaveBeenCalledWith(expect.objectContaining({
        userId: 42,
        type: "account_reactivated",
        title: "تمت إعادة تفعيل حسابك",
      }));
    });

    it("pauses a trainee account and creates a pause notification", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      vi.mocked(db.getUserById).mockResolvedValue(makeUser("approved", null));
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.pause({ userId: 42 });

      expect(fakeDb.set).toHaveBeenCalledWith({ accountStatus: "paused" });
      expect(db.createUserNotification).toHaveBeenCalledWith(expect.objectContaining({
        userId: 42,
        type: "account_paused",
        title: "تم إيقاف حسابك مؤقتاً",
      }));
    });

    it("rejects a trainee account and creates a rejection notification", async () => {
      const fakeDb = makeDbForAdmin();
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      vi.mocked(db.getUserById).mockResolvedValue(makeUser("pending", null));
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.reject({ userId: 42 });

      expect(fakeDb.set).toHaveBeenCalledWith({ accountStatus: "rejected" });
      expect(db.createUserNotification).toHaveBeenCalledWith(expect.objectContaining({
        userId: 42,
        type: "account_rejected",
        title: "تم رفض طلب تسجيلك",
      }));
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

    it("deletes a trainee, blocks the deleted account, and allows re-registration", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 4);
      const fakeDb = makeDbForUserLifecycle(makeUser("approved", passwordHash));
      vi.mocked(db.getDb).mockResolvedValue(fakeDb as any);
      const caller = appRouter.createCaller(adminContext());

      await caller.userManagement.delete({ userId: 42 });
      const traineeCaller = appRouter.createCaller(createMockContext(null));
      await expect(traineeCaller.auth.loginLocal({
        identifier: "trainee@example.com",
        password: "Password123!",
        loginType: "email",
      })).rejects.toThrow("بيانات الدخول غير صحيحة");

      const registration = await traineeCaller.auth.register({
        name: "Test Trainee Again",
        email: "trainee@example.com",
        phone: "0551111111",
        password: "Password123!",
      });

      expect(registration.success).toBe(true);
      expect(fakeDb.insertValues).toHaveBeenCalled();
      expect(fakeDb.delete).toHaveBeenCalledTimes(8);
      expect(fakeDb.deleteWhere).toHaveBeenCalledTimes(8);
    });
  });

  describe("Notifications Router", () => {
    it("returns only the signed-in trainee's notifications and marks them read", async () => {
      const notifications = [{
        id: 7,
        userId: 999,
        type: "account_approved",
        title: "تم قبول حسابك",
        message: "يمكنك الآن الدخول.",
        isRead: false,
        createdAt: new Date(),
      }];
      vi.mocked(db.getUserNotifications).mockResolvedValue(notifications as any);
      const caller = appRouter.createCaller(createMockContext({ id: 999, role: "user" }));

      await expect(caller.notifications.getMine()).resolves.toEqual(notifications);
      await caller.notifications.markRead({ notificationId: 7 });
      await caller.notifications.markAllRead();

      expect(db.getUserNotifications).toHaveBeenCalledWith(999);
      expect(db.markUserNotificationRead).toHaveBeenCalledWith(999, 7);
      expect(db.markAllUserNotificationsRead).toHaveBeenCalledWith(999);
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
