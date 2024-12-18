output "rds_module" {
  sensitive   = false
  description = "The outputs of the rds module"
  value       = module.rds.db_host
}

output "cloudfront_distribution_id" {
  description = "The id of the cloudfront distribution"
  value       = module.s3.cloudfront_distribution_id
}
output "cloudfront_domain_name" {
  description = "The domain name of the cloudfront distribution"
  value       = module.s3.cloudfront_domain_name
}

output "alb_dns_name" {
  description = "The Load Balancer Dns Name"
  value       = module.ecs.alb_dns_name
}

output "rds_endpoint" {
  description = "The url or the database"
  value       = module.rds
}
