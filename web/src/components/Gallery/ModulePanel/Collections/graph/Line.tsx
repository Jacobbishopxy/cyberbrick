/**
 * Created by Jacob Xie on 10/16/2020.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./utils/Common"
import {generateCommonOption} from "./utils/chartGenerators"


const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateCommonOption("line"))

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()

