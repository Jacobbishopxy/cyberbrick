/**
 * Created by Jacob Xie on 10/16/2020.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./common/Common"
import {generateCommonOption} from "../../../Utils/chartGenerators"
import {ChartOptionGenerator} from "@/components/Gallery/Utils/data"


const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateCommonOption("line") as ChartOptionGenerator)

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()

