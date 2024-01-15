locals {
  mime_types = {
    "css"  = "text/css"
    "html" = "text/html"
    "ico"  = "image/vnd.microsoft.icon"
    "js"   = "application/javascript"
    "json" = "application/json"
    "map"  = "application/json"
    "png"  = "image/png"
    "svg"  = "image/svg+xml"
    "txt"  = "text/plain"
  }
}

resource "aws_s3_object" "frontend-files" {
  depends_on = [
    aws_s3_bucket.frontend-bucket
  ]

  for_each     = fileset(var.build-directory, "**")
  content_type = lookup(tomap(local.mime_types), element(split(".", each.key), length(split(".", each.key)) - 1), "binary/octet-stream")

  bucket      = aws_s3_bucket.frontend-bucket.id
  key         = each.key
  source      = "${var.build-directory}/${each.key}"
  source_hash = filemd5("${var.build-directory}/${each.key}")
}
