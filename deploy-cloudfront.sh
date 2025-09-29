#!/bin/bash

# Deploy EstimAI to CloudFront
STACK_NAME="estimai-frontend"
BUCKET_NAME="estimai-frontend-$(date +%s)"

echo "🚀 Deploying EstimAI to CloudFront..."

# 1. Deploy CloudFormation stack
echo "📦 Creating CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudfront.yml \
  --stack-name $STACK_NAME \
  --parameter-overrides BucketName=$BUCKET_NAME \
  --capabilities CAPABILITY_IAM

# 2. Build the project
echo "🔨 Building project..."
npm run build

# 3. Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# 4. Get CloudFront distribution ID and invalidate cache
echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

# 5. Get website URL
WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text)

echo "✅ Deployment complete!"
echo "🌐 Website URL: $WEBSITE_URL"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
