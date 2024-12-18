output "alb_dns_name" {
  description = "Load Balancer Dns Name"
  value       = aws_lb.ecs_alb.dns_name
}

output "rds_endpoint" {
  description = "The database url"
  value       = "postgresql://akeron:Pcvinpostgres@postgresakeron.cbjrqddvgoeg.eu-central-1.rds.amazonaws.com:5432/akerondatabase"
}
