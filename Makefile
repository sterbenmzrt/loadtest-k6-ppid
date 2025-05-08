include .env

run:
	- k6 run main.js -e HOST_URL=$(HOST_URL) -e MAX_VU=$(MAX_VU) -e MAX_DURATION=${MAX_DURATION}

run-output:
	- k6 run main.js -e HOST_URL=$(HOST_URL) --out json=reports/json/results-$(shell date +%Y%m%d%H%M%S).json