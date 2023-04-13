import express, { Request, Response } from 'express'

import { getUserByEmail, createUser } from '../db/users'
import { random, authentication } from '../helpers'

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
      password: authentication(salt, password),
    })
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
