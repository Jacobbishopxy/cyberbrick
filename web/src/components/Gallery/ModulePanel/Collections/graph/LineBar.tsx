/**
 * Created by Jacob Xie on 10/20/2020.
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./utils/Common"
import {generateCommonOption} from "./utils/chartGenerators"

const EditorField = generateCommonEditorField("lineBar")
const PresenterField = generateCommonPresenterField(generateCommonOption("lineBar"))

export const LineBar = new ModuleGenerator(EditorField, PresenterField).generate()
