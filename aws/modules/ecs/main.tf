# resource "aws_ecs_cluster" "ecs_cluster" {
#   name = "akeron-ecs-cluster"
# }

# resource "aws_launch_template" "ecs_lt" {
#   name_prefix   = "ecs-template"
#   image_id      = "ami-062c116e449466e7f"
#   instance_type = "t3.micro"

#   iam_instance_profile {
#     name = "ecsInstanceRole"
#   }

#   block_device_mappings {
#     device_name = "/dev/xvda"
#     ebs {
#       volume_size = 30
#       volume_type = "gp2"
#     }
#   }

#   tag_specifications {
#     resource_type = "instance"
#     tags = {
#       Name = "akeron-ecs-instance"
#     }
#   }

#   user_data = filebase64("./modules/ecs/ecs.sh")
# }

# resource "aws_autoscaling_group" "ecs_asg" {
#   min_size            = 1
#   max_size            = 3
#   vpc_zone_identifier = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]

#   launch_template {
#     id      = aws_launch_template.ecs_lt.id
#     version = "$Latest"
#   }

# }

# resource "aws_lb" "ecs_alb" {
#   name               = "akeron-alb"
#   load_balancer_type = "application"
#   subnets            = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]

#   tags = {
#     Name = "akeron-alb"
#   }
# }

# resource "aws_lb_listener" "ecs_alb_listener" {
#   load_balancer_arn = aws_lb.ecs_alb.arn
#   port              = 80
#   protocol          = "HTTP"

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.ecs_tg.arn
#   }
# }

# resource "aws_lb_target_group" "ecs_tg" {
#   vpc_id      = "vpc-072bcbc3be2e0ec63"
#   name        = "akeron-ecs-target-group"
#   port        = 80
#   protocol    = "HTTP"
#   target_type = "ip"

#   health_check {
#     path = "/"
#   }
# }

# resource "aws_ecs_capacity_provider" "ecs_capacity_provider" {
#   name = "akeronsCapacity"

#   auto_scaling_group_provider {
#     auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn

#     managed_scaling {
#       maximum_scaling_step_size = 1000
#       minimum_scaling_step_size = 1
#       status                    = "ENABLED"
#       target_capacity           = 1
#     }
#   }
# }

# resource "aws_ecs_cluster_capacity_providers" "example" {
#   cluster_name       = aws_ecs_cluster.ecs_cluster.name
#   capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider.name]


#   default_capacity_provider_strategy {
#     base              = 1
#     weight            = 100
#     capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
#   }
# }

# resource "aws_ecs_task_definition" "ecs_task_definition" {
#   family = "akeron-ecs-task"

#   container_definitions = jsonencode([{
#     name  = "akeron-ecs-task"
#     image = "863872515231.dkr.ecr.eu-central-1.amazonaws.com/akeronecr:1.0.0"
#     cpu   = 0
#     portMappings = [{
#       name          = "api-5000-tcp"
#       containerPort = 4000
#       hostPort      = 4000
#       protocol      = "tcp"
#       appProtocol   = "http"
#     }],
#     essential = true
#     environment = [
#       {
#         name  = "PORT"
#         value = "4000"
#       },
#       {
#         name  = "POSTGRES_USER"
#         value = var.username
#       },
#       {
#         name  = "POSTGRES_PASSWORD"
#         value = var.password
#       },
#       {
#         name  = "POSTGRES_DB"
#         value = var.db_name
#       },
#       {
#         name  = "POSTGRES_HOST"
#         value = var.db_host
#       },
#       {
#         name  = "POSTGRES_PORT"
#         value = var.port
#       },
#       {
#         name  = "TOKEN_SECRET_KEY"
#         value = "task_management_db_secret_key"
#       },
#       {
#         name  = "DATABASE_URL"
#         value = "postgresql://akeron:Pcvinpostgres@postgresakeron.cbjrqddvgoeg.eu-central-1.rds.amazonaws.com:5432/akerondatabase"
#       }
#     ]
#   }])
#   execution_role_arn       = "arn:aws:iam::863872515231:role/ecsTaskExecutionRole"
#   requires_compatibilities = ["EC2"]
#   network_mode             = "awsvpc"
#   cpu                      = "1024"
#   memory                   = "2048"
# }

# resource "aws_ecs_service" "ecs_service" {
#   name            = "akeron-ecs-service"
#   cluster         = aws_ecs_cluster.ecs_cluster.id
#   task_definition = aws_ecs_task_definition.ecs_task_definition.arn
#   desired_count   = 1

#   network_configuration {
#     subnets         = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]
#     security_groups = ["sg-0943ad0b8875a7e25"]
#   }

#   force_new_deployment = true
#   placement_constraints {
#     type = "distinctInstance"
#   }

#   capacity_provider_strategy {
#     capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
#     weight            = 100
#   }

#   load_balancer {
#     target_group_arn = aws_lb_target_group.ecs_tg.arn
#     container_name   = "akeron-ecs-task"
#     container_port   = 4000
#   }

#   depends_on = [aws_autoscaling_group.ecs_asg]
# }

# ECS Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "akeron-ecs-cluster"
}

# Launch Template for EC2 Instances
resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "ecs-template"
  image_id      = "ami-062c116e449466e7f"
  instance_type = "t3.micro"

  iam_instance_profile {
    name = "ecsInstanceRole"
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 30
      volume_type = "gp2"
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "akeron-ecs-instance"
    }
  }

  user_data = filebase64("./modules/ecs/ecs.sh")
}

# Auto Scaling Group
resource "aws_autoscaling_group" "ecs_asg" {
  min_size            = 1
  max_size            = 3
  vpc_zone_identifier = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]

  launch_template {
    id      = aws_launch_template.ecs_lt.id
    version = "$Latest"
  }
}

# Load Balancer
resource "aws_lb" "ecs_alb" {
  name               = "akeron-alb"
  load_balancer_type = "application"
  subnets            = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]

  security_groups = ["sg-0943ad0b8875a7e25"] # Ensure security group allows inbound HTTP traffic on port 80

  tags = {
    Name = "akeron-alb"
  }
}

# Load Balancer Listener
resource "aws_lb_listener" "ecs_alb_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}

# Load Balancer Target Group
resource "aws_lb_target_group" "ecs_tg" {
  vpc_id      = "vpc-072bcbc3be2e0ec63"
  name        = "akeron-ecs-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"

  health_check {
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    interval            = 30
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

# ECS Capacity Provider
resource "aws_ecs_capacity_provider" "ecs_capacity_provider" {
  name = "akeronsCapacity"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn

    managed_scaling {
      maximum_scaling_step_size = 1000
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = 1
    }
  }
}

# ECS Cluster Capacity Providers
resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name       = aws_ecs_cluster.ecs_cluster.name
  capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "ecs_task_definition" {
  family = "akeron-ecs-task"

  container_definitions = jsonencode([{
    name  = "akeron-ecs-task"
    image = "863872515231.dkr.ecr.eu-central-1.amazonaws.com/akeronecr:1.0.0"
    cpu   = 0
    portMappings = [{
      name          = "api-5000-tcp"
      containerPort = 4000
      hostPort      = 4000
      protocol      = "tcp"
      appProtocol   = "http"
    }],
    essential = true
    environment = [
      {
        name  = "PORT"
        value = "4000"
      },
      {
        name  = "POSTGRES_USER"
        value = var.username
      },
      {
        name  = "POSTGRES_PASSWORD"
        value = var.password
      },
      {
        name  = "POSTGRES_DB"
        value = var.db_name
      },
      {
        name  = "POSTGRES_HOST"
        value = var.db_host
      },
      {
        name  = "POSTGRES_PORT"
        value = var.port
      },
      {
        name  = "TOKEN_SECRET_KEY"
        value = "task_management_db_secret_key"
      },
      {
        name  = "DATABASE_URL"
        value = "postgresql://akeron:Pcvinpostgres@postgresakeron.cbjrqddvgoeg.eu-central-1.rds.amazonaws.com:5432/akerondatabase"
      }
    ]
  }])
  execution_role_arn       = "arn:aws:iam::863872515231:role/ecsTaskExecutionRole"
  requires_compatibilities = ["EC2"]
  network_mode             = "awsvpc"
  cpu                      = "1024"
  memory                   = "2048"
}

# ECS Service
resource "aws_ecs_service" "ecs_service" {
  name            = "akeron-ecs-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = 1

  network_configuration {
    subnets         = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]
    security_groups = ["sg-0943ad0b8875a7e25"] # Ensure security group allows inbound traffic from ALB
  }

  force_new_deployment = true
  placement_constraints {
    type = "distinctInstance"
  }

  triggers = {
    redeployment = timestamp()
  }

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
    weight            = 100
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg.arn
    container_name   = "akeron-ecs-task"
    container_port   = 4000
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}

# Security Group for ECS Instances
resource "aws_security_group" "ecs_sg" {
  name        = "ecs_sg"
  description = "Allow inbound traffic from load balancer"

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Or restrict to load balancer security group
  }
}

# Security Group for Load Balancer
resource "aws_security_group" "alb_sg" {
  name        = "alb_sg"
  description = "Allow HTTP traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Or restrict to your app's IPs/subnets
  }
}

