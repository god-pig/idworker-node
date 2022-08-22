import { IdentifierGenerator } from './identifier-generator'
import { Sequence } from './sequence'

/**
 * 默认生成器
 * @author  litao
 * @since 2022-08-22
 */
export class DefaultIdentifierGenerator extends IdentifierGenerator {
  private sequence: Sequence

  constructor() {
    super()
    this.sequence = new Sequence()
  }

  public nextId(_entity?: any): string {
    return this.sequence.nextId()
  }
}
