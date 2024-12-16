resource "aws_ecr_repository" "akeron_ecr_reop" {
  name                 = "akeronecr"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}
