// @flow
import BoxAtom from './BoxAtom'

describe('DataVerse.BoxAtom', () => {
  it('should allow getting and setting values', () => {
    const r = new BoxAtom('foo')
    expect(r.unbox()).toEqual('foo')
    r.set('bar')
    expect(r.unbox()).toEqual('bar')
  })

  it('should correctly report changes', () => {
    const r = new BoxAtom('foo')
    const changes = []
    r.changes().tap((change) => {changes.push(change)})
    r.set('bar')
    r.set('bar')
    r.set('baz')

    expect(changes).toHaveLength(3)
    expect(changes).toMatchObject([
      'bar',
      'bar',
      'baz',
    ])
  })

  it('should correctly report deep changes', () => {
    const r = new BoxAtom('foo')
    const deepChanges = []
    r.deepChanges().tap((change) => {deepChanges.push(change)})
    r.set('bar')
    r.set('bar')
    r.set('baz')

    expect(deepChanges).toHaveLength(3)
    expect(deepChanges).toMatchObject([
      {address: [], type: 'BoxChange', newValue: 'bar'},
      {address: [], type: 'BoxChange', newValue: 'bar'},
      {address: [], type: 'BoxChange', newValue: 'baz'},
    ])
  })

  it('should correctly report deep diffs', () => {
    const r = new BoxAtom('foo')
    const deepDiffs = []
    r.deepDiffs().tap((change) => {deepDiffs.push(change)})
    r.set('bar')
    r.set('bar')
    r.set('baz')

    expect(deepDiffs).toHaveLength(3)
    expect(deepDiffs).toMatchObject([
      {address: [], type: 'BoxDiff', oldValue: 'foo', newValue: 'bar'},
      {address: [], type: 'BoxDiff', oldValue: 'bar', newValue: 'bar'},
      {address: [], type: 'BoxDiff', oldValue: 'bar', newValue: 'baz'},
    ])
  })
})