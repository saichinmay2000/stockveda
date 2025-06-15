# AWS Lambda Scraper

This project is an AWS Lambda function designed to scrape news articles and store them in DynamoDB. It utilizes various scraping techniques to gather data from specified sources and provides a structured way to manage and retrieve this data.

## Project Structure

```
aws-lambda-scraper
├── src
│   ├── lambda_function.py        # Entry point for the AWS Lambda function
│   ├── scrapers                  # Package for scraping functionalities
│   │   ├── __init__.py           # Initializer for scrapers package
│   │   ├── news_scraper.py       # Scraper for news articles
│   │   └── sebi_scraper.py       # Scraper for SEBI press releases
│   ├── db                        # Package for database interactions
│   │   ├── __init__.py           # Initializer for db package
│   │   └── dynamo_client.py      # Client for interacting with DynamoDB
│   └── utils                     # Package for utility functions
│       └── __init__.py           # Initializer for utils package
├── requirements.txt              # List of project dependencies
└── README.md                     # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd aws-lambda-scraper
   ```

2. **Install dependencies**:
   Ensure you have Python and pip installed, then run:
   ```
   pip install -r requirements.txt
   ```

3. **Configure AWS Credentials**:
   Make sure your AWS credentials are configured properly. You can set them up using the AWS CLI:
   ```
   aws configure
   ```

4. **Deploy the Lambda Function**:
   Use the AWS CLI or AWS Management Console to deploy the `lambda_function.py` as a Lambda function.

## Usage

Once deployed, the Lambda function can be triggered based on your configuration (e.g., via an API Gateway, CloudWatch Events, etc.). It will scrape the latest news articles and store them in DynamoDB.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.