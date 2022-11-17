import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useSubmit, useTransition } from '@remix-run/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

import { useSelect } from '~/hook/useSelect'
import type { Language } from '~/services/session.server'
import { getLanguage, setLanguage } from '~/services/session.server'

export async function loader({ request }: LoaderArgs) {
  return json(await getLanguage(request))
}

// async function testDelay() {
//   await new Promise((resolve) => setTimeout(resolve, 1000))
// }

export async function action({ request }: ActionArgs) {
  const data = await request.formData()
  return json(
    data.get('lang') as Language,
    await setLanguage(request, data.get('lang') as Language),
  )
}

const languages = {
  'zh-CN': 'CN',
  'en-US': 'EN',
}

export default function Lang() {
  const lang = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const transition = useTransition()
  const select = useSelect<Language>((lang) => {
    submit({ lang }, { method: 'post', replace: true })
  }, lang)
  const { setSelected, selected } = select

  useEffect(() => {
    if (transition.state !== 'idle') {
      return
    }

    // 同步服务端Lang
    setSelected(lang)
  }, [lang, transition.state, setSelected])

  const selectValue = selected || lang

  return (
    <div ref={select.rootRefHandler}>
      <span tabIndex={0} ref={select.inputRefHandler}>
        {languages[selectValue]}
      </span>
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
            onClick={() => submit({ lang: key }, { method: 'post' })}
          >
            {value}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
