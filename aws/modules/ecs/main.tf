resource "aws_launch_template" "ecs_lt" {
  name_prefix            = "ecs-template"
  image_id               = "ami-06e21f90b3dce3315"
  instance_type          = "t2.micro"
  vpc_security_group_ids = ["sg-0943ad0b8875a7e25"]

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

  user_data = filebase64("${path.module}/ecs.sh")
}

resource "aws_autoscaling_group" "ecs_asg" {
  vpc_zone_identifier = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]
  desired_capacity    = 1
  max_size            = 2
  min_size            = 1

  launch_template {
    id      = aws_launch_template.ecs_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = true
    propagate_at_launch = true
  }
}

resource "aws_lb" "ecs_alb" {
  name               = "akeron-ecs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["sg-0943ad0b8875a7e25"]
  subnets            = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]

  tags = {
    Name = "akeron-ecs-alb"
  }
}

resource "aws_lb_listener" "ecs_alb_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}

resource "aws_lb_target_group" "ecs_tg" {
  name        = "akeron-ecs-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "vpc-072bcbc3be2e0ec63"

  health_check {
    path = "/health"
  }
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "akeron-ecs-cluster"
}

resource "aws_ecs_capacity_provider" "ecs_capacity_provider" {
  name = "test1"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn

    managed_scaling {
      maximum_scaling_step_size = 1000
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = 3
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name       = aws_ecs_cluster.ecs_cluster.name
  capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider.name]


  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
  }
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family             = "akeron-ecs-task"
  network_mode       = "awsvpc"
  execution_role_arn = "arn:aws:iam::863872515231:role/ecsTaskExecutionRole"
  cpu                = 256
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
  container_definitions = jsonencode([
    {
      name      = "akerontask"
      image     = "863872515231.dkr.ecr.eu-central-1.amazonaws.com/akeronecr:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]
      environment = [
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
          name  = "DATABASE_HOST"
          value = var.db_host
        },
        {
          name  = "DATABASE_PORT"
          value = var.port
        },
        {
          name  = "NODE_ENV"
          value = "production"
        },
      ]
    }
  ])
}

resource "aws_ecs_service" "ecs_service" {
  name            = "akeron-ecs-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = 1

  network_configuration {
    subnets         = ["subnet-048ed615c746deb83", "subnet-0c446972c4be90650", "subnet-0a886674953f327bc"]
    security_groups = ["sg-0943ad0b8875a7e25"]
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
    container_name   = "akerontask"
    container_port   = 5000
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}


