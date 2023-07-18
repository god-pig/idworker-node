import { IdentifierGenerator } from './identifier-generator'
import { Sequence, SequenceOptions } from './sequence'

/**
 * 默认生成器
 * @author  litao
 * @since 2022-08-22
 */
export class DefaultIdentifierGenerator extends IdentifierGenerator {
  private sequence: Sequence

  constructor(options?: SequenceOptions) {
    super()
    this.sequence = new Sequence(options)
  }

  public nextId(_entity?: any): string {
    return this.sequence.nextId()
  }
}
