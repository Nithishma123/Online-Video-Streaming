## Video Streaming Application

1. **PostgreSQL Account:**
   - na3062

2. **Web Application URL:**
   - Provide the URL of your web application. Ensure that your virtual machine is not turned off after code modification and before submission to maintain a stable IP address for the URL.

### Part 1 Proposal Overview

The video streaming application project aims to create a user-centric platform for accessing and enjoying online video content. Key features include user registration, video categorization, payment integration for subscriptions, user customization, feedback submission, and a recommendation system.

### Code Overview

The code provided includes a Flask web application with SQLAlchemy for database interactions. Notable functionalities include user authentication, video retrieval based on categories and genres, user reviews, subscription management, and profile information retrieval.

### Implementation Details

- **User Authentication:**
  - Implemented user login (`/api/login`) and registration (`/api/signup`) functionality.

- **Video Retrieval:**
  - Implemented endpoints for retrieving movies by category (`/api/movies/<int:category_id>`), genres (`/api/movies/genre/<int:genre_id>`), and actor (`/api/movies/cast/<int:actor_id>`).

- **Subscription Management:**
  - Implemented user subscription (`/api/user-subscription`) and subscription status retrieval (`/api/subscriber`).

- **Profile Information:**
  - Implemented endpoints for retrieving user profile information (`/api/profile`), payment cards (`/api/cards`), and subscription details (`/api/subscription`).

- **User Interaction:**
  - Implemented functionalities for writing reviews (`/api/write-reviews`), updating viewed videos (`/api/viewing`), and retrieving recently watched videos (`/api/recently-watched`).

- **Recommendation System:**
  - Implemented a recommendation endpoint (`/api/recommendations`) based on user likes and high average ratings.

### Interesting Web Pages

1. **Recently Watched Videos (`/api/recently-watched`):**
   - **Description:** Displays the 10 most recently watched videos for the logged-in user.
   - **Database Operations:** Involves retrieving user-specific viewing history, including video details and timestamps.
   - **Interest:** Provides insights into user engagement and preferences.

2. **User Reviews (`/api/user-reviews`):**
   - **Description:** Shows all reviews submitted by the logged-in user.
   - **Database Operations:** Retrieves reviews, including comments and ratings, submitted by the user.
   - **Interest:** Offers a snapshot of the user's opinions on various videos, contributing to the community aspect.
