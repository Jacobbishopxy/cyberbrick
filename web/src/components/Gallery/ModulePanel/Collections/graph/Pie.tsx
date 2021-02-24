/**
 * Created by Jacob Xie on 2/24/2021.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./utils/Common"
import {generatePieOption} from "./utils/chartGenerators"

// todo: `generateCommonEditorField` needs new display setting interface for pie chart
const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generatePieOption())

export const Pie = new ModuleGenerator(EditorField, PresenterField).generate()

