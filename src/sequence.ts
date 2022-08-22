import * as ip from './util/ip'
import * as crypto from 'crypto'
import * as strings from './util/strings'

/**
 * 分布式高效有序 ID 生产黑科技(sequence)
 *
 * @author litao
 * @since 2022-08-22
 */
export class Sequence {
  /**
   * 时间起始标记点，作为基准，一般取系统的最近时间（一旦确定不能变动）
   */
  private twepoch: number = 1288834974657
  /**
   * 机器标识位数
   */
  private workerIdBits: number = 5
  private datacenterIdBits: number = 5
  private maxWorkerId: number = -1 ^ (-1 << this.workerIdBits)
  private maxDatacenterId: number = -1 ^ (-1 << this.datacenterIdBits)
  /**
   * 毫秒内自增位
   */
  private sequenceBits: number = 12
  private workerIdShift: number = this.sequenceBits
  private datacenterIdShift: number = this.sequenceBits + this.workerIdBits
  /**
   * 时间戳左移动位
   */
  private timestampLeftShift: number =
    this.sequenceBits + this.workerIdBits + this.datacenterIdBits
  private sequenceMask: number = -1 ^ (-1 << this.sequenceBits)

  private workerId: number = 0

  /**
   * 数据标识 ID 部分
   */
  private datacenterId: number = 0
  /**
   * 并发控制
   */
  private sequence: number = 0
  /**
   * 上次生产 ID 时间戳
   */
  private lastTimestamp: number = -1

  /**
   * IP 地址
   */
  private inetAddress?: string = ''

  constructor(inetAddress?: string) {
    this.inetAddress = inetAddress
    this.datacenterId = this.getDatacenterId(this.maxDatacenterId)
    this.workerId = this.getMaxWorkerId(this.datacenterId, this.maxWorkerId)
  }

  /**
   * 获取 maxWorkerId
   */
  protected getMaxWorkerId(datacenterId: number, maxWorkerId: number): number {
    const mpid: string = `${datacenterId}${14664}`
    /*
     * MAC + PID 的 hashcode 获取16个低位
     */
    return (strings.hashCode(mpid) & 0xffff) % (maxWorkerId + 1)
  }

  /**
   * 数据标识id部分
   */
  protected getDatacenterId(maxDatacenterId: number): number {
    let id: number = 0
    try {
      let name: string
      if (!this.inetAddress) {
        name = ip.getInterfaceName()
        this.inetAddress = ip.getIPv4(name)
      } else {
        name = ip.getInterfaceName(this.inetAddress)
      }
      if (!name) {
        id = 1
      } else {
        const mac: Buffer = ip.getHardwareAddress(name)
        if (mac) {
          const byte: number = mac.readUint16LE(mac.length - 2)
          id = ((0x000000ff & byte) | (0x0000ff00 & byte)) >> 6
          id = id % (maxDatacenterId + 1)
        }
      }
    } catch (e) {
      console.warn('getDatacenterId: ' + e)
    }
    return id
  }

  public nextId(): string {
    let timestamp: number = this.timeGen()
    //闰秒
    if (timestamp < this.lastTimestamp) {
      const offset: number = this.lastTimestamp - timestamp
      if (offset <= 5) {
        timestamp = this.timeGen()
        if (timestamp < this.lastTimestamp) {
          throw new Error(
            `Clock moved backwards.  Refusing to generate id for ${offset} milliseconds`
          )
        }
      } else {
        throw new Error(
          `Clock moved backwards.  Refusing to generate id for ${offset} milliseconds`
        )
      }
    }
    if (this.lastTimestamp == timestamp) {
      // 相同毫秒内，序列号自增
      this.sequence = (this.sequence + 1) & this.sequenceMask
      if (this.sequence == 0) {
        // 同一毫秒的序列数已经达到最大
        timestamp = this.tilNextMillis(this.lastTimestamp)
      }
    } else {
      // 不同毫秒内，序列号置为 1 - 3 随机数
      this.sequence = crypto.randomInt(1, 3)
    }

    this.lastTimestamp = timestamp

    // 时间戳部分 | 数据中心部分 | 机器标识部分 | 序列号部分
    return (
      (BigInt(timestamp - this.twepoch) << BigInt(this.timestampLeftShift)) |
      (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift)) |
      (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
      BigInt(this.sequence)
    ).toString()
  }

  protected tilNextMillis(lastTimestamp: number): number {
    let timestamp: number = this.timeGen()
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen()
    }
    return timestamp
  }

  protected timeGen(): number {
    return Date.now()
  }
}
