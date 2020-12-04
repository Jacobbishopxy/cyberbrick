/**
 * Created by Jacob Xie on 10/19/2020.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./Common"
import {generateLineBarOption} from "./chartGenerators"

const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateLineBarOption("bar"))

export const Bar = new ModuleGenerator(EditorField, PresenterField).generate()

