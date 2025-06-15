import boto3
import os

class DynamoDBClient:
    # A client for interacting with DynamoDB to manage news articles
    def __init__(self, table_name="NewsArticles"):
        # self.table_name = table_name
        self.dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
        self.table = self.dynamodb.Table(table_name)
    
    # Check if an article already exists in the table
    def article_exists(self, url):
        response = self.table.get_item(Key={'url': url})
        return 'Item' in response

    # Insert a new article into the DynamoDB table
    def insert_article(self, article):
        article['embedded'] = False  # Default to False, can be updated later
        if not self.article_exists(article['url']):
            self.table.put_item(Item=article)
            return True
        return False

    # Fetch all articles from the DynamoDB table
    # def fetch_all_articles(self):
    #     response = self.table.scan()
    #     return response.get('Items', [])
    
    def delete_all_items(self):
        scan = self.table.scan()
        while True:
            with self.table.batch_writer() as batch:
                for item in scan['Items']:
                    batch.delete_item(Key={
                        'url': item['url']  # Replace with your key attributes
                    })
            if 'LastEvaluatedKey' in scan:
                scan = self.table.scan(ExclusiveStartKey=scan['LastEvaluatedKey'])
            else:
                break