## Before run (IMPORTANT)

Create a s3 bucket with name in "/env/your-enviroment.backend.config" for save terraform state.

## How to run

```
terraform init --backend-config=envs/dev.backend.config

// for reconfigure
terraform init --backend-config=envs/dev.backend.config -reconfigure

terraform plan --var-file=envs/dev.tfvars

terraform apply --var-file=envs/dev.tfvars
```