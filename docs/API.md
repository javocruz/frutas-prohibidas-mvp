# API Documentation

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## User Endpoints

### Get User Profile
```http
GET /api/users/:id
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "email": "string"
}
```

### Get User Points
```http
GET /api/users/:id/points
Authorization: Bearer <token>
```

### Get User Receipts
```http
GET /api/users/:id/receipts
Authorization: Bearer <token>
```

## Receipt Endpoints

### Create Receipt
```http
POST /api/receipts
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "id": "string",
      "quantity": "number"
    }
  ],
  "total": "number"
}
```

### Get Receipt
```http
GET /api/receipts/:id
Authorization: Bearer <token>
```

### Update Receipt Status
```http
PUT /api/receipts/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "string"
}
```

### Get Receipt Statistics
```http
GET /api/receipts/stats
Authorization: Bearer <token>
```

## Rewards Endpoints

### Get Rewards Catalog
```http
GET /api/rewards
Authorization: Bearer <token>
```

### Create Reward
```http
POST /api/rewards
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "pointsRequired": "number"
}
```

### Get Reward
```http
GET /api/rewards/:id
Authorization: Bearer <token>
```

### Redeem Reward
```http
POST /api/rewards/:id/redeem
Authorization: Bearer <token>
```

### Get Redeemed Rewards
```http
GET /api/rewards/redeemed
Authorization: Bearer <token>
```

## Points Endpoints

### Get Points Balance
```http
GET /api/points/balance
Authorization: Bearer <token>
```

### Get Points History
```http
GET /api/points/history
Authorization: Bearer <token>
```

### Calculate Points
```http
POST /api/points/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "id": "string",
      "quantity": "number"
    }
  ]
}
```

### Get Points Statistics
```http
GET /api/points/stats
Authorization: Bearer <token>
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
``` 