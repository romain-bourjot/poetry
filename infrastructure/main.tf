provider "aws" {
  region  = var.STATE_BUCKET_REGION
  profile = var.AWS_PROFILE
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"

  backend "s3" {}
}

module "backend-deploy" {
  source = "./modules/serverless"

  aws-profile          = var.AWS_PROFILE
  aws-region           = var.BACKEND_REGION
  build-directory      = abspath("../backend")
  serverless-app       = var.SERVERLESS_APP
  serverless-org       = var.SERVERLESS_ORG
  build-env-variables  = {}
  api-certificate-name = var.BACKEND_CERTIFICATE_NAME
  api-domain-name      = var.BACKEND_DOMAIN_NAME
}

module "frontend" {
  source = "./modules/frontend"

  build-directory = abspath("../frontend/dist/spa")

  aws-tags = {
    Project = var.AWS_PROJECT_TAG
  }

  domain-name            = var.FRONTEND_DOMAIN_NAME
  ssl-certificate-arn    = var.FRONTEND_SSL_CERTIFICATE_ARN
  cloudfront-price-class = "PriceClass_100"
  index-file             = "index.html"
  hosted-zone            = var.FRONTEND_HOSTED_ZONE
}
