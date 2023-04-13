import express, { Request, Response, NextFunction } from 'express'
import { get, merge } from 'lodash'

import { getUserBySessionToken } from '../db/users'

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies['SEAN-AUTH']

    if (!sessionToken) {
      return res.sendStatus(403)
    }

    const existingUser = await getUserBySessionToken(sessionToken)

    if (!existingUser) {
      return res.sendStatus(403)
    }
    // merge方法來自Lodash庫，它是一個JavaScript實用程序庫，提供了很多有用的函數，用於簡化JavaScript編程。在這裡，merge(req, { identity: existingUser })的作用是將新對象{ identity: existingUser }合併到現有的req對象中，這將導致req對象包含一個名為identity的新屬性，該屬性值為existingUser對象。然後，這個已更新的req對象將作為參數傳遞給next()方法，以便將請求傳遞到下一個中間件或路由處理程序。
    merge(req, { identity: existingUser })

    return next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
