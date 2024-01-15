resource "null_resource" "backend-install" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    working_dir = var.build-directory

    command = "npm ci > /dev/null"
  }
}

resource "null_resource" "backend-deploy" {
  depends_on = [null_resource.backend-install]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    working_dir = var.build-directory
    command     = join(
    " ",
    [
      "npx",
      "serverless",
      "deploy",
      "--aws-profile ${var.aws-profile}",
      "--region ${var.aws-region}",
      "--org ${var.serverless-org}",
      "--app ${var.serverless-app}",
      "--force",
      "--conceal",
      "> /dev/null"
    ]
    )

    environment = merge(
    var.build-env-variables,
    {
      SLS_INTERACTIVE_SETUP_ENABLE = 1
    },
    {
      SERVERLESS_APP       = var.serverless-app,
      SERVERLESS_ORG       = var.serverless-org,
      API_DOMAIN_NAME      = var.api-domain-name,
      API_CERTIFICATE_NAME = var.api-domain-name
    }
    )
  }
}
