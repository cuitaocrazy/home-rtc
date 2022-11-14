import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

import { setLanguage } from '~/services/session.server'

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const lang = formData.get('lang') || 'zh-CN'

  return json('ok', await setLanguage(request, lang.toString()))
}
