import TimelineInstanceObject from '$tl/objects/TimelineInstanceObject'
import AbstractDerivation from '$shared/DataVerse/derivations/AbstractDerivation'
import {valueDerivation} from '$shared/DataVerse/atom'
import {
  StaticValueContainer,
  IBezierCurvesOfScalarValues,
} from '$tl/Project/store/types'
import {Pointer} from '$shared/DataVerse/pointer'
import {derivationOfBezierCurvesOfStaticValues} from './bezierStuff/derivationOfBezierCurvesOfStaticValues'

export default class PropInstance {
  _valueDerivation: AbstractDerivation<number>
  constructor(
    readonly _timelnieInstanceObject: TimelineInstanceObject,
    readonly name: string,
  ) {
    const typeDefD = valueDerivation(
      this._timelnieInstanceObject._objectTemplate.atom.pointer.objectProps[
        name
      ],
    )

    const valueContainerP = this._timelnieInstanceObject._objectTemplate
      ._pointerToState.props[this.name].valueContainer

    const valueContainerTypeD = valueDerivation(valueContainerP.type)
    this._valueDerivation = typeDefD.flatMap(typeDef => {
      if (!typeDef) return 0
      return valueContainerTypeD.flatMap(valueContainerType => {
        if (!valueContainerType) {
          // @todo return default value
          return 0
        } else if (valueContainerType === 'StaticValueContainer') {
          return valueDerivation(
            (valueContainerP as Pointer<StaticValueContainer>).value,
          ).map(value => {
            if (typeof value === 'number') {
              return value
            } else {
              return 0
            }
          })
        } else if (valueContainerType === 'BezierCurvesOfScalarValues') {
          return derivationOfBezierCurvesOfStaticValues(
            ((valueContainerP as $IntentionalAny) as Pointer<
              IBezierCurvesOfScalarValues
            >).points,

            this._timelnieInstanceObject._timelineInstance.derivationToStatePointer.flatMap(
              statePointer => valueDerivation(statePointer.time),
            ),
          )
        } else {
          console.error('@todo', valueContainerType)
          return 0
        }
      })
    })
  }

  public get value() {
    return this._valueDerivation.getValue()
  }
}
