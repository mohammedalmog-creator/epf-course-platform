import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * Hook that redirects authenticated users who haven't completed their profile
 * to the /profile-setup page. Call this in any protected page.
 */
export function useProfileGuard() {
  const [, navigate] = useLocation();
  const { data: profile, isLoading } = trpc.profile.get.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });

  useEffect(() => {
    // Only redirect if we have a user (authenticated) but profile is not completed
    if (!isLoading && profile && !profile.profileCompleted) {
      navigate("/profile-setup");
    }
  }, [isLoading, profile, navigate]);

  return { profile, isLoading };
}
