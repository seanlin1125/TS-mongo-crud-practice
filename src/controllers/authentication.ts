import express, { Request, Response } from 'express'

import { getUserByEmail, createUser } from '../db/users'
import { random, authentication } from '../helpers'

//login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.sendStatus(400)
    }
    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    )
    if (!user) {
      return res.sendStatus(400)
    }
    const expectedHash = authentication(user.authentication.salt, password)
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403)
    }
    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()
    // res.cookie() 用於在 HTTP 響應標頭中添加一個 Set-Cookie 標頭，以便在客戶端瀏覽器中設置一個新的 cookie。具體來說，res.cookie('SEAN-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'}) 這行代碼將會創建一個名稱為 'SEAN-AUTH' 的 cookie，值為 user.authentication.sessionToken，域名為 'localhost'，路徑為 '/'。這樣客戶端瀏覽器就會在使用者登入後保存這個 cookie，並在後續的請求中將其發送給伺服器。伺服器可以通過這個 cookie 來識別已經登入的用戶，實現登入狀態的維持。
    res.cookie('SEAN-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    })
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
// register
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.sendStatus(400)
    }
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.sendStatus(400)
    }
    const salt = random()
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
