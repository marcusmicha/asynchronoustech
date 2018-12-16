import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'
const bcrypt = require('bcrypt');

export class User {
    public username: string
    public email: string
    private password: string = ""
  
    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
      this.username = username
      this.email = email
  
      if (!passwordHashed) {
        this.setPassword(password)
      } else this.password = password
    }
    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(":")
        return new User(username, email, password)
      }
    
      public setPassword(toSet: string): void {
        let hash = bcrypt.hashSync(toSet, 10);
        this.password = hash
      }
    
      public getPassword(): string {
        return this.password
      }
    
      public validatePassword(toValidate: String): boolean {
        if(bcrypt.compareSync(toValidate, this.password)) {
            return true
           } else {
            return false
           }
      }
    }

export class UserHandler {
  public db: any

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      callback(null, User.fromDb(username, data))
    })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(`user:${user.username}`, `${user.getPassword}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    this.db.delete(`user:${username}`, (err: Error | null) => {
        callback(err)
    })
  }

  constructor(path: string) {
    this.db = LevelDb.open(path)
  }
}