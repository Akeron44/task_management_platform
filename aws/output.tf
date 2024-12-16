output "rds_module" {
  sensitive   = false
  description = "The outputs of the rds module"
  value       = module.rds.db_host
}
