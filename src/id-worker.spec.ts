import { IdWorker } from './id-worker'

describe('test id worker', () => {
  it('getId', () => {
    expect(IdWorker.getId()).toMatch(/[0-9]{19}/)
  })
})
