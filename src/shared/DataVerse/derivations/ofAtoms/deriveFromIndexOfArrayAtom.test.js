// @flow
import deriveFromIndexOfArrayAtom from './deriveFromIndexOfArrayAtom'
import * as D from '$shared/DataVerse'

describe('deriveFromIndexOfArrayAtom', () => {
  it('should work', () => {
    const ticker = new D.Ticker()

    const originals: Array<D.IBoxAtom<string>> = [
      D.atoms.box('0'),
      D.atoms.box('1'),
      D.atoms.box('2'),
      D.atoms.box('3'),
      D.atoms.box('4'),
    ]
    const a = D.atoms.array(originals)
    const index3 = deriveFromIndexOfArrayAtom(a, 3).map(val => val.getValue())
    const changes = []
    // debugger
    index3.changes(ticker).tap(c => {
      changes.push(c)
    })

    a.setIndex(0, D.atoms.box('01s'))
    a.setIndex(4, D.atoms.box('41'))
    ticker.tick()
    expect(changes).toHaveLength(0)

    a.setIndex(3, D.atoms.box('31'))
    ticker.tick()
    expect(changes).toMatchObject(['31'])
    // debugger
    a.splice(2, 1, [])
    ticker.tick()
    expect(changes).toHaveLength(2)
    a.splice(2, 0, [D.atoms.box('blah')])
    ticker.tick()
    expect(changes).toHaveLength(3)
  })
})
