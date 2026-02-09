import { db } from './firebaseConfig';
import { doc, increment, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Tracks event registration statistics in Firestore
 */
class RegistrationTracker {
  constructor() {
    this.countersCollection = 'eventRegistrationCounters';
    this.individualCountersCollection = 'individualEventCounters';
    this.cbitNonCbitCollection = 'cbitNonCbitCounters';
  }

  /**
   * Updates the total count of all event registrations
   */
  async updateTotalCount() {
    try {
      const counterDocRef = doc(db, this.countersCollection, 'totalRegistrations');
      
      // Get current count
      const counterDoc = await getDoc(counterDocRef);
      let currentCount = 0;
      
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().count || 0;
      }
      
      // Update the count
      await setDoc(counterDocRef, {
        count: currentCount + 1,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      return currentCount + 1;
    } catch (error) {
      console.error('Error updating total registration count:', error);
      throw error;
    }
  }

  /**
   * Updates the count for a specific event
   */
  async updateEventCount(eventName) {
    try {
      const eventCounterDocRef = doc(db, this.individualCountersCollection, eventName.toLowerCase());
      
      // Get current count
      const counterDoc = await getDoc(eventCounterDocRef);
      let currentCount = 0;
      
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().count || 0;
      }
      
      // Update the count
      await setDoc(eventCounterDocRef, {
        count: currentCount + 1,
        eventName: eventName,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      return currentCount + 1;
    } catch (error) {
      console.error(`Error updating ${eventName} registration count:`, error);
      throw error;
    }
  }

  /**
   * Updates CBIT vs Non-CBIT registration counts
   */
  async updateCbitNonCbitCount(collegeName) {
    try {
      const isCbit = collegeName.toLowerCase().includes('cbit') || 
                     collegeName.toLowerCase().includes('chaitanya bharathi institute of technology') ||
                     collegeName.toLowerCase().includes('chaitanya bharathi');
      
      const counterType = isCbit ? 'cbit' : 'nonCbit';
      const counterDocRef = doc(db, this.cbitNonCbitCollection, counterType);
      
      // Get current count
      const counterDoc = await getDoc(counterDocRef);
      let currentCount = 0;
      
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().count || 0;
      }
      
      // Update the count
      await setDoc(counterDocRef, {
        count: currentCount + 1,
        category: counterType,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      return {
        type: counterType,
        count: currentCount + 1
      };
    } catch (error) {
      console.error('Error updating CBIT/Non-CBIT registration count:', error);
      throw error;
    }
  }

  /**
   * Updates all counters for a registration
   */
  async trackRegistration(eventName, collegeName) {
    try {
      // Update all counters in parallel
      const [totalCount, eventCount, cbitNonCbitResult] = await Promise.all([
        this.updateTotalCount(),
        this.updateEventCount(eventName),
        this.updateCbitNonCbitCount(collegeName)
      ]);

      return {
        totalCount,
        eventCount,
        cbitNonCbitResult
      };
    } catch (error) {
      console.error('Error tracking registration:', error);
      throw error;
    }
  }

  /**
   * Gets the total registration count
   */
  async getTotalCount() {
    try {
      const counterDocRef = doc(db, this.countersCollection, 'totalRegistrations');
      const counterDoc = await getDoc(counterDocRef);
      
      if (counterDoc.exists()) {
        return counterDoc.data().count || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting total registration count:', error);
      throw error;
    }
  }

  /**
   * Gets the count for a specific event
   */
  async getEventCount(eventName) {
    try {
      const eventCounterDocRef = doc(db, this.individualCountersCollection, eventName.toLowerCase());
      const counterDoc = await getDoc(eventCounterDocRef);
      
      if (counterDoc.exists()) {
        return counterDoc.data().count || 0;
      }
      return 0;
    } catch (error) {
      console.error(`Error getting ${eventName} registration count:`, error);
      throw error;
    }
  }

  /**
   * Gets CBIT vs Non-CBIT registration counts
   */
  async getCbitNonCbitCounts() {
    try {
      const [cbitDoc, nonCbitDoc] = await Promise.all([
        getDoc(doc(db, this.cbitNonCbitCollection, 'cbit')),
        getDoc(doc(db, this.cbitNonCbitCollection, 'nonCbit'))
      ]);
      
      return {
        cbit: cbitDoc.exists() ? cbitDoc.data().count || 0 : 0,
        nonCbit: nonCbitDoc.exists() ? nonCbitDoc.data().count || 0 : 0
      };
    } catch (error) {
      console.error('Error getting CBIT/Non-CBIT registration counts:', error);
      throw error;
    }
  }

  /**
   * Gets all registration statistics
   */
  async getAllStats() {
    try {
      const [totalCount, cbitNonCbitCounts] = await Promise.all([
        this.getTotalCount(),
        this.getCbitNonCbitCounts()
      ]);

      // Get individual event counts
      const eventNames = ['gitarcana', 'decipher', 'odyssey'];
      const eventCounts = {};
      
      for (const eventName of eventNames) {
        eventCounts[eventName] = await this.getEventCount(eventName);
      }

      return {
        totalRegistrations: totalCount,
        cbitRegistrations: cbitNonCbitCounts.cbit,
        nonCbitRegistrations: cbitNonCbitCounts.nonCbit,
        eventRegistrations: eventCounts
      };
    } catch (error) {
      console.error('Error getting all registration stats:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const registrationTracker = new RegistrationTracker();
export default registrationTracker;