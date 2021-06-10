
module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = var.bucket-name
  ## region = var.AWS_DEFAULT_REGION
  acl    = "public-read"
  policy = data.aws_iam_policy_document.default.json

  # website {
  #   index_document = "index.html"
  #   error_document = "error.html"
  # }
}

data "aws_iam_policy_document" "default" {
  version = "2012-10-17"
  statement {
       sid = "PublicReadAccess"
       effect = "Allow"
       principals {
            type = "AWS"
            identifiers = ["*"]
          }
       actions = ["s3:GetObject"]
       resources = ["arn:aws:s3:::${var.bucket-name}/*"]
   }
}