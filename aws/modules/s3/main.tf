resource "aws_s3_bucket" "akeron_bucket" {
  bucket = "akeronbucket"

  tags = {
    Name        = "akeronBucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_website_configuration" "bucket_website" {
  bucket = aws_s3_bucket.akeron_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket                  = aws_s3_bucket.akeron_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "website_bucket_policy_document" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions   = ["s3:GetObject"]
    effect    = "Allow"
    resources = ["${aws_s3_bucket.akeron_bucket.arn}/*", ]
  }

}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.akeron_bucket.id
  policy = data.aws_iam_policy_document.website_bucket_policy_document.json
}

resource "aws_cloudfront_distribution" "my_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket_website_configuration.bucket_website.website_endpoint
    origin_id   = "akeronbucket"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      http_port              = 80
      https_port             = 443
    }
  }

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = aws_s3_bucket.akeron_bucket.bucket

    compress = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_policy.id
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "cors_policy" {
  name    = "corsPolicy"
  comment = "CORS policy for Akeron application"

  cors_config {
    access_control_allow_credentials = true

    access_control_allow_headers {
      items = ["Authorization", "Content-type", "X-Amz-Date", "X-Amz-Security-Token", "X-Api-Key"]
    }

    access_control_allow_methods {
      items = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    }

    access_control_allow_origins {
      items = ["*"]
    }

    origin_override = true
  }

}
