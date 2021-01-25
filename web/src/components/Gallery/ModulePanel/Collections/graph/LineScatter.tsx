/**
 * Created by Jacob Xie on 1/25/2021
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./utils/Common"
import {generateCommonOption} from "./utils/chartGenerators"

const EditorField = generateCommonEditorField("lineScatter")
const PresenterField = generateCommonPresenterField(generateCommonOption("lineScatter"))

export const LineScatter = new ModuleGenerator(EditorField, PresenterField).generate()


