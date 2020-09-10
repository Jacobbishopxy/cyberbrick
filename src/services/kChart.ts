/**
 * Created by Jacob Xie on 9/9/2020.
 */

import request from "umi-request"

const base = "/api/kChart"

export const getAllTickers = async (): Promise<string[]> =>
  request(`${ base }/tickers`)

export const getRkx = async (ticker: string): Promise<any[]> =>
  request(`${ base }/rkx?ticker=${ ticker }`)

export const getBi = async (ticker: string): Promise<any[]> =>
  request(`${ base }/bi?ticker=${ ticker }`)

export const getDn = async (ticker: string): Promise<any[]> =>
  request(`${ base }/dn?ticker=${ ticker }`)


