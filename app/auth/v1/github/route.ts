import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  console.log("origin = ", origin)
  const code = searchParams.get('code')
  console.log("code = ", code)
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'
  console.log("next = ", next)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log("data = ", data)
    console.log("error = ", error)
    if (!error) {
      console.log("no error")
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      console.log("forwardedHost = ", forwardedHost)
      const isLocalEnv = process.env.NODE_ENV === 'development'
      console.log("isLocalEnv = ", isLocalEnv)
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        console.log("formhheree")
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        console.log("formhheree2")
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}