resource "aws_s3_bucket" "frontend-bucket" {
  bucket = var.domain-name

  lifecycle {
    prevent_destroy = true
  }

  tags = var.aws-tags
}

resource "aws_s3_bucket_public_access_block" "frontend-block_public_access" {
  bucket = aws_s3_bucket.frontend-bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "frontend_bucket_acl_ownership" {
  bucket = aws_s3_bucket.frontend-bucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_acl" "frontend-bucket-acl" {
  depends_on = [
    aws_s3_bucket_public_access_block.frontend-block_public_access,
    aws_s3_bucket_ownership_controls.frontend_bucket_acl_ownership
  ]
  bucket     = aws_s3_bucket.frontend-bucket.id
  acl        = "private"
}
