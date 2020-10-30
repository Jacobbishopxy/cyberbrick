/**
 * Created by Jacob Xie on 10/20/2020.
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./Common"
import {generateLineBarOption} from "./chartUtils"

const EditorField = generateCommonEditorField(true)
const PresenterField = generateCommonPresenterField(generateLineBarOption())

export const LineBar = new ModuleGenerator(EditorField, PresenterField).generate()
