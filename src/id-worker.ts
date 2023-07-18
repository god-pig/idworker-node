import { DefaultIdentifierGenerator } from './default-identifier-generator'
import { IdentifierGenerator } from './identifier-generator'

export class IdWorker {
  private static IDENTIFIER_GENERATOR: IdentifierGenerator =
    new DefaultIdentifierGenerator()

  /**
   * 获取唯一ID
   *
   * @return id
   */
  public static getId(entity?: any): string {
    return IdWorker.IDENTIFIER_GENERATOR.nextId(entity)
  }

  /**
   * 有参构造器
   *
   * @param workerId     工作机器 ID
   * @param dataCenterId 序列号
   */
  public static initSequence(workerId: number, datacenterId: number): void {
    IdWorker.IDENTIFIER_GENERATOR = new DefaultIdentifierGenerator({
      workerId,
      datacenterId
    })
  }

  /**
   * 自定义id 生成方式
   *
   * @param generator id 生成器
   */
  public static setIdentifierGenerator(generator: IdentifierGenerator): void {
    IdWorker.IDENTIFIER_GENERATOR = generator
  }
}
