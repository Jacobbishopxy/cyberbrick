/**
 * Created by Jacob Xie on 11/25/2020
 */

import RGL, {WidthProvider} from "react-grid-layout"

const GridLayout = WidthProvider(RGL)

const gridLayoutDefaultProps = {
  className: "layout",
  cols: 12,
  rowHeight: 20,
}

export default () => {

  const layout = [
    {i: 'a', x: 0, y: 0, w: 1, h: 2},
    {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
    {i: 'c', x: 4, y: 0, w: 1, h: 2}
  ]

  return (
    <GridLayout
      {...gridLayoutDefaultProps}
      layout={layout}
      // isDraggable={false}  // todo: set to false when children required editing
    >
      <div key="a" style={{background: "gray"}}>
        <GridLayout
          {...gridLayoutDefaultProps}
          layout={layout}
        >
          <div key="a" style={{background: "lightgray"}}>a</div>
          <div key="b" style={{background: "lightgray"}}>b</div>
          <div key="c" style={{background: "lightgray"}}>c</div>
        </GridLayout>
      </div>
      <div key="b" style={{background: "gray"}}>b</div>
      <div key="c" style={{background: "gray"}}>c</div>
    </GridLayout>
  )
}

