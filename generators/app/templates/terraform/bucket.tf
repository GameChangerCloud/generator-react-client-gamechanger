variable "bucket_name_production" {
  type    = string
  default = "<%-appName%>-production"
}
variable "bucket_name_staging" {
  type    = string
  default = "<%-appName%>-staging"
}


resource "aws_s3_bucket" "production" {
  bucket = var.bucket_name_production
  force_destroy = true

}

resource "aws_s3_bucket_website_configuration" "production" {
  bucket = aws_s3_bucket.production.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_acl" "production" {
  bucket = aws_s3_bucket.production.id
  acl    = "public-read"
  
}

resource "aws_s3_bucket" "staging" {
  bucket = var.bucket_name_staging
  force_destroy = true

}

resource "aws_s3_bucket_website_configuration" "staging" {
  bucket = aws_s3_bucket.staging.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_acl" "staging" {
  bucket = aws_s3_bucket.staging.id
  acl    = "public-read"
  
}

resource "aws_s3_bucket_policy" "prod_policy" {
  bucket = aws_s3_bucket.production.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<%-appName%>-production/*"
    }
  ]
}
EOF
}

resource "aws_s3_bucket_policy" "staging_policy" {
  bucket = aws_s3_bucket.staging.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<%-appName%>-staging/*"
    }
  ]
}
EOF
}

locals {
  s3_origin_id = "S3Origin"
}

resource "aws_cloudfront_distribution" "s3_distribution_production" {
  origin {
    domain_name = element(split("/",aws_s3_bucket_website_configuration.production.website_endpoint),2)
    origin_id   = local.s3_origin_id

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["SSLv3", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  comment             = "Production <%-appName%> CloudFront"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    compress = true
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_distribution" "s3_distribution_staging" {
  origin {
    domain_name = element(split("/",aws_s3_bucket_website_configuration.staging.website_endpoint),2)
    origin_id   = local.s3_origin_id

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["SSLv3", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  comment             = "Staging <%-appName%> CloudFront"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    compress = true
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "staging"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "null_resource" "getIDS" {
  provisioner "local-exec" {
    command = "echo 'PRODUCTION_DISTRIBUTION : ${aws_cloudfront_distribution.s3_distribution_production.id}\nSTAGING_DISTRIBUTION : ${aws_cloudfront_distribution.s3_distribution_staging.id} ' >> ids.txt"
    interpreter = ["bash", "-c"]
  }
}

resource "null_resource" "getURLs" {
  provisioner "local-exec" {
    command = "echo '\n\nURL_PRODUCTION : ${aws_cloudfront_distribution.s3_distribution_production.domain_name}\nURL_STAGING : ${aws_cloudfront_distribution.s3_distribution_staging.domain_name} ' >> ids.txt"
    interpreter = ["bash", "-c"]
  }
}