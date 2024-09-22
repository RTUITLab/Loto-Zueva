// Обновим метод openDB
export const openDB = (dbName: string, version: number): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Создание object store с автоинкрементом 'id'
      if (!db.objectStoreNames.contains('columns')) {
        db.createObjectStore('columns', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('rows')) {
        db.createObjectStore('rows', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('map')) {
        db.createObjectStore('map', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('tickets')) {
        db.createObjectStore('tickets', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('quantity')) {
        db.createObjectStore('quantity', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(`Error opening database: ${request.error?.message}`);
    };
  });
};

export const addData = (db: IDBDatabase, storeName: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(`Error adding data: ${request.error?.message}`);
    };
  });
};

export const getData = (db: IDBDatabase, storeName: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const getAllRequest = store.getAll(); // Получаем все записи из object store

    getAllRequest.onsuccess = () => {
      resolve(getAllRequest.result); // Возвращаем результат запроса (массив записей)
    };

    getAllRequest.onerror = () => {
      reject(`Error fetching data from store '${storeName}': ${getAllRequest.error?.message}`);
    };
  });
};

export const clearStore = (db: IDBDatabase, storeName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(`Error clearing store: ${request.error?.message}`);
    };
  });
};

// Заменяем данные в object store
export const replaceData = (db: IDBDatabase, storeName: string, data: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // Очищаем старые данные
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      // Добавляем новые данные после очистки
      data.forEach((item) => {
        // Если автоинкремент используется, не нужно явно добавлять id
        const addRequest = store.add(item);

        addRequest.onerror = () => {
          console.error(`Error adding item to store '${storeName}': ${addRequest.error}`);
        };
      });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(`Error replacing data in store '${storeName}': ${transaction.error?.message}`);
      };
    };

    clearRequest.onerror = () => {
      reject(`Error clearing store '${storeName}': ${clearRequest.error?.message}`);
    };
  });
};
