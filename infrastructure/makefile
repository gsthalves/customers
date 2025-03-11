env ?= dev

init:
	terraform init --backend-config=envs/$(env).backend.config

reconfigure:
	terraform init --backend-config=envs/$(env).backend.config -reconfigure

plan:
	terraform plan --var-file=envs/$(env).tfvars

apply:
	terraform apply --var-file=envs/$(env).tfvars

destroy:
	terraform destroy