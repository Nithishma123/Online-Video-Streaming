# Project 2 README

## Team Members
- Teammate 1: [Nithishma Allu na3062]
- Teammate 2: [Nagavasavi Jeepalyam nj2506]

## PostgreSQL Account
- Database on the server is associated with na3062.

## Schema Expansion Details

### 1. Text Attribute Addition

**Objective:**
Add a text attribute to enable full-text search on document-style data.

**Rationale:**
To enhance the search capabilities of the database and provide users with the ability to search for videos based on textual content, we added a 'plot' attribute to the `VIDEO_ITEM_BELONGSTO` table.

**SQL Statements:**
```sql
-- Add text attribute 'plot' to VIDEO_ITEM_BELONGSTO
ALTER TABLE VIDEO_ITEM_BELONGSTO
ADD COLUMN if not exists plot TEXT;
```

### 2. Array Attribute Addition

**Objective:**
Add an array attribute to store multiple categories, genres, and cast of each video.

**Rationale:**
To efficiently represent and query multiple categories, genres, and cast associated with each video, we added a 'tags' array attribute to the `VIDEO_ITEM_BELONGSTO` table.

**SQL Statements:**
```sql
-- Add array attribute 'tags' to VIDEO_ITEM_BELONGSTO
ALTER TABLE VIDEO_ITEM_BELONGSTO ADD COLUMN IF NOT EXISTS tags TEXT[];
```
## New Composite Type

### 3. Video Metadata Composite Type

**Objective:**
Define a new composite type for video metadata and create a new table using this composite type.

**Rationale:**
To organize and store metadata associated with each video, we defined a composite type 'video_metadata_type' and created a new table `VIDEO_METADATA` to utilize this type.

**SQL Statements:**
```sql
-- Define composite type for video metadata
CREATE TYPE video_metadata_type AS (
    release_date DATE,
    language VARCHAR(20),
    budget INT
);

-- Create a new table using video_metadata_type
CREATE TABLE VIDEO_METADATA (
    video_id INT PRIMARY KEY,
    metadata video_metadata_type,
    FOREIGN KEY(video_id) REFERENCES VIDEO_ITEM_BELONGSTO ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Trigger Addition

### 4. Subscription Status Trigger

**Objective:**
Create a trigger to update the subscription status based on subscription plans.

**Rationale:**
To automatically update the subscription status of users based on their subscription plans, we created a trigger that executes a function to perform the necessary updates.

**SQL Statements:**
```sql
-- Create a function to update subscription status with logging
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS TRIGGER AS $$
-- (Function code as provided in the queries)

-- Create a trigger for monthly subscriber updates
CREATE TRIGGER update_subscription_status_monthly
AFTER INSERT OR UPDATE ON MONTHLY_SUBSCRIBER
FOR EACH ROW
EXECUTE FUNCTION update_subscription_status();

-- Create a trigger for annual subscriber updates
CREATE TRIGGER update_subscription_status_annual
AFTER INSERT OR UPDATE ON ANNUAL_SUBSCRIBER
FOR EACH ROW
EXECUTE FUNCTION update_subscription_status();
```



