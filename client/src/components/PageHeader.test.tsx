// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  markReadMutate: vi.fn(),
  markAllReadMutate: vi.fn(),
  invalidate: vi.fn(),
  authInvalidate: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: 42, name: "Test Trainee", role: "user" },
    isAuthenticated: true,
  }),
}));

vi.mock("wouter", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
  useLocation: () => ["/courses", mocks.navigate],
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuItem: ({ children, onSelect }: { children: ReactNode; onSelect?: () => void }) => (
    <div role="menuitem" onClick={onSelect}>{children}</div>
  ),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      notifications: { getMine: { invalidate: mocks.invalidate } },
      auth: { me: { invalidate: mocks.authInvalidate } },
    }),
    notifications: {
      getMine: {
        useQuery: mocks.useQuery,
      },
      markRead: {
        useMutation: (options: { onSuccess?: () => void }) => ({
          mutate: (input: unknown) => {
            mocks.markReadMutate(input);
            options?.onSuccess?.();
          },
          isPending: false,
        }),
      },
      markAllRead: {
        useMutation: (options: { onSuccess?: () => void }) => ({
          mutate: () => {
            mocks.markAllReadMutate();
            options?.onSuccess?.();
          },
          isPending: false,
        }),
      },
    },
    auth: {
      logout: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}));

import PageHeader from "./PageHeader";

const notifications = [
  {
    id: 101,
    userId: 42,
    type: "account_approved",
    title: "تم قبول حسابك",
    message: "تم قبول طلب تسجيلك. يمكنك الآن بدء الدراسة.",
    isRead: false,
    createdAt: new Date("2026-08-31T10:00:00Z"),
  },
  {
    id: 102,
    userId: 42,
    type: "account_paused",
    title: "تم إيقاف حسابك مؤقتاً",
    message: "يرجى التواصل مع الإدارة.",
    isRead: false,
    createdAt: new Date("2026-08-30T10:00:00Z"),
  },
];

describe("PageHeader trainee notifications", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useQuery.mockReturnValue({ data: notifications });
  });

  it("renders the trainee bell, unread count, and notification content", () => {
    render(<PageHeader />);

    expect(screen.getByRole("button", { name: "إشعارات المتدرب" })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("إشعاراتي")).toBeInTheDocument();
    expect(screen.getByText("تم قبول حسابك")).toBeInTheDocument();
    expect(screen.getByText("تم إيقاف حسابك مؤقتاً")).toBeInTheDocument();
    expect(mocks.useQuery).toHaveBeenCalledWith(undefined, expect.objectContaining({ enabled: true }));
  });

  it("marks one notification as read and clears all unread state", () => {
    render(<PageHeader />);

    fireEvent.click(screen.getAllByText("تم قبول حسابك")[0]);
    expect(mocks.markReadMutate).toHaveBeenCalledWith({ notificationId: 101 });
    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("تحديد الكل كمقروء"));
    expect(mocks.markAllReadMutate).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
