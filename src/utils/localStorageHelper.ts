/**
 * Created by Jacob Xie on 8/12/2020.
 */

import _ from 'lodash';
import * as moment from 'moment';

export interface StorageValue {
  data: Object,
  expiry?: moment.Moment
}

export interface StorageItem {
  key: string
  value: StorageValue
}

export type ExpiryType = [moment.DurationInputArg1, moment.DurationInputArg2] | undefined

export interface LocalStorageHelperOptions {
  splitter?: string
  expiry?: ExpiryType
}

const LocalStorageHelperOptionsDefaults: LocalStorageHelperOptions = {
  splitter: "::",
  expiry: undefined,
}

/**
 * class for working with local storage in browser
 */
export class LocalStorageHelper {

  identifier: string;

  options: LocalStorageHelperOptions

  localStorageSupported: boolean;

  constructor(identifier: string,
              options: LocalStorageHelperOptions) {
    this.identifier = identifier;
    this.options = { ...LocalStorageHelperOptionsDefaults, ...options };
    this.localStorageSupported = typeof window.localStorage !== 'undefined' && window.localStorage !== null;
  }

  private keyWrapping = (key: string): string =>
    `${ this.identifier }${ this.options.splitter }${ key }`

  private keyExtractHead = (key: string): null | string => {
    const regH = new RegExp(`^(.*?)${ this.options.splitter }`).exec(key)
    return regH === null ? null : regH[1]
  }

  private keyExtractTail = (key: string): null | string => {
    const regT = new RegExp(`${ this.options.splitter }(.*)$`).exec(key)
    return regT === null ? null : regT[1]
  }

  private valueWrapping = (value: string): string => {
    const e = this.options.expiry;
    let expiry: moment.Moment | undefined;
    if (e !== undefined)
      expiry = moment().add(e[0], e[1])
    else
      expiry = undefined

    return JSON.stringify({
      data: value,
      expiry
    })
  }

  private valueUnwrapping = (value: string): StorageValue =>
    JSON.parse(value)

  private itemRemoveIfExpired = (key: string, withIdentifier: boolean = true): StorageItem | null => {
    let keyW: string;
    if (withIdentifier)
      keyW = this.keyWrapping(key)
    else
      keyW = key;

    const valueStr = localStorage.getItem(keyW);
    if (valueStr !== null) {
      const value = this.valueUnwrapping(valueStr);
      if (value.expiry !== undefined && moment().isAfter(moment(value.expiry))) {
        localStorage.removeItem(keyW);
        return null;
      }
      return { key: keyW, value }
    }
    return null;
  }


  /**
   * add value to storage
   */
  add = (key: string, item: string): void => {
    if (this.localStorageSupported)
      localStorage.setItem(this.keyWrapping(key), this.valueWrapping(item))
  }

  /**
   * get all values from storage (all items)
   */
  getAllItems = (): StorageItem[] => {
    const list: StorageItem[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const valueStr = localStorage.getItem(key)!;
      const value = this.valueUnwrapping(valueStr)
      const item: StorageItem = { key, value }
      list.push(item)
    })

    return list;
  }

  /**
   * get all items by identifier
   */
  getAllItemsByIdentifier = (): StorageItem[] => {
    const list: StorageItem[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const keyH = this.keyExtractHead(key);
      const keyT = this.keyExtractTail(key);
      if (keyH === this.identifier && keyT !== null) {
        const valueStr = localStorage.getItem(key)!;
        const value = this.valueUnwrapping(valueStr)
        const item: StorageItem = { key: keyT, value }
        list.push(item)
      }
    })

    return list;
  }

  /**
   * get all keys from storage
   */
  getAllKeys = (): string[] => {
    const list: string[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!
      list.push(key)
    })

    return _.uniq(list)
  }

  /**
   * get all identifiers
   */
  getAllIdentifiers = (): string[] => {
    const list: string[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!
      const keyH = this.keyExtractHead(key);
      if (keyH !== null) list.push(keyH)
    })

    return _.uniq(list)
  }

  /**
   * get all keys without identifier showed
   */
  getAllKeysByIdentifier = (): string[] => {
    const list: string[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!
      const keyH = this.keyExtractHead(key);
      const keyT = this.keyExtractTail(key);
      if (keyH === this.identifier && keyT !== null) list.push(keyT);
    })

    return list;
  }

  /**
   * get only all values localStorage
   */
  getAllValues = (): StorageValue[] => {
    const list: StorageValue[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const value = localStorage.getItem(key)!;
      list.push(this.valueUnwrapping(value));
    })

    return list;
  }

  /**
   * get all values by identifier
   */
  getAllValuesByIdentifier = (): StorageValue[] => {
    const list: StorageValue[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const keyH = this.keyExtractHead(key);
      if (keyH === this.identifier) {
        const value = localStorage.getItem(key)!;
        list.push(this.valueUnwrapping(value));
      }
    })

    return list
  }

  /**
   * get one item by key from storage
   */
  get = (key: string, withIdentifier: boolean = true): StorageValue | null => {
    if (this.localStorageSupported) {
      const value = this.itemRemoveIfExpired(key, withIdentifier)
      if (value === null)
        return null;
      return value.value;
    }
    return null;
  }

  /**
   * remove value from storage
   */
  remove = (key: string, withIdentifier: boolean = true): void => {
    if (this.localStorageSupported) {
      if (withIdentifier)
        localStorage.removeItem(this.keyWrapping(key));
      else
        localStorage.removeItem(key);
    }
  }

  /**
   * clear storage (remove all items from it)
   */
  clear = (withIdentifier: boolean = true): void => {
    if (this.localStorageSupported) {
      if (withIdentifier) {
        _.range(localStorage.length).forEach(i => {
          const key = localStorage.key(i)!;
          const keyH = this.keyExtractHead(key);
          if (keyH === this.identifier) localStorage.removeItem(key);
        })
      } else
        localStorage.clear();
    }
  }
}
