provider "aws" {
  region = "eu-central-1"
}

terraform {
  backend "s3" {
    bucket = "akeron-remote-state"
    key    = "key/terraform.tfstate"
    region = "eu-central-1"
  }
}

module "s3" {
  source = "./modules/s3"
}

module "rds" {
  source = "./modules/rds"
}

module "ecr" {
  source = "./modules/ecr"
}

module "ecs" {
  source   = "./modules/ecs"
  db_name  = module.rds.db_name
  port     = module.rds.port
  db_host  = module.rds.db_host
  password = module.rds.password
  username = module.rds.username
}
