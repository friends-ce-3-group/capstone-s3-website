resource "aws_s3_bucket" "s3_website" {
  bucket = var.proj_name_website
  tags = {
    Name = var.proj_name_website
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.s3_website.id
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket" "s3_images" {
  bucket = var.proj_name_images
  tags = {
    Name = var.proj_name_images
  }
}