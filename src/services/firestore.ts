import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TourLeader, Tour, Expert, Booking, Review, User } from '../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  TOUR_LEADERS: 'tourLeaders',
  TOURS: 'tours',
  EXPERTS: 'experts',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  CONSULTATIONS: 'consultations',
  MESSAGES: 'messages',
} as const;

// User operations
export const userService = {
  async createUser(userId: string, userData: Partial<User>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async getUser(userId: string) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } as User : null;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },
};

// Tour Leader operations
export const tourLeaderService = {
  async getAllTourLeaders() {
    const q = query(collection(db, COLLECTIONS.TOUR_LEADERS));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourLeader));
  },

  async getTourLeader(id: string) {
    const docRef = doc(db, COLLECTIONS.TOUR_LEADERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as TourLeader : null;
  },

  async searchTourLeaders(filters: {
    location?: string;
    specialty?: string;
    minRating?: number;
    maxPrice?: number;
    languages?: string[];
  }) {
    const constraints: QueryConstraint[] = [];
    
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.specialty) {
      constraints.push(where('specialties', 'array-contains', filters.specialty));
    }
    if (filters.minRating) {
      constraints.push(where('rating', '>=', filters.minRating));
    }
    if (filters.maxPrice) {
      constraints.push(where('pricePerDay', '<=', filters.maxPrice));
    }
    if (filters.languages && filters.languages.length > 0) {
      constraints.push(where('languages', 'array-contains-any', filters.languages));
    }

    const q = query(collection(db, COLLECTIONS.TOUR_LEADERS), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourLeader));
  },

  async createTourLeader(data: Omit<TourLeader, 'id'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.TOUR_LEADERS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateTourLeader(id: string, updates: Partial<TourLeader>) {
    const docRef = doc(db, COLLECTIONS.TOUR_LEADERS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },
};

// Tour operations
export const tourService = {
  async getAllTours() {
    const q = query(collection(db, COLLECTIONS.TOURS), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  },

  async getTour(id: string) {
    const docRef = doc(db, COLLECTIONS.TOURS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Tour : null;
  },

  async getToursByLeader(leaderId: string) {
    const q = query(
      collection(db, COLLECTIONS.TOURS),
      where('leaderId', '==', leaderId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  },

  async searchTours(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    duration?: number;
    startDate?: Date;
  }) {
    const constraints: QueryConstraint[] = [];
    
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.minPrice) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }
    if (filters.duration) {
      constraints.push(where('duration', '==', filters.duration));
    }
    if (filters.startDate) {
      constraints.push(where('startDate', '>=', Timestamp.fromDate(filters.startDate)));
    }

    const q = query(collection(db, COLLECTIONS.TOURS), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  },

  async createTour(data: Omit<Tour, 'id'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.TOURS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateTour(id: string, updates: Partial<Tour>) {
    const docRef = doc(db, COLLECTIONS.TOURS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteTour(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.TOURS, id));
  },
};

// Expert operations
export const expertService = {
  async getAllExperts() {
    const q = query(collection(db, COLLECTIONS.EXPERTS));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expert));
  },

  async getExpert(id: string) {
    const docRef = doc(db, COLLECTIONS.EXPERTS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Expert : null;
  },

  async searchExperts(filters: {
    expertise?: string;
    location?: string;
    minRating?: number;
  }) {
    const constraints: QueryConstraint[] = [];
    
    if (filters.expertise) {
      constraints.push(where('expertise', 'array-contains', filters.expertise));
    }
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.minRating) {
      constraints.push(where('rating', '>=', filters.minRating));
    }

    const q = query(collection(db, COLLECTIONS.EXPERTS), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expert));
  },
};

// Booking operations
export const bookingService = {
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getBooking(id: string) {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Booking : null;
  },

  async getUserBookings(userId: string) {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  },

  async updateBookingStatus(id: string, status: Booking['status']) {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async cancelBooking(id: string) {
    await this.updateBookingStatus(id, 'cancelled');
  },
};

// Review operations
export const reviewService = {
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
      ...reviewData,
      createdAt: serverTimestamp(),
      helpful: 0,
    });
    return docRef.id;
  },

  async getReviewsForTourLeader(tourLeaderId: string) {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('tourLeaderId', '==', tourLeaderId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  },

  async getReviewsForTour(tourId: string) {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('tourId', '==', tourId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  },

  async markReviewHelpful(reviewId: string) {
    const docRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentHelpful = docSnap.data().helpful || 0;
      await updateDoc(docRef, {
        helpful: currentHelpful + 1,
      });
    }
  },
};

// Consultation operations
export const consultationService = {
  async scheduleConsultation(data: {
    userId: string;
    tourLeaderId?: string;
    expertId?: string;
    date: Date;
    time: string;
    duration: number;
    topic: string;
    notes?: string;
  }) {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONSULTATIONS), {
      ...data,
      date: Timestamp.fromDate(data.date),
      status: 'scheduled',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getUserConsultations(userId: string) {
    const q = query(
      collection(db, COLLECTIONS.CONSULTATIONS),
      where('userId', '==', userId),
      orderBy('date', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateConsultationStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled') {
    const docRef = doc(db, COLLECTIONS.CONSULTATIONS, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },
};

// Message operations for chat functionality
export const messageService = {
  async sendMessage(data: {
    senderId: string;
    receiverId: string;
    content: string;
    bookingId?: string;
  }) {
    const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getConversation(userId1: string, userId2: string) {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('senderId', 'in', [userId1, userId2]),
      where('receiverId', 'in', [userId1, userId2]),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async markMessagesAsRead(userId: string, otherUserId: string) {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('senderId', '==', otherUserId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    
    const updates = snapshot.docs.map(doc =>
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updates);
  },
};