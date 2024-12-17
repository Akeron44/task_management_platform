output "rds_module" {
  sensitive   = false
  description = "The outputs of the rds module"
  value       = module.rds.db_host
}

output "cloudfront_distribution_id" {
  description = "The id of the cloudfront distribution"
  value       = module.s3.cloudfront_distribution_id
}
