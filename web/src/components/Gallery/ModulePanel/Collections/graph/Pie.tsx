/**
 * Created by Jacob Xie on 2/24/2021.
 */


import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./common/Common"
import {generatePieOption} from "../../../Utils/chartGenerators"
import {ChartOptionGenerator} from "@/components/Gallery/Utils/data"

const EditorField = generateCommonEditorField("pie")
const PresenterField = generateCommonPresenterField(generatePieOption() as ChartOptionGenerator)

export const Pie = new ModuleGenerator(EditorField, PresenterField).generate()

