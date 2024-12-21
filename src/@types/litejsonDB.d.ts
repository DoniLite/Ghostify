declare module 'litejsondb' {
  interface Options {
    encrypt?: boolean;
  }

  type StoreKey = string | number | symbol;

  export type StoreData<T> = T extends Array<infer U>
    ? Array<U>
    : T extends object
    ? Record<StoreKey, T[keyof T]>
    : T;

  /**
   * # litejsondb
   * **LiteJsonDB** is a lightweight local JSON database for Node.js, designed to simplify JSON data management in your projects.
   * - easy to use
   * - simple and lite
   * - many functionalities
   * - performance
   * ## usage :
   *
   * ### create an instance of the class
   *
   * ```javascript
   *    const litejsondb = require('litejsondb');
   *    const db = new litejsondb();
   *    // or you can use
   *    import JsonDB from 'litejsondb';
   *    const db = new JsonDB();
   * ```
   *
   * ### add data to your database
   *
   * ```javascript
   *    db.setData('users/1', { name: 'Aliou', age: 30 });
   *    db.setData('products/1', { name: 'Laptop', price: 999.99 });
   * ```
   *
   * ### edit your data
   *
   * ```javascript
   *    db.editData('users/1', { age: 31 });
   * ```
   *
   * ### get your data
   *
   * ```javascript
   *    console.log('User 1:', db.getData('users/1'));
   *    console.log('Product 1:', db.getData('products/1'));
   * ```
   * Check the [docs](https://github.com/codingtuto/LiteJsonDB-Node) for more information
   */
  class JsonDB {
    constructor(filename?: string, options?: Options);
    /**
     * Verify that the the provided key exist in the database
     *
     * @param key The to check
     */
    keyExists<T extends StoreKey>(key: T): boolean;
    /**
     * Retrieves a data object from the database
     *
     * @param key The key used to retrieve data
     */
    getData<T extends StoreKey>(key: T): StoreData<Record<StoreKey, unknown>>;
    /**
     * Store data to your database
     *
     * @param key The key to use to retrieve the data from the database
     * @param value The object to store in the database
     */
    setData<T extends StoreKey, K>(key: T, value?: StoreData<K>): void;
    /**
     * Edit a stored data in the database
     *
     * @param key The key of the value to edit
     * @param value the value to store in the database
     */
    editData<T extends StoreKey, K>(key: T, value: StoreData<K>): void;
    /**
     * Setup a subcollection from the main collection data
     *
     * @param parentKey The parent key
     * @param subcollectionKey The sub collection key
     * @param subcollectionData The sub collection data
     */
    setSubcollection<T extends StoreKey, K extends StoreKey, P>(
      parentKey: T,
      subcollectionKey: K,
      subcollectionData: StoreData<P>
    ): void;
    /**
     * Edit a  subcollection data
     *
     * @param parentKey The key of the parent collection
     * @param subcollectionKey The key of the sub collection
     * @param subcollectionData The data to store in the sub collection
     */
    editSubcollection<T extends StoreKey, K extends StoreKey, P>(
      parentKey: T,
      subcollectionKey: K,
      subcollectionData: StoreData<P>
    ): void;
    /**
     * retrieve a sub-collection from the main collection
     *
     * @param parentKey The parent key
     * @param subcollectionKey The sub collection key
     */
    getSubcollection<T extends StoreKey, K extends StoreKey>(
      parentKey: T,
      subcollectionKey: K
    ): StoreData<Record<StoreKey, unknown>>;
    /**
     * delete a sub-collection from the main collection
     *
     * @param parentKey The parent key
     * @param subcollectionKey The sub collection key
     */
    deleteSubcollection<T extends StoreKey, K extends StoreKey>(
      parentKey: T,
      subcollectionKey: K
    ): void;
    /**
     * display the data present in the database
     */
    showDb(): StoreData<Record<StoreKey, unknown>>;
    /**
     * Backup your database
     *
     * @param backupFile the backup file name
     */
    backupDb(backupFile: string): void;
    /**
     * Restore the database from the backup file.
     *
     * @param backupFile the backup file name to restore
     */
    restoreDb(backupFile: string): void;
    /**
     * Add a regular expression to validate data
     *
     * @param key the key used to retrieve the regular expression in the database
     * @param regexPattern teh regular expression
     */
    setRegex(key: StoreKey, regexPattern: RegExp): void;
    /**
     * validate the provided data with the corresponding regular expression
     *
     * @param data the data structure to validate
     */
    validateData<T>(data: StoreData<T>): boolean;
    /**
     * Return an object **Datetime** of the corresponding value the key provided
     *
     * @param key key corresponding to a value present in the database
     */
    convertToDateTime(key: StoreKey): string | null;
    /**
     * return a flatter structure of the object corresponding to the key provided in the database
     *
     * @param key the key of the object
     */
    flattenJson(key: StoreKey): Object | null;
    /**
     * returns a **hash** of the provided password.
     *
     * @param password the password to be used for authentication
     */
    hashPassword: (password: unknown) => string;
    /**
     * check that the **password** provided matches the **hashed password**
     *
     * @param storedHash The stored hash to check
     *
     * @param password the password to be used for authentication
     */
    checkPassword: (storedHash: string, password: string) => boolean;
    /**
     * tries to find the element corresponding to the **key** or adds it if it is not present and returns it
     *
     * @param data The data to used for the operation
     *
     * @param key The key of the element to search for
     *
     * @param defaultValue The default value to return if the element is not found
     */
    getOrDefault: <T, K extends StoreKey, P>(
      data: StoreData<T>,
      key: K,
      defaultValue?: P
    ) => P extends keyof undefined ? StoreData<T> | StoreData<P> : StoreData<T>;
    /**
     * checks that the key is present in the database and adds it if not
     *
     * @param data The data to used for the operation
     *
     * @param key The key of the element to search for
     *
     * @param defaultValue The default value to return if the element is not found
     */
    keyExistsOrAdd: <T, K extends StoreKey, P>(
      data: StoreData<T>,
      key: K,
      defaultValue: P
    ) => boolean;
    /**
     * Recursively searches a **value** stored into the corresponding field of the **key** in the **data** structure
     *
     * If no field is found in the corresponding data[key] object a message is shown else if the corresponding data is returned.
     */
    searchData: <T, K, P extends StoreKey>(
      data: StoreData<T>,
      searchValue: K,
      key: P
    ) => StoreData<T>;
    /**
     * Used to convert a data object into **JSON** format
     */
    sanitizeOutput: <T>(data: StoreData<T>) => string;
    /**
     * Used to print the data to console with a pretty `json` style
     *
     *
     * ```javascript
     *  import JsonDB from 'litejsondb';
     *  const db = new JsonDB();
     *  db.prettyPrint({ data: 'hello' });
     *  // {
     *  //    "data": "hello"
     *  //  }
     * ```
     *
     * @param data the data to print to the console
     */
    prettyPrint: <T>(data: StoreData<T>) => void;
  }

  export default JsonDB;
}
