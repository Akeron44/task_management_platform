resource "aws_db_instance" "postgresAkeron" {
  identifier           = "postgresakeron"
  instance_class       = "db.t3.micro"
  allocated_storage    = 5
  engine               = "postgres"
  engine_version       = "16"
  username             = "akeron"
  password             = "Pcvinpostgres"
  db_name              = "akerondatabase"
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

