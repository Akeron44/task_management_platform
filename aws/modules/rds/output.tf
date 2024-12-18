output "db_name" {
  description = "The name of the database"
  value       = aws_db_instance.postgresAkeron.db_name
}
output "username" {
  description = "The name of the database username"
  value       = aws_db_instance.postgresAkeron.username
}
output "password" {
  description = "The name of the database password"
  value       = aws_db_instance.postgresAkeron.password
}
output "db_host" {
  description = "The host of the database"
  value       = aws_db_instance.postgresAkeron.address
}

output "port" {
  description = "The port of the database"
  value       = aws_db_instance.postgresAkeron.port
}

output "rds_endpoint" {
  description = "The database url"
  value       = "postgresql://akeron:Pcvinpostgres@postgresakeron.cbjrqddvgoeg.eu-central-1.rds.amazonaws.com:5432/akerondatabase"
}
