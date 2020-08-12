/**
 * Created by Jacob Xie on 8/12/2020.
 */

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export interface JSONArray extends Array<JSONValue> {}
export type JSONType = JSONObject | JSONArray;
