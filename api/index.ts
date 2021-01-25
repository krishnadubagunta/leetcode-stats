import { NowRequest, NowResponse } from '@vercel/node'
import { getStats } from '../src/utils/getStats'
import { getSuccessSvg, getErrorSvg } from '../src/utils/getSvg'
import { getTheme } from '../src/utils/getTheme'

export default async (req: NowRequest, res: NowResponse) => {
  const {
    username,
    theme,
  } = req.query

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'public, max-age=1800')

  try {
    if (username) {
      const user = username as string
      const userTheme = theme ? getTheme((theme as string).toLowerCase()) : getTheme('light')

      const stats = await getStats(user)
      
      if (stats.status === 'success') {
        getSuccessSvg({stats, username: user, theme: userTheme})
      } else { // user does not exist
        return getErrorSvg(stats.message)
      }
    } else { // user did not enter username
      return getErrorSvg('please enter a username (ex: username=leetcodeuser)')
    }
  } catch { // unknown backend error
    return getErrorSvg('backend error occurred')
  }

}