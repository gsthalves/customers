terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.region
}

# Certificate

resource "aws_acm_certificate" "api_cert" {
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = ["api.${var.domain_name}"]
}


# Custom domain

resource "aws_apigatewayv2_domain_name" "custom_domain" {
  domain_name = "api.${var.domain_name}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api_cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

# DynamoDB Table

resource "aws_dynamodb_table" "customers_table" {
  name         = "customers-${var.env}"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "taxId"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "taxId-index"
    hash_key        = "taxId"
    range_key       = "status"
    projection_type = "ALL"
  }


  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    range_key       = "status"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  hash_key  = "PK"
  range_key = "SK"
}

resource "aws_ssm_parameter" "customers_dynamodb_stream_arn_parameter" {
  name        = "/customers/customers_dynamodb_stream_arn"
  description = "ARN of the DynamoDB stream"
  type        = "String"
  value       = aws_dynamodb_table.customers_table.stream_arn
  overwrite   = true
}

# OpenSearch Instance

resource "aws_opensearch_domain" "customers_domain" {
  domain_name    = "customers-${var.env}"
  engine_version = "OpenSearch_2.17"

  cluster_config {
    instance_type  = "t3.small.search"
    instance_count = 1
  }

  ebs_options {
    ebs_enabled = true
    volume_type = "gp2"
    volume_size = 10
  }

  snapshot_options {
    automated_snapshot_start_hour = 0
  }
}

resource "aws_ssm_parameter" "customers_opensearch_endpoint_parameter" {
  name        = "/customers/customers_opensearch_endpoint"
  description = "Endpoint of the OpenSearch customers domain"
  type        = "String"
  value       = aws_opensearch_domain.customers_domain.endpoint
  overwrite   = true
}
