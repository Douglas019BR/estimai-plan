#!/bin/bash

BUCKET_NAME="estimai-frontend-$(date +%s)"

echo "🚀 Deploying EstimAI to CloudFront..."

# 1. Create S3 bucket
echo "📦 Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME

# 2. Configure bucket for website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 3. Make bucket public
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
    }
  ]
}'

# 4. Build project
echo "🔨 Building project..."
npm run build

# 5. Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# 6. Create CloudFront distribution
echo "☁️ Creating CloudFront distribution..."
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "'$(date +%s)'",
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "S3-'$BUCKET_NAME'",
        "DomainName": "'$BUCKET_NAME'.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-'$BUCKET_NAME'",
      "ViewerProtocolPolicy": "redirect-to-https",
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {"Forward": "none"}
      },
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      }
    },
    "CustomErrorResponses": {
      "Quantity": 2,
      "Items": [
        {
          "ErrorCode": 404,
          "ResponseCode": "200",
          "ResponsePagePath": "/index.html"
        },
        {
          "ErrorCode": 403,
          "ResponseCode": "200", 
          "ResponsePagePath": "/index.html"
        }
      ]
    },
    "Comment": "EstimAI Distribution",
    "Enabled": true
  }' \
  --query 'Distribution.Id' --output text)

# 7. Get distribution domain
DOMAIN_NAME=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)

echo "✅ Deployment complete!"
echo "🌐 Website URL: https://$DOMAIN_NAME"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo "📦 Bucket Name: $BUCKET_NAME"
echo ""
echo "⏳ CloudFront distribution is deploying (takes 15-20 minutes)"
echo "🔗 Direct S3 URL: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
