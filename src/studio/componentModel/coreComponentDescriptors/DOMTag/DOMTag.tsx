import * as React from 'react'
import {ComponentDescriptor} from '$studio/componentModel/types'
import {makeReactiveComponent} from '$studio/handy'
import {DerivedClass} from '$src/shared/DataVerse/derivedClass/derivedClass'
import withDeps from '$src/shared/DataVerse/derivations/withDeps'
import boxAtom from '$src/shared/DataVerse/atoms/box'
import dictAtom from '$src/shared/DataVerse/atoms/dict'
import autoDerive from '$src/shared/DataVerse/derivations/autoDerive/autoDerive'

const lookupTable = {
  tagName: self => {
    return self
      .pointer()
      .prop('props')
      .prop('tagName')
  },

  render: self => {
    const childrenD = self
      .pointer()
      .prop('props')
      .prop('children')
      .toJS()

    const refFn = self.pointer().prop('refFn')
    const tagName = self.pointer().prop('tagName')

    const classP = self
      .pointer()
      .prop('props')
      .prop('class')

    return withDeps({tagName, refFn, classP, childrenD}, () => {
      return React.createElement(
        tagName.getValue(),
        {ref: refFn.getValue(), className: classP.getValue()},
        childrenD.getValue(),
      )
    })
  },

  refFn: self => {
    const stateP = self.pointer().prop('state')
    return autoDerive(() => {
      const state: DictAtom<{
        elRef: BoxAtom<undefined | null | HTMLElement>
      }> = stateP.getValue()

      return function setElRef(el) {
        state.setProp('elRef', boxAtom(el))
      }
    })
  },
}

type State = DictAtom<{
  elRef: BoxAtom<undefined | null | HTMLElement>
}>

const componentId = 'TheaterJS/Core/DOMTag'

export const propsTomakeReactiveComponent = {
  componentId,
  displayName: componentId,
  componentType: 'HardCoded',
  getInitialState(): State {
    return dictAtom({
      elRef: boxAtom(null),
    })
  },
  getClass: (dict: DerivedClass<$FixMe>) => dict.extend(lookupTable),
}

const DOMTag = makeReactiveComponent(propsTomakeReactiveComponent)

const descriptor: ComponentDescriptor = {
  id: componentId,
  displayName: 'DOMTag',
  type: 'HardCoded',
  reactComponent: DOMTag,
}

export default descriptor

const makeSeparateComponentForEachDomTag = () => {
  const supportedTags = [
    'div',
    'span',
    'header',
    'footer',
    'aside',
    'section',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'nav',
    'button',
    'input',
    'picture',
    'video',
    'article',
    'address',
    'ul',
    'ol',
    'li',
    'p',
    'pre',
    'main',
  ]

  const components = {}

  supportedTags.forEach(tagName => {
    const id = 'TheaterJS/Core/HTML/' + tagName
    const componentDescriptor = {
      ...descriptor,
      id,
      displayName: tagName,
      // $FlowIgnore
      reactComponent: makeReactiveComponent({
        ...propsTomakeReactiveComponent,
        componentId: id,
        displayName: tagName,
        getClass: (dict: DerivedClass<$FixMe>) =>
          dict.extend({
            ...lookupTable,
            tagName() {
              return tagName
            },
          }),
      }),
    }

    components[id] = componentDescriptor
  })

  return components
}

export const componentsForEachTag = makeSeparateComponentForEachDomTag()
