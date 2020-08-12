/**
 * Created by Jacob Xie on 8/12/2020.
 */

// eslint-disable-next-line max-classes-per-file
import _ from 'lodash';


export interface IStorageItem {
  key: string
  value: any
}

export class StorageItem {

  key: string

  value: any

  constructor(data: IStorageItem) {
    this.key = data.key;
    this.value = data.value;
  }
}

/**
 * class for working with local storage in browser
 */
export class LocalStorageWorker {

  identifier: string;

  splitter: string;

  localStorageSupported: boolean;

  constructor(identifier: string, splitter: string = "::") {
    this.identifier = identifier;
    this.splitter = splitter;
    this.localStorageSupported = typeof window.localStorage !== 'undefined' && window.localStorage !== null;
  }

  private keyWrapping = (key: string): string =>
    `${ this.identifier }${ this.splitter }${ key }`

  private keyExtractHead = (key: string): null | string => {
    const regH = new RegExp(`^(.*?)${ this.splitter }`).exec(key)

    return regH === null ? null : regH[1]
  }

  private keyExtractTail = (key: string): null | string => {
    const regT = new RegExp(`${ this.splitter }(.*)$`).exec(key)

    return regT === null ? null : regT[1]
  }

  /**
   * add value to storage
   */
  add = (key: string, item: string): void => {
    if (this.localStorageSupported)
      localStorage.setItem(this.keyWrapping(key), item)
  }

  /**
   * get all values from storage (all items)
   */
  getAllItems = (): StorageItem[] => {
    const list: StorageItem[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const value = localStorage.getItem(key);
      list.push(new StorageItem({ key, value }))
    })

    return list;
  }

  getAllItemsByIdentifier = (): StorageItem[] => {
    const list: StorageItem[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const keyH = this.keyExtractHead(key);
      const keyT = this.keyExtractTail(key);
      if (keyH === this.identifier && keyT !== null) {
        const value = localStorage.getItem(key);
        list.push(new StorageItem({ key: keyT, value }))
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
  getAllValues = (): any[] => {
    const list: any[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const value = localStorage.getItem(key);
      list.push(value);
    })

    return list;
  }

  /**
   * get all values by identifier
   */
  getAllValuesByIdentifier = (): any[] => {
    const list: any[] = [];

    _.range(localStorage.length).forEach(i => {
      const key = localStorage.key(i)!;
      const keyH = this.keyExtractHead(key);
      if (keyH === this.identifier) {
        const value = localStorage.getItem(key);
        list.push(value);
      }
    })

    return list
  }

  /**
   * get one item by key from storage
   */
  get = (key: string, withIdentifier: boolean = true): string | null => {
    if (this.localStorageSupported) {
      if (withIdentifier)
        return localStorage.getItem(this.keyWrapping(key));
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * remove value from storage
   */
  remove = (key: string, withIdentifier: boolean = true): void => {
    if (this.localStorageSupported)
      if (withIdentifier)
        localStorage.removeItem(this.keyWrapping(key));
      else
        localStorage.removeItem(key);
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
          if (keyH === this.identifier) this.remove(key);
        })
      } else
        localStorage.clear();
    }
  }


}
