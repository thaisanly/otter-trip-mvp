# Otter Trip - Travel Expert Platform

A Next.js application connecting travelers with expert local guides for authentic travel experiences.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for email testing with Mailpit)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thaisanly/otter-trip-mvp.git
cd otter-trip-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see Email Configuration below)

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Email Configuration

This application supports two email providers: **Resend** (for production) and **SMTP** (for local development).

### Environment Variables

Set these in your `.env.local` file:

```env
# Choose email provider: 'resend' or 'smtp'
EMAIL_PROVIDER=smtp
ADMIN_EMAIL=contact@ottertrip.com

# Resend configuration (when EMAIL_PROVIDER=resend)
RESEND_API_KEY=your_resend_api_key_here

# SMTP configuration (when EMAIL_PROVIDER=smtp)
SMTP_HOST=host.docker.internal  # Use 'localhost' if not in Docker
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@ottertrip.com
```

### Local Development with Mailpit

Mailpit is a lightweight SMTP testing tool that captures all emails sent during development.

#### Setup Mailpit

**Option 1: Run directly on host machine** (if already installed):
- Ensure Mailpit is running on port 1025 (SMTP) and 8025 (Web UI)
- Access Mailpit UI at http://localhost:8025

**Option 2: Using Docker**:
```bash
docker run -d \
  --name mailpit \
  -p 1025:1025 \
  -p 8025:8025 \
  axllent/mailpit
```

#### Configuration for Different Environments

**Local Development (outside Docker)**:
```env
SMTP_HOST=localhost
SMTP_PORT=1025
```

**Local Development (inside Docker)**:
```env
SMTP_HOST=host.docker.internal
SMTP_PORT=1025
```

**Production with Resend**:
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_actual_api_key
ADMIN_EMAIL=your-admin@example.com
```

**Production with SMTP (e.g., SendGrid, AWS SES)**:
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=apikey
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
```

### Testing Email Functionality

1. Ensure Mailpit is running on your host machine (port 1025)

2. Start the development server:
```bash
npm run dev
```

3. Navigate to an expert detail page (e.g., http://localhost:3000/meet-experts/sarah-chen)

4. Fill out and submit the inquiry form

5. Check Mailpit UI at http://localhost:8025 to see the captured emails

## Docker Deployment

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker-compose -f docker-compose.production.yml up --build
```

## Project Structure

```
/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   └── ui/           # UI components
│   ├── mock/             # Mock data
│   └── types/            # TypeScript types
├── public/               # Static assets
├── docker/               # Docker configurations
└── otter-trip-react/     # Legacy React application
```

## Features

- 🌍 Browse expert local guides
- 🔍 Search and filter by destination, specialty, and travel style
- 📅 Book consultations and tours
- ✉️ Contact experts via inquiry forms
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Email**: Resend / SMTP with Nodemailer
- **Icons**: Lucide React
- **Deployment**: Docker ready

## Troubleshooting

### Emails not sending in development
- Ensure Mailpit is running: `docker ps | grep mailpit`
- Check the SMTP_HOST setting (use `host.docker.internal` if app is in Docker)
- Check console logs for error messages

### Emails not sending in production
- Verify your Resend API key is correct
- Check that the sender domain is verified in Resend
- Review API response in server logs

### Connection refused errors
- If running outside Docker, use `SMTP_HOST=localhost`
- If running inside Docker, use `SMTP_HOST=host.docker.internal`
- Ensure Mailpit is running on port 1025

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.