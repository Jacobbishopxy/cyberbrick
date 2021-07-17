import './NestedModule.css';
import DynamicHeader from './DynamicHeader';
import { useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { ContentWithId, Module, tabItem } from './data';
import { Button, Skeleton } from 'antd';
import { Content, ElementType } from '@/components/Gallery/GalleryDataType';

import { TemplateElement } from '@/components/Gallery/Dashboard/DashboardContainer/TemplateElement';

const ReactGridLayout = WidthProvider(RGL)
const defaultItems: tabItem[] = [0, 1, 2, 3, 4].map(function (i, key, list) {
  return {
    i: i.toString(),
    x: i,
    y: 0,
    w: 1,
    h: 1,
    isResizable: false,
    text: i.toString(),
    autoSize: true,
    static: true,
  };
})

let tempContent: Content = {
  date: `${new Date()}`,
  data: {
    content: "content",
    text: "text"
  }
}

export default () => {
  const [moduleList, setModuleList] = useState<Module[]>([])
  const setLayout = useState<ReactGridLayout.Layout[]>([])[1]
  const [currIndex, setCurrIndex] = useState("0")
  const [items, setItems] = useState(defaultItems)
  const [newCounter, setNewCounter] = useState(0)
  const [editable, setEditable] = useState(false)
  // const [updateCount, setUpdateCount] = useState(0)
  // const [currModule, setCurrModule] = useState<JSX.Element>()
  const [content, setContentList] = useState<ContentWithId[]>([])

  useEffect(() => {
    // effect
    // console.log(items)
    onLayoutChange(items)
  }, [items])

  // useEffect(() => {
  //   console.log("currmodule updated")
  // }, [currModule])

  // useEffect(() => {
  //   //reset curr module when currIndex changed
  //   console.log("module list updated");
  //   setCurrModule((moduleList.find((mod) => mod.id === currIndex))?.module)
  // }, [currIndex])

  useEffect(() => {
    setItems((item) => item.map(
      (ele) => ele = { ...ele, isDraggable: editable, static: !editable }))
    console.log(items)
  }, [editable])

  //add new tabs
  const onAddItem = () => {
    /*eslint no-console: 0*/
    console.log("adding", "n" + newCounter);
    setItems(items =>
      // Add a new item. It must have a unique key!
      items.concat({
        i: "n" + newCounter,
        x: (items.length) % (12),
        y: Math.floor((items.length) / (12)), // puts it at the bottom
        w: 1,
        h: 1,
        isResizable: false,
        text: "n" + newCounter,
      }));
    // Increment the counter to ensure key is always unique.
    setNewCounter(cnt => cnt + 1)
  }

  //remove tabs
  const onRemoveItem = (i: string) => {
    console.log("removing", i);
    // setItems({ items: _.reject(items, { i: i }) });
    setItems(its => its.filter(el => el.i !== i))
  }

  //switch the module(template) corresponding to different tabs
  const onSwitch = (i: string) => {
    setCurrIndex(i)
  }

  const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
    setLayout(layout);
    // console.log(layout)
  };

  //called when the add a new module
  const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => {
    let data = { text: name, content: name }
    //replace existing module
    if (moduleList.find(mod => mod.id === tabId)) {
      //update module content
      onRemoveModule(tabId)
      // console.log(data)
      // setContentList(cts => cts.map(ct => {
      //   if (ct.id === tabId) { return data }
      //   return ct.content
      // }))

    }

    //else add new element
    let newEle = newElement(name, timeSeries, moduleType, tabId)
    let newModule: Module = { id: tabId, module: newEle }
    setModuleList(ml => ml.concat(newModule))
    let newContent = { id: tabId, content: data }
    setContentList(ct => ct.concat(newContent))
    // setCurrModule(newEle)

  }
  const onRemoveModule = (id: string) => {
    setModuleList(moduleList.filter(mod => mod.id !== id))
  }
  const newElement = (name: string, timeSeries: boolean, elementType: ElementType, tabId: string) => {
    const fetchContent = async (id: string, data?: string) => {
      console.log(id, data)
      return tempContent
    }
    const updateContent = (c: Content) => {
      console.log(c)
    }


    const elements = [
      {
        id: tabId,
        name: name,
        type: elementType,
        timeSeries: timeSeries,
        x: 0,
        y: 0,
        h: 20,
        w: 12,
      }
    ]

    return (
      <ReactGridLayout
        rowHeight={10}
        onLayoutChange={onLayoutChange}
        isDraggable={editable}
        isResizable={editable}
      >
        {
          elements.map((ele, i) =>
            <div key={ele.name} data-grid={elements[0]}>
              <TemplateElement
                parentInfo={[]}
                timeSeries={timeSeries}
                editable={editable}
                element={elements[0]}
                onRemove={() => onRemoveModule(tabId)}
                fetchContentFn={fetchContent}
                fetchContentDatesFn={async (id: string, markName?: string) => elements[0]}
                updateContentFn={updateContent}
                fetchStoragesFn={async () => []}
                fetchTableListFn={async (id) => [id]}
                fetchTableColumnsFn={async (storageId: string, tableName: string) => [storageId, tableName]}
                fetchQueryDataFn={async (readOption) => { }}
              />
            </div>
          )
        }
      </ReactGridLayout>
    )
  }

  const currModule = moduleList.find((mol => mol.id === currIndex))?.module
  return (
    <div className="App">

      <Button onClick={() => setEditable(false)} >{"Complete"}</Button>
      <Button onClick={() => setEditable(true)} >Edit</Button>
      <DynamicHeader
        items={items}
        editable={editable}
        setItems={setItems}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onLayoutChange={onLayoutChange}
        onAddModule={onAddModule}
        onSwitch={onSwitch} />
      <div>
        {"on tab: " + currIndex}
        {currModule || <Skeleton />}

      </div>

    </div>
  );
}

