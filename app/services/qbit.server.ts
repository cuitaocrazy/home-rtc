import path from 'node:path'
import querystring from 'node:querystring'

declare global {
  var qbtCookie: string | undefined
}

const baseUrl = process.env.QBITTORRENT_URL || 'http://localhost:8080/api/v2'
const loginUrl = `${baseUrl}/auth/login`
// const logoutUrl = `${baseUrl}/auth/logout`
// const getTorrenListUrl = `${baseUrl}/torrents/info`
const addTorrentUrl = `${baseUrl}/torrents/add`

const uasername = process.env.QBIT_USERNAME || 'admin'
const password = process.env.QBIT_PASSWORD || 'adminadmin'
const saveBasePath = process.env.QBIT_SAVE_BASE_PATH || '/downloads'

async function loginQBittorrent(username: string, password: string) {
  if (!globalThis.qbtCookie) {
    const body = querystring.stringify({ username, password })
    const response = await fetch(loginUrl, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    console.log(response.status)
    if (response.status === 200 && (await response.text()) === 'Ok.') {
      const cookie = response.headers.get('set-cookie')?.split(';')[0]
      console.log('ok', cookie)
      globalThis.qbtCookie = cookie
    } else {
      throw new Error('Login failed')
    }
  }

  return globalThis.qbtCookie
}

export async function addMagnet(
  magnet: string,
  category: string,
  savePath: string,
) {
  const formData = {
    urls: magnet,
    category: category,
    savepath: path.join(saveBasePath, savePath),
  }

  const boundary = '----formdata-RTC-' + Math.random()
  const prefix = `--${boundary}\r\nContent-Disposition: form-data; name=`
  const contentType = `multipart/form-data; boundary=${boundary}`

  const body =
    Object.keys(formData)
      .map((key) => {
        const value = formData[key as keyof typeof formData]
        return `${prefix}"${key}"\r\n\r\n${value}\r\n`
      })
      .join('') + `--${boundary}--\r\n`

  const cookie =
    globalThis.qbtCookie || (await loginQBittorrent(uasername, password))

  console.log('cookie', globalThis.qbtCookie)
  const response = await fetch(addTorrentUrl, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': contentType,
      Cookie: cookie!,
    },
  })

  return await response.text()
}
