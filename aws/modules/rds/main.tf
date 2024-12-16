//new
# resource "aws_security_group" "rds_sg" {
#   name        = "rds-security-group"
#   description = "Security groups for rds"
#   vpc_id      = "vpc-072bcbc3be2e0ec63"

#   ingress {
#     from_port       = 5432
#     to_port         = 5432
#     protocol        = "tcp"
#     security_groups = ["sg-0943ad0b8875a7e25"]
#   }

# }

resource "aws_db_instance" "postgresAkeron" {
  identifier        = "postgresakeron"
  instance_class    = "db.t3.micro"
  allocated_storage = 5
  engine            = "postgres"
  engine_version    = "16"
  username          = "akeron"
  password          = "Pcvinpostgres"
  db_name           = "akerondatabase"
  # vpc_security_group_ids = [aws_security_group.rds_sg.id] // new
  parameter_group_name = aws_db_parameter_group.postgresAkeron.name
  publicly_accessible  = true
  skip_final_snapshot  = true
}

resource "aws_db_parameter_group" "postgresAkeron" {
  name   = "akeron"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

