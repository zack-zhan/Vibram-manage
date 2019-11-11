import * as config from './config'
const OSS = require('ali-oss')
const client = OSS({
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucketName
})
export function upload (file, processCallback) {
  const tmpcnt = file.name.lastIndexOf('.')
  const ext = file.name.substring(tmpcnt + 1)
  return client.put(`${file.uid}.${ext}`, file, { progress: processCallback })
}
