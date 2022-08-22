import * as crypto from 'crypto'

/**
 * Id生成器抽象类
 * @author litao
 * @since 2022-08-22
 */
export abstract class IdentifierGenerator {
  /**
   * 判断是否分配 ID
   * @param value 主键值
   * @returns true 分配 false 无需分配
   */
  public assignId(value: any): boolean {
    return !!value
  }

  /**
   * 生成id
   * @param _entity 实体
   * @returns id
   */
  abstract nextId(_entity?: any): string

  /**
   * 生成uuid
   * @param _entity 实体
   * @returns uuid
   */
  public nextUUID(_entity?: any): string {
    return crypto.randomUUID()
  }
}
