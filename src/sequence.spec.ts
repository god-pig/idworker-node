import { Sequence } from './sequence'

describe('test sequence', () => {
  let sequence = new Sequence()

  it('nextId', () => {
    expect(sequence.nextId()).toMatch(/[0-9]{19}/)
  })
})
