output "s3_bucket_website_domain_name" {
  value = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "s3_bucket_images_domain_name" {
  value = aws_s3_bucket.s3_images.bucket_domain_name
}

