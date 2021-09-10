/**
 * Created by Jacob Xie on 10/19/2020.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./common/Common"
import {generateCommonOption} from "../../../Utils/chartGenerators"
import {ChartOptionGenerator} from "@/components/Gallery/Utils/data"


const EditorField = generateCommonEditorField()
const PresenterField = generateCommonPresenterField(generateCommonOption("bar") as ChartOptionGenerator)

export const Bar = new ModuleGenerator(EditorField, PresenterField).generate()

