output "alb_dns_name" {
  description = "Load Balancer Dns Name"
  value       = aws_lb.ecs_alb.dns_name
}

