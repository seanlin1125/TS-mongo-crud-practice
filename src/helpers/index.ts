import crypto from 'crypto'

const SECRET = 'SEAN-REST-API'

//定義了一個random函式，使用crypto.randomBytes()函式生成一個128位的隨機字串，並使用toString()方法轉換為Base64格式的字串返回。
export const random = () => crypto.randomBytes(128).toString('base64')
//定義了一個authentication函式，接收兩個字串參數salt和password，返回一個加密後的字串。在函式內部，crypto.createHmac()函式創建了一個HMAC加密器，使用SHA-256哈希算法。HMAC加密需要一個密鑰和一個消息，密鑰在這裡是[salt, password].join('/')，即將salt和password用/符號連接起來，而消息則是SECRET。update()方法將這個消息傳入加密器進行加密，digest()方法則返回加密後的結果，這裡是一個16進位的字串。
export const authentication = (salt: string, password: string): string => {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex')
}
