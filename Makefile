include .env

run:
	- k6 run main.js -e HOST_URL=$(HOST_URL)

run-output:
	- k6 run main.js -e HOST_URL=$(HOST_URL) --out json=reports/json/results-$(shell date +%Y%m%d%H%M%S).json