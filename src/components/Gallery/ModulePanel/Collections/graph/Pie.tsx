/**
 * Created by Jacob Xie on 10/19/2020.
 */


import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { generateCommonEditorField, generateCommonPresenterField } from "./Common"
import { generatePieOption } from "./chartUtils"

const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generatePieOption())

export const Pie = new ModuleGenerator(EditorField, PresenterField).generate()

