/**
 * Created by Jacob Xie on 1/20/2021
 */

import {request} from "umi"


export const getManualImage = async (name: string) =>
  request(`/api/manual/getManualImage?name=${name}`)
