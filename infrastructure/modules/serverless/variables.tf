variable "build-directory" {
  description = "The root directory of the Serverless application"
  type        = string

  validation {
    condition     = !(endswith(var.build-directory, "/"))
    error_message = "Variable 'build-directory' must not end with a trailing slash"
  }

  validation {
    condition     = fileexists(format("%s/serverless.yml", var.build-directory))
    error_message = "Variable 'build-directory' does not seem to point to a valid Serverless app"
  }
}

variable "build-env-variables" {
  description = "Environment variables to forward to build command"
  type        = map(string)
}

variable "aws-profile" {
  description = "The AWS profile to use for deployment"
  type        = string
}

variable "aws-region" {
  description = "The AWS region to deploy to"
  type        = string
}

variable "serverless-app" {
  description = "The Serverless target app"
  type        = string
}

variable "serverless-org" {
  description = "The Serverless org"
  type        = string
}

variable "api-domain-name" {
  description = "The domain name where the serverless app will be available"
  type        = string
}

variable "api-certificate-name" {
  description = "The SSL certificate to use"
  type        = string
}
