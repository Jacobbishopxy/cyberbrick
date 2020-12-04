/**
 * Created by Jacob Xie on 10/16/2020.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./Common"
import {generateLineBarOption} from "./chartGenerators"


const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateLineBarOption("line"))

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()

