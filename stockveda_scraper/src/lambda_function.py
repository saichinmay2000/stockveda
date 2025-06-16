def lambda_handler(event, context):
    from scrapers.news_scraper import scrape_all_news
    # from scrapers.sebi_scraper import scrape_sebi_press_releases
    from db.dynamo_client import DynamoDBClient

    print("🔎 Scraping latest articles...")
    news = scrape_all_news()
    # sebi = scrape_sebi_press_releases()
    
    db = DynamoDBClient()
    # db.delete_all_items()
    print("🗃️ Inserting articles into DynamoDB...")
    
    for article in news:
        db.insert_article(article)
    
    
    # for release in sebi:
    #     db.insert_article(release)

    print(f"✅ Inserted {len(news)} news articles into DynamoDB.")
    
    return {
        'statusCode': 200,
        'body': f"Inserted {len(news)} news articles into DynamoDB."
    }
    
# lambda_handler(1, 1)  # For local testing, remove this line in production    