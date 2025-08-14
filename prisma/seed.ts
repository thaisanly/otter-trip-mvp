import { PrismaClient } from '@prisma/client';
import { tourLeaders } from '../src/mock/tourLeaders';
import { tours } from '../src/mock/tours';
import { experts } from '../src/mock/experts';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.consultationBooking.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.tourLeader.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.expert.deleteMany();

  // Seed Tour Leaders
  console.log('👥 Seeding tour leaders...');
  for (const leader of tourLeaders) {
    await prisma.tourLeader.create({
      data: {
        id: leader.id,
        name: leader.name,
        image: leader.image,
        location: leader.location,
        rating: leader.rating,
        reviewCount: leader.reviewCount,
        specialty: leader.specialties ? leader.specialties[0] : 'Adventure Guide', // Use first specialty as main
        description: leader.tagline || `Expert ${leader.specialties?.[0] || 'tour'} guide in ${leader.location}`,
        price: `$${leader.price}`,
        isSuperhost: leader.rating >= 4.8, // Consider high-rated guides as superhosts
        languages: leader.languages || [],
        experience: leader.yearsExperience ? `${leader.yearsExperience} years` : null,
        certifications: leader.certifications || [],
        bio: leader.about || null,
        expertise: leader.specialties || [],
        tours: leader.tours || [],
        reviews: leader.reviews || [],
        availability: leader.availability || null,
      },
    });
  }
  console.log(`✅ Created ${tourLeaders.length} tour leaders`);

  // Seed Tours
  console.log('🗺️  Seeding tours...');
  for (const [tourId, tour] of Object.entries(tours)) {
    await prisma.tour.create({
      data: {
        id: tour.id,
        code: tour.code,
        title: tour.title,
        heroImage: tour.heroImage,
        duration: tour.duration,
        price: tour.price,
        totalJoined: tour.totalJoined,
        rating: tour.rating,
        reviewCount: tour.reviewCount,
        location: tour.location,
        categories: tour.categories,
        overview: tour.overview,
        highlights: tour.highlights,
        contentImage: tour.contentImage || null,
        videoUrl: tour.videoUrl || null,
        galleryImages: tour.galleryImages || [],
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        itinerary: tour.itinerary || [],
        additionalInfo: tour.additionalInfo || [],
        guide: tour.guide || null,
        dates: tour.dates || [],
        reviews: tour.reviews || [],
        description: Array.isArray(tour.overview) ? tour.overview[0] : null,
        groupSize: 10, // Default group size
        spotsLeft: tour.dates?.[0]?.spotsLeft || 5,
      },
    });
  }
  console.log(`✅ Created ${Object.keys(tours).length} tours`);

  // Seed Experts
  console.log('🎓 Seeding experts...');
  for (const expert of experts) {
    await prisma.expert.create({
      data: {
        id: expert.id,
        name: expert.name,
        title: expert.specialties ? expert.specialties[0] : 'Travel Expert', // Use first specialty as title
        image: expert.image,
        location: expert.location,
        rating: expert.rating,
        reviewCount: expert.reviews || 0,
        hourlyRate: expert.consultationPrice || '$50/hour',
        languages: expert.languages || [],
        expertise: expert.specialties || [],
        certifications: [], // Experts don't have certifications in mock data
        availability: null, // No availability in mock data
        bio: expert.bio || null,
        experience: expert.experience ? `${expert.experience} years` : null,
      },
    });
  }
  console.log(`✅ Created ${experts.length} experts`);

  console.log('✨ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });