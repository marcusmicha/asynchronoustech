import { LevelDb } from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
    public timestamp: string
    public value: number

    constructor(ts: string, v: number) {
        this.timestamp = ts
        this.value = v
    }
}

export class MetricsHandler {
    public db: any

    constructor(dbPath: string) {
        this.db = LevelDb.open(dbPath)
    }
    public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {
        const rs = this.db.createReadStream(key)
        rs.on("error", callback)
        rs.on("close", callback)
        rs.on("data", (data:any) => {
            console.log(data)
        })
      }
    public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db)
        stream.on('error', callback)
        stream.on('close', callback)
        metrics.forEach((m: Metric) => {
            stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
        })
        stream.end()
    }

    public delete(key: number, callback: (error: Error | null, result?: Metric[]) => void) {
        const del = this.db.createReadStream(key)
        del.on("error", callback)
        del.on("close", callback)
        del.on("data", (value:any) => {
            console.log(value)
            this.db.del(value.key)
        })
    }

}
