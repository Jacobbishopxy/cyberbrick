/**
 * Created by Jacob Xie on 1/25/2021
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./common/Common"
import {generateCommonOption} from "../../../Utils/chartGenerators"
import {ChartOptionGenerator} from "@/components/Gallery/Utils/data"


const EditorField = generateCommonEditorField("lineScatter")
const PresenterField = generateCommonPresenterField(generateCommonOption("lineScatter") as ChartOptionGenerator)

export const LineScatter = new ModuleGenerator(EditorField, PresenterField).generate()


