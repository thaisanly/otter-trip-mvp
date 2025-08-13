import { useState, useEffect } from 'react';
import { 
  tourLeaderService, 
  tourService, 
  expertService, 
  bookingService, 
  reviewService,
  consultationService,
  messageService 
} from '../services/firestore';
import { TourLeader, Tour, Expert, Booking, Review } from '../types';

// Hook for Tour Leaders
export const useTourLeaders = () => {
  const [tourLeaders, setTourLeaders] = useState<TourLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTourLeaders = async () => {
      try {
        setLoading(true);
        const data = await tourLeaderService.getAllTourLeaders();
        setTourLeaders(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourLeaders();
  }, []);

  return { tourLeaders, loading, error };
};

// Hook for single Tour Leader
export const useTourLeader = (id: string) => {
  const [tourLeader, setTourLeader] = useState<TourLeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTourLeader = async () => {
      try {
        setLoading(true);
        const data = await tourLeaderService.getTourLeader(id);
        setTourLeader(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourLeader();
    }
  }, [id]);

  return { tourLeader, loading, error };
};

// Hook for Tours
export const useTours = (leaderId?: string) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = leaderId 
          ? await tourService.getToursByLeader(leaderId)
          : await tourService.getAllTours();
        setTours(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [leaderId]);

  return { tours, loading, error };
};

// Hook for single Tour
export const useTour = (id: string) => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTour(id);
        setTour(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  return { tour, loading, error };
};

// Hook for Experts
export const useExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const data = await expertService.getAllExperts();
        setExperts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  return { experts, loading, error };
};

// Hook for single Expert
export const useExpert = (id: string) => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        const data = await expertService.getExpert(id);
        setExpert(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExpert();
    }
  }, [id]);

  return { expert, loading, error };
};

// Hook for User Bookings
export const useUserBookings = (userId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getUserBookings(userId);
        setBookings(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  return { bookings, loading, error };
};

// Hook for Reviews
export const useReviews = (type: 'tour' | 'tourLeader', id: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = type === 'tour' 
          ? await reviewService.getReviewsForTour(id)
          : await reviewService.getReviewsForTourLeader(id);
        setReviews(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [type, id]);

  return { reviews, loading, error };
};

// Hook for creating a booking
export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const bookingId = await bookingService.createBooking(bookingData);
      return bookingId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};

// Hook for scheduling consultations
export const useScheduleConsultation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scheduleConsultation = async (data: {
    userId: string;
    tourLeaderId?: string;
    expertId?: string;
    date: Date;
    time: string;
    duration: number;
    topic: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const consultationId = await consultationService.scheduleConsultation(data);
      return consultationId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { scheduleConsultation, loading, error };
};