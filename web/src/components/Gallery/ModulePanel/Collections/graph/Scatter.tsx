/**
 * Created by Jacob Xie on 1/22/2021
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./common/Common"
import {generateCommonOption} from "../../../Utils/chartGenerators"
import {ChartOptionGenerator} from "@/components/Gallery/Utils/data"


const EditorField = generateCommonEditorField("scatter")
const PresenterField = generateCommonPresenterField(generateCommonOption("scatter") as ChartOptionGenerator)

export const Scatter = new ModuleGenerator(EditorField, PresenterField).generate()

