import './NestedModule.css';
import DynamicHeader from './DynamicHeader';
import { useEffect, useRef, useState } from 'react';
import { ContentWithId, Module, tabItem } from './data';
import { Button, Skeleton } from 'antd';
import { Content, ElementType } from '@/components/Gallery/GalleryDataType';
import { ModuleTabPane, ModuleTabPaneRef } from './createModule';
import { ContainerElementRef } from '@/components/Gallery/Dashboard/DashboardContainer/TemplateElement';

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


export default () => {
  const [moduleList, setModuleList] = useState<Module[]>([])
  const setLayout = useState<ReactGridLayout.Layout[]>([])[1]
  const [currIndex, setCurrIndex] = useState("0")
  const [items, setItems] = useState(defaultItems)
  const [newCounter, setNewCounter] = useState(0)
  const [editable, setEditable] = useState(false)
  const setTabPaneLayout = useState<ReactGridLayout.Layout[]>([])[1]
  const [content, setContentList] = useState<ContentWithId[]>([])

  const ref = useRef<ModuleTabPaneRef>(null)
  const startFetchAllContents = () => {
    console.log("in index, start fetch")
    const rf = ref.current
    if (rf) rf.startFetchAllContents()

  }
  useEffect(() => {
    // effect
    // console.log(items)
    onLayoutChange(items)
  }, [items])

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
    let content = { date: `${new Date()}`, data: { text: name, content: name } }
    //replace existing module
    if (moduleList.find(mod => mod.id === tabId)) {
      console.log("removing old module...")
      //delete old module content
      onRemoveModule(tabId)
    }
    // add new element
    let newEle =
      <ModuleTabPane
        name={name}
        timeSeries={timeSeries}
        elementType={moduleType}
        tabId={tabId}
        content={content}
        editable={editable}
        onRemoveModule={onRemoveModule}
        setLayout={setTabPaneLayout}
        ref={ref}
      />
    let newModule: Module = { id: tabId, module: newEle! }
    setModuleList(ml => ml.concat(newModule))
    let newContent: ContentWithId = { id: tabId, content: content }
    setContentList(ct => ct.concat(newContent))
    startFetchAllContents()
    // setCurrModule(newEle)

  }
  const onRemoveModule = (id: string) => {
    setModuleList(moduleList.filter(mod => mod.id !== id))
  }
  //get curr module tab pane
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

