import ReactDOM from 'react-dom'
import React from 'react'
import css from '$shared/components/FixedFullSizeContainer/FixedFullSizeContainer.css'
import resolveCss from '$shared/utils/resolveCss'

const classes = resolveCss(css)

interface IProps {
  usePortal?: boolean
  suppressPointerEvents?: boolean
}

class FixedFullSizeContainer extends React.PureComponent<IProps, {}> {
  static defaultProps = {
    usePortal: true,
  }

  render() {
    const theContainer = (
      <div
        {...classes(
          'container',
          this.props.suppressPointerEvents !== false && 'suppressPointerEvents',
        )}
      >
        {this.props.children}
      </div>
    )
    return this.props.usePortal
      ? ReactDOM.createPortal(theContainer, document.querySelector(
          '.theatrejs-ui-root',
        ) as HTMLElement)
      : theContainer
  }
}

export default FixedFullSizeContainer
