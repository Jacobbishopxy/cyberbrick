/**
 * Created by Jacob Xie on 1/22/2021
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./utils/Common"
import {generateCommonOption} from "./utils/chartGenerators"

const EditorField = generateCommonEditorField("scatter")
const PresenterField = generateCommonPresenterField(generateCommonOption("scatter"))

export const Scatter = new ModuleGenerator(EditorField, PresenterField).generate()

