import { createCookieSessionStorage } from '@remix-run/node'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

const LANG_SESSION_KEY = 'lang'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function getLanguage(request: Request) {
  const session = await getSession(request)
  return session.get(LANG_SESSION_KEY) || 'zh-CN'
}

export async function setLanguage(request: Request, lang: string) {
  const session = await getSession(request)
  session.set(LANG_SESSION_KEY, lang)
  return {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }),
    },
  }
}
