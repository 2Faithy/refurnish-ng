"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const next = searchParams.get("next");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem(
          "refurnish_user",
          JSON.stringify({ ...user, token })
        );

        router.push(next || "/dashboard");
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-[#FAF4EC] flex items-center justify-center">
      <p className="text-sm font-bold text-[#211000]/60">
        Signing you in…
      </p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF4EC] flex items-center justify-center">
          <p className="text-sm font-bold text-[#211000]/60">
            Loading...
          </p>
        </main>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}