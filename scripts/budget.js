
import { v4 as uuidv4 } from 'uuid';
import { connection } from '../server.js';
import crypto from 'crypto';





const salt = crypto.randomBytes(16);
const password = 'password1234'
const saltString = `${salt}`
console.log(salt)
console.log(`salt string: ${salt}`)

