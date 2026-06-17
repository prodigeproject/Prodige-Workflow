# API Documentation Guide

## Purpose

This guide provides a comprehensive framework for documenting APIs in your project. Well-documented APIs enable:

- **Developer onboarding**: New team members can quickly understand and use your APIs
- **Integration efficiency**: External consumers can integrate with minimal support
- **Maintenance clarity**: Future developers understand intent and behavior
- **Reduced support burden**: Self-service documentation reduces repetitive questions
- **Quality assurance**: Documentation process reveals inconsistencies and edge cases

## How to Use This Guide

1. **Start with structure**: Use the templates below as starting points
2. **Adapt to your stack**: Customize sections based on REST, GraphQL, gRPC, etc.
3. **Maintain consistency**: Follow the same format across all endpoints
4. **Keep it current**: Update docs alongside code changes
5. **Automate when possible**: Use OpenAPI/Swagger for automatic documentation generation

---

## API Documentation Structure

### Recommended File Organization

```
docs/api/
├── README.md              # API overview and getting started
├── authentication.md      # Auth methods and security
├── errors.md             # Error codes and handling
├── rate-limiting.md      # Rate limits and quotas
├── versioning.md         # Versioning strategy
├── changelog.md          # API changes history
└── endpoints/
    ├── users.md          # User-related endpoints
    ├── products.md       # Product-related endpoints
    └── orders.md         # Order-related endpoints
```


---

## REST API Documentation Format

### Endpoint Template

Use this template for each API endpoint:

```markdown
### [HTTP Method] [Endpoint Path]

**Description**: Brief description of what this endpoint does

**Authentication**: Required | Optional | None

**Rate Limit**: X requests per minute

#### Request

**URL Parameters**:
- `id` (integer, required): User ID

**Query Parameters**:
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 20): Items per page
- `sort` (string, optional): Sort field (name, created_at)

**Headers**:
- `Authorization`: Bearer {token}
- `Content-Type`: application/json

**Body** (JSON):
```json
{
  "name": "string (required, max 100 chars)",
  "email": "string (required, valid email)",
  "role": "string (optional, enum: admin|user|guest)"
}
```

#### Response

**Success (200 OK)**:
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}
```


**Error Responses**:

- **400 Bad Request**:
```json
{
  "error": "INVALID_INPUT",
  "message": "Email format is invalid",
  "field": "email"
}
```

- **401 Unauthorized**:
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication token is missing or invalid"
}
```

- **404 Not Found**:
```json
{
  "error": "NOT_FOUND",
  "message": "User with ID 123 not found"
}
```

- **429 Too Many Requests**:
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Try again in 60 seconds",
  "retry_after": 60
}
```

#### Example Request

```bash
curl -X POST https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }'
```

#### Notes
- Email addresses must be unique
- Role defaults to "user" if not specified
- Created_at timestamp is set automatically
```



---

## Authentication Section Template

```markdown
# Authentication

## Overview

Our API uses [JWT/OAuth 2.0/API Keys] for authentication. All authenticated endpoints require a valid token in the Authorization header.

## Getting Started

### 1. Obtain API Credentials

Register at [registration URL] to receive:
- Client ID
- Client Secret (keep this secure!)

### 2. Authentication Methods

#### Method 1: API Key (Simple)

Include your API key in the header:

```bash
Authorization: ApiKey YOUR_API_KEY
```

**Use case**: Server-to-server communication, internal services

#### Method 2: OAuth 2.0 (Recommended)

**Step 1**: Request access token

```bash
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET
```

**Step 2**: Use access token

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Use case**: User-facing applications, third-party integrations

### Token Expiration

- Access tokens expire after 1 hour
- Refresh tokens expire after 30 days
- Use refresh tokens to obtain new access tokens without re-authenticating

### Security Best Practices

- Never expose API keys or tokens in client-side code
- Use environment variables for sensitive credentials
- Rotate tokens regularly
- Implement token refresh logic
- Use HTTPS for all API calls
```



---

## Error Codes Reference Template

```markdown
# Error Codes

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error description",
  "field": "field_name (if applicable)",
  "details": {}  // Additional context (optional)
}
```

## HTTP Status Codes

### 2xx Success
- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **204 No Content**: Request succeeded, no content to return

### 4xx Client Errors
- **400 Bad Request**: Invalid request format or parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but lacking permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Request conflicts with current state (e.g., duplicate)
- **422 Unprocessable Entity**: Validation failed
- **429 Too Many Requests**: Rate limit exceeded

### 5xx Server Errors
- **500 Internal Server Error**: Unexpected server error
- **502 Bad Gateway**: Upstream service error
- **503 Service Unavailable**: Temporary unavailability (maintenance)
- **504 Gateway Timeout**: Upstream service timeout

## Application Error Codes

| Error Code | HTTP Status | Description | Solution |
|------------|-------------|-------------|----------|
| INVALID_INPUT | 400 | Request body validation failed | Check request format and required fields |
| UNAUTHORIZED | 401 | Missing or invalid auth token | Provide valid authentication token |
| FORBIDDEN | 403 | Insufficient permissions | Request access or use appropriate credentials |
| NOT_FOUND | 404 | Resource not found | Verify resource ID exists |
| DUPLICATE_RESOURCE | 409 | Resource already exists | Use existing resource or update instead |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait before retrying (see retry_after) |
| INTERNAL_ERROR | 500 | Server error | Contact support if persists |


## Validation Error Format

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "fields": [
    {
      "field": "email",
      "error": "Invalid email format"
    },
    {
      "field": "age",
      "error": "Must be greater than 0"
    }
  ]
}
```
```

---

## Rate Limiting Documentation

```markdown
# Rate Limiting

## Overview

To ensure fair usage and system stability, our API implements rate limiting.

## Rate Limits by Tier

| Tier | Requests per Minute | Requests per Day | Burst Limit |
|------|---------------------|------------------|-------------|
| Free | 60 | 1,000 | 10 |
| Basic | 300 | 10,000 | 50 |
| Pro | 1,000 | 100,000 | 200 |
| Enterprise | Custom | Custom | Custom |

## Rate Limit Headers

Every API response includes rate limit information:

```
X-RateLimit-Limit: 60          # Max requests per window
X-RateLimit-Remaining: 45      # Remaining requests
X-RateLimit-Reset: 1609459200  # Unix timestamp when limit resets
```

## Exceeding Rate Limits

When you exceed the rate limit, you'll receive:

**Response (429 Too Many Requests)**:
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Try again in 42 seconds",
  "retry_after": 42
}
```

## Best Practices

1. **Monitor headers**: Check X-RateLimit-Remaining before making additional requests
2. **Implement exponential backoff**: Wait longer between retries
3. **Cache responses**: Avoid repeated requests for same data
4. **Batch requests**: Use batch endpoints when available
5. **Upgrade tier**: Consider higher tier for production applications
```



---

## Versioning Strategy

```markdown
# API Versioning

## Current Version

**Current**: v1  
**Latest Stable**: v1  
**Deprecated**: None  

## Versioning Approach

We use URL-based versioning for clarity and simplicity:

```
https://api.example.com/v1/users
https://api.example.com/v2/users
```

## Version Lifecycle

1. **Active**: Fully supported, recommended for production
2. **Deprecated**: Still functional but not recommended (6-month notice)
3. **Sunset**: No longer available (removed after deprecation period)

## Deprecation Policy

- **Advance notice**: Minimum 6 months before sunset
- **Documentation**: Deprecated endpoints marked clearly
- **Headers**: Deprecation warnings in response headers
- **Migration guide**: Provided for all breaking changes

## Breaking vs Non-Breaking Changes

### Non-Breaking (No version change)
- Adding new endpoints
- Adding optional parameters
- Adding new fields to responses
- Adding new error codes

### Breaking (New version required)
- Removing or renaming endpoints
- Removing or renaming fields
- Changing field types
- Changing authentication methods
- Modifying error response format

## Version-Specific Documentation

Each version maintains separate documentation:
- `/docs/api/v1/` - Version 1 docs
- `/docs/api/v2/` - Version 2 docs

## Header-Based Versioning (Alternative)

If you prefer header-based versioning:

```bash
Accept: application/vnd.api+json; version=1
```
```



---

## Examples of Well-Documented Endpoints

### Example 1: List Users (GET with Pagination)

```markdown
### GET /v1/users

**Description**: Retrieves a paginated list of users

**Authentication**: Required (Bearer token)

**Rate Limit**: 100 requests per minute

#### Request

**Query Parameters**:
- `page` (integer, optional, default: 1): Page number (min: 1)
- `limit` (integer, optional, default: 20): Items per page (min: 1, max: 100)
- `sort` (string, optional, default: "created_at"): Sort field
  - Valid values: `name`, `email`, `created_at`
- `order` (string, optional, default: "desc"): Sort order
  - Valid values: `asc`, `desc`
- `status` (string, optional): Filter by status
  - Valid values: `active`, `inactive`, `pending`

**Headers**:
- `Authorization`: Bearer {token} (required)

#### Response

**Success (200 OK)**:
```json
{
  "data": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **422 Unprocessable Entity**: Invalid parameter values

#### Example Request

```bash
curl -X GET "https://api.example.com/v1/users?page=1&limit=20&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Notes
- Maximum limit is 100 items per page
- Results are cached for 5 minutes
- Use cursor-based pagination for large datasets (see /v1/users/cursor)
```



### Example 2: Create Resource (POST)

```markdown
### POST /v1/products

**Description**: Creates a new product

**Authentication**: Required (Admin role)

**Rate Limit**: 30 requests per minute

#### Request

**Headers**:
- `Authorization`: Bearer {token} (required)
- `Content-Type`: application/json (required)

**Body** (JSON):
```json
{
  "name": "string (required, 3-100 chars)",
  "description": "string (optional, max 500 chars)",
  "price": "number (required, min: 0.01)",
  "currency": "string (required, ISO 4217 code, e.g., USD)",
  "category_id": "integer (required)",
  "tags": ["string (optional, array of strings)"],
  "metadata": {
    "custom_field": "value (optional, object)"
  }
}
```

#### Response

**Success (201 Created)**:
```json
{
  "id": 456,
  "name": "Premium Widget",
  "description": "High-quality widget for enterprise use",
  "price": 99.99,
  "currency": "USD",
  "category_id": 5,
  "tags": ["premium", "enterprise"],
  "metadata": {
    "custom_field": "value"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid JSON format
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: User lacks admin role
- **422 Unprocessable Entity**: Validation errors

#### Example Request

```bash
curl -X POST https://api.example.com/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Widget",
    "description": "High-quality widget",
    "price": 99.99,
    "currency": "USD",
    "category_id": 5,
    "tags": ["premium"]
  }'
```

#### Validation Rules
- Name must be unique within category
- Price supports up to 2 decimal places
- Category must exist before creating product
- Maximum 10 tags per product
```



### Example 3: Update Resource (PUT/PATCH)

```markdown
### PATCH /v1/users/{id}

**Description**: Partially updates a user (only provided fields are updated)

**Authentication**: Required

**Rate Limit**: 60 requests per minute

#### Request

**URL Parameters**:
- `id` (integer, required): User ID to update

**Headers**:
- `Authorization`: Bearer {token} (required)
- `Content-Type`: application/json (required)

**Body** (JSON):
```json
{
  "name": "string (optional, 3-100 chars)",
  "email": "string (optional, valid email)",
  "status": "string (optional, enum: active|inactive|pending)"
}
```

#### Response

**Success (200 OK)**:
```json
{
  "id": 123,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "active",
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid JSON or field types
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: Cannot update other users
- **404 Not Found**: User ID doesn't exist
- **409 Conflict**: Email already taken

#### Example Request

```bash
curl -X PATCH https://api.example.com/v1/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "status": "active"
  }'
```

#### Notes
- Users can only update their own profile unless they have admin role
- Email changes trigger verification email
- Use PUT for full replacement, PATCH for partial updates
```



### Example 4: Delete Resource (DELETE)

```markdown
### DELETE /v1/products/{id}

**Description**: Permanently deletes a product

**Authentication**: Required (Admin role)

**Rate Limit**: 30 requests per minute

#### Request

**URL Parameters**:
- `id` (integer, required): Product ID to delete

**Query Parameters**:
- `force` (boolean, optional, default: false): Force delete even with dependencies

**Headers**:
- `Authorization`: Bearer {token} (required)

#### Response

**Success (204 No Content)**:
No response body

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: User lacks admin role
- **404 Not Found**: Product doesn't exist
- **409 Conflict**: Product has dependencies (use force=true)

#### Example Request

```bash
curl -X DELETE https://api.example.com/v1/products/456 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Notes
- Deletion is permanent and cannot be undone
- Associated orders and references are preserved
- Soft delete available via PATCH status to "archived"
```

---


## OpenAPI/Swagger Integration

### What is OpenAPI?

OpenAPI (formerly Swagger) is a specification for defining REST APIs in a machine-readable format. It enables:
- Automatic documentation generation
- API testing tools
- Client SDK generation
- Mock servers
- Validation

### OpenAPI Specification Example

```yaml
openapi: 3.0.0
info:
  title: Example API
  version: 1.0.0
  description: Comprehensive API for managing users and products
  contact:
    name: API Support
    email: api@example.com
  license:
    name: MIT

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

paths:
  /users:
    get:
      summary: List users
      description: Retrieves a paginated list of users
      tags:
        - Users
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          example: 123
        name:
          type: string
          example: "John Doe"
        email:
          type: string
          format: email
          example: "john@example.com"
        status:
          type: string
          enum: [active, inactive, pending]
        created_at:
          type: string
          format: date-time
  
  responses:
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```



### Tools for OpenAPI

#### Documentation Generation
- **Swagger UI**: Interactive API documentation
- **ReDoc**: Clean, customizable documentation
- **Stoplight**: Collaborative API design

#### Code Generation
- **OpenAPI Generator**: Generate client SDKs in 50+ languages
- **Swagger Codegen**: Generate server stubs and clients

#### Validation & Testing
- **Spectral**: OpenAPI linting and validation
- **Postman**: Import OpenAPI specs for testing
- **Dredd**: API testing against spec

### Implementation Approaches

#### Code-First (Generate spec from code)

**Pros**: Documentation always matches implementation  
**Cons**: Less control over API design

**Tools**:
- Node.js: `swagger-jsdoc`, `tsoa`
- Python: `FastAPI` (built-in), `flask-restx`
- Java: `SpringDoc`, `Swagger Core`
- C#: `Swashbuckle`, `NSwag`

#### Design-First (Write spec, generate code)

**Pros**: Better API design, early feedback  
**Cons**: Requires discipline to keep in sync

**Tools**:
- `openapi-generator-cli`
- `swagger-codegen`
- Stoplight Studio

### Hosting Documentation

```bash
# Using Swagger UI with Docker
docker run -p 80:8080 \
  -e SWAGGER_JSON=/docs/openapi.yaml \
  -v /path/to/docs:/docs \
  swaggerapi/swagger-ui

# Using ReDoc with Docker
docker run -p 80:80 \
  -e SPEC_URL=http://example.com/openapi.yaml \
  redocly/redoc
```

### Best Practices

1. **Use $ref for reusability**: Define schemas once, reference everywhere
2. **Provide examples**: Include realistic example values
3. **Document errors thoroughly**: Specify all possible error responses
4. **Validate spec regularly**: Use linting tools to catch issues
5. **Version your spec**: Track changes alongside code



---

## Testing Section

### How to Test APIs

#### Manual Testing

**1. Using cURL**

```bash
# Basic GET request
curl https://api.example.com/v1/users

# POST with data
curl -X POST https://api.example.com/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Save response to file
curl -o response.json https://api.example.com/v1/users

# View response headers
curl -i https://api.example.com/v1/users

# Follow redirects
curl -L https://api.example.com/v1/users
```

**2. Using HTTPie** (User-friendly alternative to cURL)

```bash
# Install
pip install httpie

# GET request
http GET https://api.example.com/v1/users

# POST request
http POST https://api.example.com/v1/users \
  name="John Doe" \
  email="john@example.com" \
  Authorization:"Bearer TOKEN"
```

**3. Using Postman**

1. Import OpenAPI spec or manually create requests
2. Create collections for related endpoints
3. Use environments for different configs (dev, staging, prod)
4. Write test scripts for automated validation
5. Generate documentation from collections

**4. Using Insomnia**

Similar to Postman with focus on:
- GraphQL support
- gRPC support
- Clean interface
- Plugin ecosystem



#### Automated Testing

**1. Unit Tests (Test individual endpoints)**

```javascript
// Example using Jest and Supertest (Node.js)
const request = require('supertest');
const app = require('../app');

describe('GET /v1/users', () => {
  it('should return paginated users', async () => {
    const response = await request(app)
      .get('/v1/users')
      .query({ page: 1, limit: 20 })
      .set('Authorization', 'Bearer TOKEN')
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(1);
  });

  it('should return 401 without authentication', async () => {
    await request(app)
      .get('/v1/users')
      .expect(401);
  });
});
```

**2. Integration Tests**

```python
# Example using pytest and requests (Python)
import pytest
import requests

BASE_URL = "https://api.example.com/v1"
TOKEN = "your_test_token"

@pytest.fixture
def headers():
    return {"Authorization": f"Bearer {TOKEN}"}

def test_create_and_retrieve_user(headers):
    # Create user
    user_data = {
        "name": "Test User",
        "email": "test@example.com"
    }
    create_response = requests.post(
        f"{BASE_URL}/users",
        json=user_data,
        headers=headers
    )
    assert create_response.status_code == 201
    user_id = create_response.json()["id"]
    
    # Retrieve user
    get_response = requests.get(
        f"{BASE_URL}/users/{user_id}",
        headers=headers
    )
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Test User"
```

**3. Contract Testing**

```javascript
// Example using Pact (Consumer-driven contracts)
const { Pact } = require('@pact-foundation/pact');

const provider = new Pact({
  consumer: 'FrontendApp',
  provider: 'UserAPI'
});

describe('User API Contract', () => {
  before(() => provider.setup());
  after(() => provider.finalize());

  it('should get user by ID', async () => {
    await provider.addInteraction({
      state: 'user 123 exists',
      uponReceiving: 'a request for user 123',
      withRequest: {
        method: 'GET',
        path: '/v1/users/123',
        headers: { 'Authorization': 'Bearer TOKEN' }
      },
      willRespondWith: {
        status: 200,
        body: {
          id: 123,
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    });

    // Execute test
    const response = await getUserById(123);
    expect(response.id).toBe(123);
  });
});
```



**4. Load Testing**

```javascript
// Example using k6
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, // 100 virtual users
  duration: '30s',
};

export default function () {
  const response = http.get('https://api.example.com/v1/users', {
    headers: { 'Authorization': 'Bearer TOKEN' },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

**5. API Monitoring**

Set up continuous monitoring for production APIs:

- **Uptime monitoring**: Pingdom, UptimeRobot, StatusCake
- **Performance monitoring**: New Relic, Datadog, Grafana
- **Synthetic monitoring**: Run automated tests against production
- **Real user monitoring (RUM)**: Track actual user API calls

### Testing Best Practices

1. **Test happy path and edge cases**: Include valid and invalid inputs
2. **Test authentication and authorization**: Verify security works correctly
3. **Test rate limiting**: Ensure limits are enforced
4. **Test error responses**: Verify error messages and codes
5. **Use test data isolation**: Don't pollute production data
6. **Mock external dependencies**: Keep tests fast and reliable
7. **Test idempotency**: Ensure safe retry behavior
8. **Test pagination**: Verify edge cases (empty, single page, last page)
9. **Validate response schemas**: Ensure consistent format
10. **Monitor performance**: Track response times and set thresholds



---

## Related Files and Tools

### Documentation Files

```
docs/
├── api/
│   ├── README.md              # This guide
│   ├── authentication.md      # Authentication details
│   ├── errors.md             # Error reference
│   ├── rate-limiting.md      # Rate limit policies
│   ├── versioning.md         # Versioning strategy
│   ├── changelog.md          # API changes history
│   ├── openapi.yaml          # OpenAPI specification
│   └── endpoints/
│       ├── users.md
│       ├── products.md
│       └── orders.md
├── getting-started.md        # Quick start guide
└── examples/                 # Code examples by language
    ├── javascript/
    ├── python/
    ├── java/
    └── curl/
```

### Configuration Files

- **`openapi.yaml`**: OpenAPI/Swagger specification
- **`.spectral.yaml`**: API linting rules
- **`postman-collection.json`**: Postman collection export
- **`.env.example`**: Environment variables template

### Development Tools

#### Documentation
- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **ReDoc**: https://github.com/Redocly/redoc
- **Stoplight**: https://stoplight.io/
- **Docusaurus**: https://docusaurus.io/ (for hosting docs)

#### Testing
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **HTTPie**: https://httpie.io/
- **cURL**: https://curl.se/
- **k6**: https://k6.io/ (load testing)
- **Pact**: https://pact.io/ (contract testing)

#### Code Generation
- **OpenAPI Generator**: https://openapi-generator.tech/
- **Swagger Codegen**: https://swagger.io/tools/swagger-codegen/

#### Validation & Linting
- **Spectral**: https://stoplight.io/open-source/spectral
- **OpenAPI Lint**: https://github.com/openapi-contrib/openapi-lint
- **Redocly CLI**: https://redocly.com/docs/cli/

#### Monitoring
- **Postman Monitors**: Automated testing on schedule
- **Runscope**: API monitoring and testing
- **Assertible**: API testing and monitoring



### Integration with Project Workflow

#### Phase 1: Design
- Review `ARCHITECTURE.md` for API design decisions
- Document endpoints using templates from this guide
- Create OpenAPI specification
- Review with team (see `.ai/agents/reviewer.md`)

#### Phase 2: Development
- Implement endpoints following `DEVELOPMENT.md` guidelines
- Generate code from OpenAPI spec (if design-first)
- Write unit tests for each endpoint
- Update documentation alongside code

#### Phase 3: Testing
- Run integration tests
- Perform contract testing
- Test with Postman/Insomnia collections
- Load test critical endpoints
- See `TESTING.md` for full testing strategy

#### Phase 4: Documentation
- Generate Swagger UI documentation
- Update changelog with API changes
- Create code examples for common use cases
- Link to this guide in main README

#### Phase 5: Deployment
- Deploy OpenAPI spec alongside API
- Set up API monitoring
- Configure rate limiting
- Enable access logs

#### Continuous Maintenance
- Update docs with every API change
- Maintain version compatibility
- Monitor API usage and performance
- Deprecate old versions gracefully



---

## Quick Start Checklist

Use this checklist when documenting a new API:

### Initial Setup
- [ ] Create API documentation directory structure
- [ ] Set up OpenAPI specification file
- [ ] Configure documentation hosting (Swagger UI/ReDoc)

### For Each Endpoint
- [ ] Document HTTP method and path
- [ ] Specify authentication requirements
- [ ] List all parameters (path, query, body)
- [ ] Define request body schema with examples
- [ ] Document all possible response codes
- [ ] Provide response body schemas with examples
- [ ] Include cURL example
- [ ] Add usage notes and constraints
- [ ] Specify rate limits

### Cross-Cutting Concerns
- [ ] Document authentication methods
- [ ] Create error codes reference
- [ ] Define rate limiting policy
- [ ] Explain versioning strategy
- [ ] Provide getting started guide
- [ ] Create code examples in target languages

### Testing & Validation
- [ ] Create Postman/Insomnia collection
- [ ] Write automated tests
- [ ] Validate OpenAPI spec with linter
- [ ] Test all documented examples
- [ ] Verify error responses

### Maintenance
- [ ] Set up documentation CI/CD
- [ ] Establish doc review process
- [ ] Create changelog workflow
- [ ] Schedule regular doc audits
- [ ] Monitor API usage to improve docs

---

## Additional Resources

### Official Specifications
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [JSON Schema](https://json-schema.org/)
- [RFC 7231 - HTTP Semantics](https://tools.ietf.org/html/rfc7231)
- [RFC 6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)

### Style Guides
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Google API Design Guide](https://cloud.google.com/apis/design)
- [Stripe API Documentation](https://stripe.com/docs/api) (excellent example)
- [GitHub API Documentation](https://docs.github.com/en/rest) (comprehensive reference)

### Books & Articles
- "RESTful Web APIs" by Leonard Richardson & Mike Amundsen
- "API Design Patterns" by JJ Geewax
- "Designing Web APIs" by Brenda Jin, Saurabh Sahni, Amir Shevat

### Community Resources
- [APIs You Won't Hate](https://apisyouwonthate.com/) - Blog and community
- [API Evangelist](http://apievangelist.com/) - API industry analysis
- [OpenAPI Community](https://www.openapis.org/community) - Specification discussions

---

**Note**: This guide is a living document. Update it as your API evolves and as you discover better practices. Treat documentation as a first-class deliverable, not an afterthought.
