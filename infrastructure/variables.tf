variable "STATE_BUCKET_NAME" {
  description = "Name of the bucket where tfstate is stored"
  type        = string
}

variable "STATE_BUCKET_KEY" {
  description = "S3 key of the tfstate in STATE_BUCKET_NAME"
  type        = string
}

variable "STATE_BUCKET_REGION" {
  description = "Region for the state bucket"
  type        = string
}

variable "AWS_PROFILE" {
  description = "Name of the AWS profile to use"
  type        = string
}

variable "AWS_PROJECT_TAG" {
  description = "Value to use in Project AWS tag"
  type        = string
}

variable "BACKEND_REGION" {
  description = "Region for the backend"
  type        = string
}

variable "BACKEND_CERTIFICATE_NAME" {
  description = "Name of the SSL certificate to use for the backend"
  type        = string
}

variable "BACKEND_DOMAIN_NAME" {
  description = "Domain name to use for the backend"
  type        = string
}

variable "SERVERLESS_APP" {
  description = "App to use in the Serverless config"
  type        = string
}

variable "SERVERLESS_ORG" {
  description = "Org to use in the Serverless config"
  type        = string
}

variable "FRONTEND_DOMAIN_NAME" {
  description = "Domain name of the frontend"
  type        = string
}

variable "FRONTEND_HOSTED_ZONE" {
  description = "Route53 hosted zone for the frontend domain name"
  type        = string
}

variable "FRONTEND_SSL_CERTIFICATE_ARN" {
  description = "ARN of the SSL certificate to use on front end (must be on us-east-1)"
  type        = string
}
