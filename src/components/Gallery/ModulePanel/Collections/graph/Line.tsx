/**
 * Created by Jacob Xie on 10/16/2020.
 */


import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { generateCommonEditorField, generateCommonPresenterField } from "./Common"
import { generateChartOption } from "./chartUtils"


const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateChartOption("line"))

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()

