import boto3
from boto3.dynamodb.conditions import Key, Attr
import os

class DynamoDBClient:
    def __init__(self, table_name="NewsArticles"):
        self.dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
        self.table = self.dynamodb.Table(table_name)
        
    def insert_article(self, article):
        article['embedded'] = False  # Default to not embedded
        if not self.article_exists(article['url']):
            self.table.put_item(Item=article)
            return True
        return False
    
    def article_exists(self, url):
        response = self.table.get_item(Key={'url': url})
        return 'Item' in response
    
    def fetch_all_articles(self):
        # response = self.table.scan()
        response = self.table.scan(
            FilterExpression=Attr("embedded").ne(True)
        )
        return response.get('Items', [])
    
    def mark_article_embedded(self, url: str):
        self.table.update_item(
            Key={"url": url},
            UpdateExpression="SET embedded = :val",
            ExpressionAttributeValues={":val": True}
        )
        
    def fetch_unembedded_articles(self):
        response = self.table.scan(
            FilterExpression=Attr("embedded").eq(False)
        )
        return response.get("Items", [])