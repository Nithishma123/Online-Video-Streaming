## Video Streaming Application

1. **PostgreSQL Account:**
   - na3062

2. **Web Application URL:**
   - URL for our video streaming application: http://35.196.164.176:8111/

### Part 1 Proposal Overview

The video streaming application project aims to create a user-centric platform for accessing and enjoying online video content.

Key features include:

1. User Registration and Authentication
2. Trending videos based on ratings
3. Recently viewed (user-specific)
4. Video categorization (also based on genre and cast)
5. Payment integration for subscriptions
6. User customized subscriptions
7. Review submission
8. Recommendation system


### Code Overview

The code provided includes a Flask web application with SQLAlchemy for database interactions. Notable functionalities include user authentication, video retrieval based on categories and genres, user reviews, subscription management, and profile information retrieval.

### Implementation Details

- **User Authentication:**
  - Implemented user login (`/api/login`) and registration (`/api/signup`) functionality.

- **Video Retrieval:**
  - Implemented endpoints for retrieving movies by category (`/api/movies/<int:category_id>`), genres (`/api/movies/genre/<int:genre_id>`), and actor (`/api/movies/cast/<int:actor_id>`) which will help the user to access the content they are looking for easily.

- **Subscription Management:**
  - Implemented user subscription management with endpoints for subscription creation and modification (/api/user-subscription), as well as subscription status retrieval (/api/subscriber).

- **Profile Information:**
  - Implemented endpoints for retrieving user profile information (`/api/profile`), payment cards associated with the user(`/api/cards`),
    adding new card at user account level (`/api/new-card`), deleting card details for the user(`/api/cards/<card_number>`) and subscription details (`/api/subscription`).

- **User Interaction:**
  - Implemented functionalities for writing reviews (`/api/write-reviews`), updating viewed videos (`/api/viewing`), and retrieving recently watched videos (`/api/recently-watched`).

- **Recommendation System:**
  - Implemented a recommendation endpoint (`/api/recommendations`). Recommendations are tailored based on user preferences such as genre, category and cast, incorporating both user likes and high average ratings.

### Interesting Web Pages

1. **Recently Watched Videos (`/api/recently-watched`):**
   - **Description:** Displays the 10 most recently watched videos for the logged-in user.
   - **Database Operations:** Involves retrieving user-specific viewing history, including video details and timestamps.
   - **Interest:** Provides insights into user engagement and preferences.
   - Implemented a favourites section(`/api/favourites`) which returns the videos liked by the user.

2. **User Reviews (`/api/user-reviews`):**
   - **Description:** Shows all reviews submitted by the logged-in user.
   - **Database Operations:** Retrieves reviews, including comments and ratings, submitted by the user. We also have the ability to add comments to different videos which helps in making decisions for recommendation system and featuring content.
   - **Interest:** Offers a snapshot of the user's opinions on various videos, contributing to the community aspect.
  
3. **Trending Videos (`/api/trending`):**
   - **Description:** Displays the 10 most trending videos based on all the user ratings.
   - **Database Operations:** Involves retrieving videos based on the ratings which are bound to change every second.
   - **Interest:** Gives the user suggestions and information on what is trending now.
  
### AI Tools usage

- Utilized AI insights to structure and improve HTML code organization.
- Received support in optimizing and refining CSS styles.
- Leveraged AI assistance to generate JavaScript code snippets
