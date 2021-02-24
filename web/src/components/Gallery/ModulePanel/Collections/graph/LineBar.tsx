/**
 * Created by Jacob Xie on 10/20/2020.
 */

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {generateCommonEditorField, generateCommonPresenterField} from "./common/Common"
import {generateCommonOption} from "../../../Utils/chartGenerators"
import {ChartOptionGenerator} from "@/components/Gallery/Utils/data"


const EditorField = generateCommonEditorField("lineBar")
const PresenterField = generateCommonPresenterField(generateCommonOption("lineBar") as ChartOptionGenerator)

export const LineBar = new ModuleGenerator(EditorField, PresenterField).generate()
