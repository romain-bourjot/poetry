data "aws_iam_policy_document" "frontend-s3-policy" {
  statement {
    actions   = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.frontend-bucket.arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [
        aws_cloudfront_origin_access_identity.frontend-oai.iam_arn
      ]
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "frontend-oai" {
  comment = "Frontend OAI for ${var.domain-name}"
}

resource "aws_s3_bucket_policy" "frontend-bucket-policy" {
  bucket = aws_s3_bucket.frontend-bucket.id
  policy = data.aws_iam_policy_document.frontend-s3-policy.json
}
