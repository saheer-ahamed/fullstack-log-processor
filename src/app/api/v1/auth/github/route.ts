import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(request: Request) {
  try {
    console.log("hier")
    const { searchParams, origin } = new URL(request.url);

    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host"); 
        const isLocalEnv = process.env.NODE_ENV === "development";
        if (isLocalEnv) {
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
    console.log("erro = ", error)
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login`);
  }
}
