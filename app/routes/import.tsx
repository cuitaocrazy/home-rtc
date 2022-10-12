import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

import { getVideoInfo } from '~/services/movie.server'

export async function action({ request }: LoaderArgs) {
  // const formdata = await request.formData()
  // const path = formdata.get("path")
  // if (!path) {
  //   return json({ error: "Path is required" }, { status: 400 })
  // }
  // try {
  //   const vis = await getVideoInfo(path.toString())
  //   for (const vi of vis) {
  //     const imdb = await searchFirstMovie(vi.title)
  //     if (!imdb) {
  //       console.log(vi.title)
  //     }
  //   }
  //   return json({ data: vis })
  // } catch (error: any) {
  //   console.log(error.message)
  //   return json({ error: error.message }, { status: 400 })
  // }
}

export default function Import() {
  // const actionData = useActionData<typeof action>()
  // return (
  //   <div>
  //     {actionData && "error" in actionData && actionData.error && (
  //       <div>{actionData.error}</div>
  //     )}
  //     <Form method="post">
  //       <input name="path" />
  //       <button type="submit">Submit</button>
  //     </Form>
  //     <div>
  //       {actionData &&
  //         "data" in actionData &&
  //         actionData.data &&
  //         actionData.data.map((vi) => (
  //           <div key={vi.path}>
  //             <div>{vi.path}</div>
  //             <div>{vi.title}</div>
  //           </div>
  //         ))}
  //     </div>
  //   </div>
  // )
}
