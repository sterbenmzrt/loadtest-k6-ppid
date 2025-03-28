# K6 Load Testing Project

This project is designed to perform load testing using [K6](https://k6.io/), a modern load testing tool for developers and testers.


## Prerequisites

- Install [K6](https://k6.io/docs/getting-started/installation/).
- Ensure you have Node.js installed if you need to preprocess or generate test data.

## How to Run Tests

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2. Run a specific test scenario:
    ```bash
    k6 run main.js
    ```
3. Set environment variables (if required):
    ```bash
    export HOST_URL=http://example.com
    k6 run main.js
    ```

## Environment Variables
- `HOST_URL`: The base URL of the application under test.


## Results and Metrics
K6 provides detailed metrics such as:

- Response time
- Request rate
- Error rate

After running a test, you will see a summary of the results in the terminal.

## Customization
- Add new test scenarios in the scenarios/ directory.
- Update main.js to include the new scenarios.