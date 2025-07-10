/**
 * Manages offline report submission functionality
 */
export class OfflineReportManager {

  /**
   * Initializes the offline database and sync manager
   */
  static async initialize() {
    await this.setupDatabase();
    await this.initializeSyncManager();
  }

  /**
   * Sets up the IndexedDB database
   * @private
   */
  static async setupDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      };
    });
  }

  /**
   * Initializes the background sync manager
   * @private
   */
  static async initializeSyncManager() {
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        await registration.sync.register('sync-reports');
      } catch (error) {
        console.error('Failed to initialize sync manager:', error);
      }
    }
  }

  /**
   * Queues a report for later submission when offline
   * @param {ReportData} reportData - The report data to queue
   * @returns {Promise<string>} Temporary report ID
   */
  static async queueReport(reportData) {
    const db = await this.openDatabase();
    const tempId = `temp_${Date.now()}`;

    const transaction = db.transaction(this.STORE_NAME, 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    await new Promise((resolve, reject) => {
      const request = store.add({
        id: tempId,
        data: reportData,
        status: 'pending',
        createdAt: new Date(),
        retryCount: 0
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Trigger background sync if possible
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-reports');
    }

    return tempId;
  }

  /**
   * Gets all pending reports
   * @returns {Promise<Array>} Array of pending reports
   */
  static async getPendingReports() {
    const db = await this.openDatabase();
    const transaction = db.transaction(this.STORE_NAME, 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Removes a report from the offline queue
   * @param {string} reportId - ID of the report to remove
   */
  static async removeReport(reportId) {
    const db = await this.openDatabase();
    const transaction = db.transaction(this.STORE_NAME, 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(reportId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Opens a connection to the IndexedDB database
   * @private
   */
  static async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
} 
OfflineReportManager.DB_NAME = 'safepin_offline';
OfflineReportManager.STORE_NAME = 'pending_reports';
OfflineReportManager.DB_VERSION = 1;