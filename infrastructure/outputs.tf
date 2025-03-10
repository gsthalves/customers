output "acm_cname_name" {
  value = tolist(aws_acm_certificate.api_cert.domain_validation_options)[*].resource_record_name

}

output "acm_cname_value" {
  value = tolist(aws_acm_certificate.api_cert.domain_validation_options)[*].resource_record_value
}

output "api_gateway_cname" {
  description = "CNAME for DNS"
  value       = aws_apigatewayv2_domain_name.custom_domain.domain_name_configuration[0].target_domain_name
}

output "customers_dynamodb_table_name" {
  value = aws_dynamodb_table.customers_table.name
}

output "customers_dynamodb_stream_arn" {
  value = aws_dynamodb_table.customers_table.stream_arn
}

output "customers_opensearch_endpoint" {
  value = aws_opensearch_domain.customers_domain.endpoint
}

