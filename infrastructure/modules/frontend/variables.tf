variable "domain-name" {
  description = "Domain name where the frontend can be reached"
  type        = string
}

variable "hosted-zone" {
  description = "Route53 hosted zone where the domain name is"
  type        = string
}

variable "aws-tags" {
  description = "AWS Tags to add to resources"
  type        = map(string)
}

variable "build-directory" {
  description = "Directory of the built files"
  type        = string

  validation {
    condition     = !(endswith(var.build-directory, "/"))
    error_message = "Variable 'file-directory' must not end with a trailing slash"
  }
}

variable "index-file" {
  description = "The index file to distribute"
  type        = string
}

variable "cloudfront-price-class" {
  description = "Price class of the cloudfront distribution"
  type        = string

  validation {
    condition     = contains([
      "PriceClass_100",
      "PriceClass_200",
      "PriceClass_All"
    ],
    var.cloudfront-price-class
    )
    error_message = "CloudFront price class is not valid"
  }
}

variable "ssl-certificate-arn" {
  description = "ARN of the SSL certificate to use (must be in us-east-1)"
  type        = string
}
