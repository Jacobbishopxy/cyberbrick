/**
 * Created by Jacob Xie on 10/19/2020.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./utils/Common"
import {generateCommonOption} from "./utils/chartGenerators"

const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateCommonOption("bar"))

export const Bar = new ModuleGenerator(EditorField, PresenterField).generate()

