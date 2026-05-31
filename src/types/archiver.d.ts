declare module 'archiver' {
  import { Transform } from 'stream'
  import { ZlibOptions } from 'zlib'

  export class ZipArchive extends Transform {
    constructor(options?: { zlib?: ZlibOptions })
    append(source: Buffer | string, data?: { name: string }): this
    finalize(): void
    pipe<T extends NodeJS.WritableStream>(destination: T): T
    on(event: 'error', listener: (err: Error) => void): this
    on(event: string, listener: (...args: unknown[]) => void): this
  }
}
