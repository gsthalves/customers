env ?= dev

package:
	nest build
	serverless package --stage $(env)

deploy:
	nest build
	serverless deploy --stage $(env)