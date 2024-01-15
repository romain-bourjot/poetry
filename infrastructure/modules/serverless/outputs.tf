output "api-url" {
  description = "The base url where the Serverless app can be found"
  value       = "https://${var.api-domain-name}"
}
