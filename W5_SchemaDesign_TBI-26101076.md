# Database Schema — INN Sight AI
## Intern ID: TBI-26101076

---

## Schema Diagram

```
+---------------------------+
|         Review            |
+---------------------------+
| _id         ObjectId (PK) |
| guestName   String (req)  |
| reviewText  String (req)  |
| sentiment   String        |
|   (positive/neutral/neg)  |
| theme       String        |
|   (food/host/location/    |
|    cleanliness/value/     |
|    experience)            |
| response    String        |
| experienceType String     |
| createdAt   Date          |
| updatedAt   Date          |
+---------------------------+
```

---

## Database Choice: MongoDB (via MongoDB Atlas)

MongoDB was chosen because:
- Review data is document-based and flexible
- No strict relationships between entities needed
- Schema-less nature fits variable review content
- Atlas free tier (M0) is sufficient for this project

---

## Collections

| Collection | Description |
|------------|-------------|
| reviews    | Stores all guest reviews with sentiment, theme and AI-generated response |

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | MongoDB auto-generated unique ID |
| guestName | String | Yes | Name of the guest who wrote the review |
| reviewText | String | Yes | The full review text |
| sentiment | String | No | Auto-classified: positive, neutral, negative |
| theme | String | No | Auto-detected: food, host, location, cleanliness, value, experience |
| response | String | No | AI-generated management response |
| experienceType | String | No | Optional experience type provided by user |
| createdAt | Date | Auto | Timestamp when review was created |
| updatedAt | Date | Auto | Timestamp when review was last updated |

---

## ORM/ODM Used

**Mongoose** (Node.js ODM for MongoDB)
- Model file: `backend/models/Review.js`
- Validation: guestName and reviewText are required
- Enum validation on sentiment and theme fields
- Timestamps: enabled (createdAt, updatedAt auto-managed)

---

## Environment Variables

```
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/innsightai
PORT=5000
```
