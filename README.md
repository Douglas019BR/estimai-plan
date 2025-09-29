# EstimAI Frontend

React-based frontend for the EstimAI project estimation system powered by AWS Bedrock and Claude AI.

## Features

- **Modern Stack**: React 18 + TypeScript + Vite
- **UI Components**: Tailwind CSS + Shadcn/ui
- **Real-time Estimation**: Async processing with live status updates
- **Secure Integration**: API key authentication with backend
- **Production Ready**: CloudFront deployment with OAC security
- **Responsive Design**: Mobile-first approach

## Architecture

- **Frontend**: React SPA with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Build Tool**: Vite for fast development and optimized builds
- **Deployment**: AWS S3 + CloudFront with Origin Access Control

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd estimai-plan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage
   VITE_S3_BUCKET_URL=https://your-results-bucket.s3.region.amazonaws.com/results
   VITE_API_KEY=your-api-key-here
   ```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment Options

### Option 1: Simple S3 Website
```bash
./deploy-simple.sh
```
- Basic S3 website hosting
- Public bucket with website configuration
- HTTP access

### Option 2: CloudFront + OAC (Recommended)
```bash
./deploy-cloudfront.sh
```
- Private S3 bucket with CloudFront
- Origin Access Control for security
- HTTPS enforcement
- Global CDN distribution

## Security Features

- **Private S3 Bucket**: No direct public access
- **Origin Access Control**: Only CloudFront can access S3
- **API Key Authentication**: Secure backend communication
- **CORS Protection**: Controlled cross-origin requests
- **HTTPS Enforcement**: SSL/TLS encryption
- **Content Security**: Input validation and sanitization

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── EstimInput.tsx  # Main estimation form
│   └── EstimResults.tsx # Results display
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── pages/              # Route components
├── constants/          # App constants
└── utils/              # Utility functions
```

## Key Components

- **EstimInput**: Main form for project requirements input
- **EstimResults**: Real-time results display with polling
- **JsonViewer**: Formatted JSON display with copy functionality
- **ResultsDisplay**: Structured estimation breakdown

## API Integration

The frontend communicates with the EstimAI backend through:
- **POST /estimate**: Submit estimation requests
- **GET /results/{id}**: Fetch estimation results
- **Polling mechanism**: Real-time status updates

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination  
- **Asset Optimization**: Compressed images and fonts
- **CDN Caching**: CloudFront global edge locations
- **Lazy Loading**: Components loaded on demand

## License

This project is licensed under the MIT License.
