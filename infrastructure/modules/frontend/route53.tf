data "aws_route53_zone" "route53_zone" {
  name         = var.hosted-zone
  private_zone = false
}

resource "aws_route53_record" "cf_dns" {
  zone_id = data.aws_route53_zone.route53_zone.zone_id
  name    = var.domain-name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend-distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend-distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
