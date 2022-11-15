import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useSubmit, useTransition } from '@remix-run/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

import { useSelect } from '~/hook/useSelect'
import type { Language } from '~/services/session.server'
import { setLanguage } from '~/services/session.server'
import { getLanguage } from '~/services/session.server'

export async function loader({ request }: LoaderArgs) {
  return json(await getLanguage(request))
}

// async function testDelay() {
//   await new Promise((resolve) => setTimeout(resolve, 1000))
// }

export async function action({ request }: ActionArgs) {
  const data = await request.formData()
  console.log(data.get('lang'))
  // await testDelay()
  return json(null, await setLanguage(request, data.get('lang') as string))
  // return null
}
const languages = {
  'zh-CN': 'CN',
  'en-US': 'EN',
}

export default function Lang() {
  const lang = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const transition = useTransition()
  const submitting = useRef(false)

  const onChange = useCallback(
    (lang: Language) => {
      submitting.current = true
      submit({ lang }, { method: 'post' })
    },
    [submit],
  )

  const select = useSelect<Language>(onChange, lang)
  // feature test: optimistic UI
  const selectValue =
    (transition.submission?.formData.get('lang') as Language) || lang

  useEffect(() => {
    if (submitting.current && transition.state === 'idle') {
      return
    }

    submitting.current = false
    if (transition.state === 'idle' && select.selected !== lang) {
      submitting.current = false
      select.setSelected(lang)
    }
  }, [lang, select, transition.state])

  return (
    <div ref={select.rootRefHandler}>
      <input
        ref={select.inputRefHandler}
        value={languages[selectValue]}
        readOnly
      ></input>
      <motion.ul
        initial={false}
        ref={select.menuRefHandler}
        animate={select.isOpen ? 'open' : 'closed'}
        variants={{
          open: {
            clipPath: 'inset(-100% -100% -100% -100%)',
            opacity: 1,
          },
          closed: {
            clipPath: 'inset(0% 0% 100% 0%)',
            opacity: 0,
            transition: {
              duration: 0,
            },
          },
        }}
      >
        {Object.entries(languages).map(([key, value], idx) => (
          <motion.li
            ref={select.itemRefHandler(idx, key as Language)}
            key={key}
            className={clsx({
              'bg-gray-400': selectValue === key,
            })}
            // onClick={() => submit({ lang: key }, { method: 'post' })}
          >
            {value}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
