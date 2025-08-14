-- CreateTable
CREATE TABLE "public"."tour_leaders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "specialty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "isSuperhost" BOOLEAN NOT NULL DEFAULT false,
    "languages" JSONB NOT NULL,
    "experience" TEXT,
    "certifications" JSONB,
    "bio" TEXT,
    "expertise" JSONB,
    "tours" JSONB,
    "reviews" JSONB,
    "availability" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_leaders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tours" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "totalJoined" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT NOT NULL,
    "categories" JSONB NOT NULL,
    "overview" JSONB NOT NULL,
    "highlights" JSONB NOT NULL,
    "contentImage" TEXT,
    "videoUrl" TEXT,
    "galleryImages" JSONB,
    "inclusions" JSONB,
    "exclusions" JSONB,
    "itinerary" JSONB,
    "additionalInfo" JSONB,
    "guide" JSONB,
    "dates" JSONB,
    "reviews" JSONB,
    "description" TEXT,
    "groupSize" INTEGER,
    "spotsLeft" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "hourlyRate" TEXT NOT NULL,
    "languages" JSONB NOT NULL,
    "expertise" JSONB NOT NULL,
    "certifications" JSONB,
    "availability" JSONB,
    "bio" TEXT,
    "experience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "tourTitle" TEXT NOT NULL,
    "location" TEXT,
    "selectedDate" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "pricePerPerson" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "leadTraveler" JSONB NOT NULL,
    "additionalTravelers" JSONB,
    "specialRequests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consultation_bookings" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "expertName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "preferredDate" TEXT,
    "preferredTime" TEXT,
    "message" TEXT,
    "invitationCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "destination" TEXT NOT NULL,
    "preferredDate" TEXT,
    "tripDuration" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tours_code_key" ON "public"."tours"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingReference_key" ON "public"."bookings"("bookingReference");
