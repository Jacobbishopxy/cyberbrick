/**
 * Created by Jacob Xie on 9/9/2020.
 */

import request from "umi-request"

const base = "/api/kChart"

export const getAllTickers = async (): Promise<string[]> =>
  request(`${ base }/tickers`)

export const getRkx = async (ticker: string): Promise<any[]> =>
  request(`${ base }/rkx?ticker=${ ticker }`)
