env ?= dev

package:
	nest build
	serverless package --stage $(env)

deploy:
	nest build
	serverless deploy --stage $(env)

remove:
	serverless remove --stage $(env)

start:
	npm run start:lambda:dev

test:
	npm run test

test-coverage:
	npm run test:cov