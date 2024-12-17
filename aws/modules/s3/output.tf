output "domain_name" {
  description = "domain name"
  value       = aws_s3_bucket_website_configuration.bucket_website.website_endpoint
}

output "bucket" {
  description = "bucket"
  value       = aws_s3_bucket.akeron_bucket.bucket

}

output "cloudfront_distribution_id" {
  description = "Cloudfront distribution id"
  value       = aws_cloudfront_distribution.my_distribution.id
}
