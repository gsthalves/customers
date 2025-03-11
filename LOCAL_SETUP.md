# Setting Up the Environment to Run the Application on AWS

## Requirements

Before starting, install the following software:

- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [AWS CLI](https://aws.amazon.com/cli/) or [Leapp](https://www.leapp.cloud/)
- [Node.js](https://nodejs.org/) (>= 18.x)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started)

## AWS Environment Setup

### 1. Configure AWS Credentials

You can configure your credentials using AWS CLI or Leapp:

#### Using AWS CLI:

```sh
aws configure
```

Fill in the requested values:

- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., sa-east-1)
- Default output format (can be left empty or set to "json")

#### Using Leapp:

1. Install and configure Leapp.
2. Create a profile with your AWS credentials.
3. Activate the profile before running the commands below.

### 2. Provision Infrastructure with Terraform

```sh
cd infrastructure
terraform init --backend-config=envs/dev.backend.config   # Initialize Terraform backend
terraform plan --var-file=envs/dev.tfvars                 # Plan infrastructure changes
terraform apply --var-file=envs/dev.tfvars                # Apply infrastructure changes
```

Alternatively, you can run the Makefile commands:

```sh
cd infrastructure
make init env=dev        # Initialize Terraform backend
make plan env=dev        # Plan infrastructure changes
make apply env=dev       # Apply infrastructure changes
```

### 3. Installing API dependencies

```sh
cd api
npm install
```

### 4. Run the API Locally with Serverless

```sh
cd api
npm run start:lambda:dev
```

Alternatively, you can run the Makefile commands:

```sh
cd api
make start env=dev
```

The API will be available at `http://localhost:3000/dev`.

## Running Unit Tests

#### Run tests without coverage:

```sh
cd api
npm test
```

#### Run tests with coverage:

```sh
cd api
npm run test:cov
```

Alternatively, you can run the Makefile commands:

#### Run tests without coverage:

```sh
cd api
make test
```

#### Run tests with coverage:

```sh
cd api
make test-coverage
```

## Deploy to AWS

To deploy the API to AWS, run:

```sh
serverless deploy --stage dev
```

Alternatively, you can run the Makefile commands:

```sh
make deploy env=dev
```

This will create the Lambda functions and configure the endpoints on AWS.

## Destroying the Environment

To remove the provisioned infrastructure:

## Terraform

```sh
cd infrastructure
terraform destroy
```

Alternatively, you can run the Terraform command manually:

```sh
cd infrastructure
make destroy
```

## Serverless

To remove the Serverless functions:

```sh
cd api
serverless remove --stage dev
```

Alternatively, you can run the Terraform command manually:

```sh
cd api
make remove env=dev
```