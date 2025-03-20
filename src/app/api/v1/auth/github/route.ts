import { NextResponse } from "next/server";
import { createClient } from "@/src/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);

    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
        const isLocalEnv = process.env.NODE_ENV === "development";
        if (isLocalEnv) {
          // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    }
    return NextResponse.redirect(`${origin}/login`);
  } catch (error) {
    return NextResponse.redirect(`${origin}/login`);
  }
}
