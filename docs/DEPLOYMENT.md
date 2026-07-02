# Deployment Documentation Guide

**Version:** 2.0  
**Last Updated:** 2024  
**Status:** Template Document

> **Prodige boundary:** This template is for human/CD handoff documentation only.
> Prodige agents must not execute production deployment commands, trigger
> production pipelines, apply infrastructure, manage production secrets, or
> mutate live production systems. See `.ai/boundaries/no-production-deploys.md`.

---

## 🎯 What Goes Here

This document is a **TEMPLATE** for comprehensive deployment documentation. It provides a standardized framework for documenting your project's deployment processes, infrastructure, and procedures.

### Purpose

- Provide teams with a complete deployment documentation template
- Standardize deployment documentation across projects
- Ensure critical deployment information is captured and maintained
- Enable consistent deployment processes and reduce errors
- Facilitate knowledge transfer and onboarding

### This is a TEMPLATE

**Important:** This is NOT project-specific documentation. This is a template that teams should:

1. **Copy and customize** for their specific project
2. **Replace all placeholders** (marked with `[brackets]` or descriptive text) with actual project information
3. **Remove sections** that don't apply to their infrastructure
4. **Add sections** for project-specific requirements (custom tools, workflows, integrations)
5. **Keep updated** as deployment processes evolve
6. **Version control** alongside their project code

### How to Use This Template

1. Create a copy of this file in your project's documentation folder
2. Read through each section and fill in your project's specific details
3. Remove example code/commands that don't apply to your stack
4. Add any project-specific deployment steps or considerations
5. Update the version and last updated date at the top
6. Review and update regularly (at least quarterly or after major infrastructure changes)

---

## Table of Contents

- [Environment Overview](#environment-overview)
- [Prerequisites Checklist](#prerequisites-checklist)
- [Environment Setup](#environment-setup)
- [Deployment Process](#deployment-process)
- [Rollback Procedures](#rollback-procedures)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Health Checks and Monitoring](#health-checks-and-monitoring)
- [Security Considerations](#security-considerations)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Related Files and Tools](#related-files-and-tools)

---

## Environment Overview

### Environment Types

Document each environment in your deployment pipeline:

#### Development Environment
- **Purpose**: Local development and testing
- **URL**: `http://localhost:PORT` or `https://dev.yourproject.com`
- **Infrastructure**: Local machine or development server
- **Data**: Mock data or anonymized production subset
- **Access**: All developers

#### Staging Environment
- **Purpose**: Pre-production testing and QA validation
- **URL**: `https://staging.yourproject.com`
- **Infrastructure**: [Cloud provider, region, instance types]
- **Data**: Production-like data (sanitized)
- **Access**: Development team, QA team, stakeholders
- **Features**: Mirrors production configuration

#### Production Environment
- **Purpose**: Live application serving end users
- **URL**: `https://yourproject.com`
- **Infrastructure**: [Cloud provider, region, instance types, scaling configuration]
- **Data**: Live production data
- **Access**: DevOps team, on-call engineers (restricted access)
- **SLA**: [Define uptime requirements, e.g., 99.9%]

### Architecture Overview

Provide a high-level diagram or description:

```
[Load Balancer] → [Application Servers (N instances)]
                ↓
            [Database Cluster]
                ↓
          [Cache Layer (Redis/Memcached)]
                ↓
          [Storage (S3/Object Store)]
```

**Key Components:**
- Load Balancer: [Details]
- Application Servers: [Technology, scaling approach]
- Database: [Type, version, replication setup]
- Cache: [Technology, configuration]
- Storage: [Service, backup strategy]

---

## Prerequisites Checklist

Before deploying, ensure the following are completed:

### Access and Permissions
- [ ] Access to deployment environment (AWS/GCP/Azure/etc.)
- [ ] SSH keys configured for server access
- [ ] VPN access (if required)
- [ ] CI/CD platform access (GitHub Actions/GitLab CI/Jenkins)
- [ ] Database access credentials
- [ ] API keys and secrets available in secret management system

### Technical Requirements
- [ ] Required runtime installed (Node.js, Python, Ruby, etc.)
- [ ] Database client tools installed
- [ ] Cloud CLI tools installed and configured
- [ ] Docker installed (if using containers)
- [ ] Kubernetes CLI (kubectl) configured (if using K8s)

### Code and Configuration
- [ ] Code reviewed and approved
- [ ] All tests passing in CI
- [ ] Database migration scripts reviewed
- [ ] Environment variables documented and configured
- [ ] Feature flags configured (if applicable)
- [ ] Dependencies audited for security vulnerabilities

### Communication and Documentation
- [ ] Deployment scheduled and communicated to stakeholders
- [ ] Deployment notes prepared
- [ ] Rollback plan reviewed
- [ ] On-call engineer identified
- [ ] Monitoring alerts configured

---

## Environment Setup

### Initial Environment Configuration

#### 1. Infrastructure Provisioning

**For Cloud Platforms (AWS/GCP/Azure):**

```bash
# Example using Infrastructure as Code (Terraform)
cd infrastructure/
terraform init
terraform plan -var-file="environments/production.tfvars"
terraform apply -var-file="environments/production.tfvars"
```

**For Kubernetes:**

```bash
# Create namespace
kubectl create namespace production

# Apply configuration
kubectl apply -f k8s/production/ -n production
```


#### 2. Network Configuration

- Configure VPC/Virtual Network
- Set up security groups/firewall rules
- Configure load balancers
- Set up DNS records
- Configure SSL/TLS certificates

#### 3. Database Setup

```bash
# Create database
createdb production_db

# Set up replication (if applicable)
# Configure backup schedules
# Set up connection pooling
```

#### 4. Secret Management

**Using AWS Secrets Manager:**
```bash
aws secretsmanager create-secret \
  --name production/app/secrets \
  --secret-string file://secrets.json
```

**Using Kubernetes Secrets:**
```bash
kubectl create secret generic app-secrets \
  --from-env-file=.env.production \
  -n production
```

#### 5. Monitoring and Logging

- Set up application monitoring (Datadog, New Relic, etc.)
- Configure log aggregation (ELK, Splunk, CloudWatch)
- Set up alerting rules
- Configure dashboards

---

## Deployment Process

### Pre-Deployment Steps

1. **Code Freeze**: Ensure no new commits to release branch
2. **Backup**: Create backups of database and critical data
3. **Communication**: Notify stakeholders of deployment window
4. **Smoke Tests**: Run pre-deployment verification tests

### Deployment Methods

Choose the deployment method appropriate for your infrastructure:


#### Method 1: Manual Deployment

```bash
# 1. SSH into production server
ssh user@production-server

# 2. Navigate to application directory
cd /var/www/application

# 3. Pull latest code
git fetch origin
git checkout tags/v1.2.3  # or specific branch

# 4. Install dependencies
npm install --production  # or pip install -r requirements.txt

# 5. Run database migrations
npm run migrate  # or python manage.py migrate

# 6. Build application (if needed)
npm run build

# 7. Restart application
pm2 restart app  # or systemctl restart app

# 8. Verify deployment
curl http://localhost:PORT/health
```

#### Method 2: Containerized Deployment (Docker)

```bash
# 1. Build Docker image
docker build -t myapp:v1.2.3 .

# 2. Tag for registry
docker tag myapp:v1.2.3 registry.company.com/myapp:v1.2.3
docker tag myapp:v1.2.3 registry.company.com/myapp:latest

# 3. Push to registry
docker push registry.company.com/myapp:v1.2.3
docker push registry.company.com/myapp:latest

# 4. Human/CD deploy to production
docker pull registry.company.com/myapp:v1.2.3
docker stop myapp || true
docker rm myapp || true
docker run -d \
  --name myapp \
  --env-file .env.production \
  -p 80:8080 \
  registry.company.com/myapp:v1.2.3

# 5. Verify
docker logs myapp
curl http://localhost/health
```


#### Method 3: Kubernetes Deployment

```bash
# 1. Update image version in deployment manifest
kubectl set image deployment/myapp \
  myapp=registry.company.com/myapp:v1.2.3 \
  -n production

# Or apply updated manifest
kubectl apply -f k8s/production/deployment.yaml -n production

# 2. Monitor rollout
kubectl rollout status deployment/myapp -n production

# 3. Verify pods are running
kubectl get pods -n production

# 4. Check logs
kubectl logs -f deployment/myapp -n production

# 5. Test service
kubectl port-forward service/myapp 8080:80 -n production
curl http://localhost:8080/health
```

#### Method 4: Blue-Green Deployment

```bash
# 1. Deploy to green environment
deploy-to-green.sh v1.2.3

# 2. Run smoke tests on green
run-tests.sh green

# 3. Switch traffic to green
switch-traffic.sh green

# 4. Monitor green environment
monitor-green.sh

# 5. If successful, decommission blue
# If issues, switch back to blue (see Rollback)
```

#### Method 5: Canary Deployment

```bash
# 1. Deploy new version to canary subset (5-10% of servers)
deploy-canary.sh v1.2.3 --percentage 10

# 2. Monitor canary metrics
monitor-canary.sh v1.2.3

# 3. Gradually increase traffic
increase-canary.sh v1.2.3 --percentage 50

# 4. Full rollout if successful
deploy-full.sh v1.2.3

# 5. Or rollback if issues detected
rollback-canary.sh
```


### Post-Deployment Steps

1. **Verify Health Checks**: Ensure all health endpoints return 200 OK
2. **Run Smoke Tests**: Execute critical path tests
3. **Monitor Logs**: Watch for errors or warnings
4. **Check Metrics**: Verify CPU, memory, response times are normal
5. **Test Key Features**: Manually verify critical functionality
6. **Update Documentation**: Document any deployment issues or notes
7. **Notify Stakeholders**: Confirm successful deployment

---

## Rollback Procedures

### When to Rollback

Initiate a rollback if:
- Critical functionality is broken
- High error rates detected (>5% increase)
- Performance degradation (>50% slower response times)
- Security vulnerabilities discovered
- Data integrity issues
- Cascading failures

### Rollback Decision Tree

```
Issue Detected
    ↓
Can it be hotfixed in <15 minutes?
    ↓ Yes → Apply hotfix → Verify → Continue
    ↓ No
    ↓
Is it affecting users?
    ↓ Yes → ROLLBACK IMMEDIATELY
    ↓ No → Assess severity → Decide rollback vs fix forward
```

### Rollback Methods

#### Method 1: Revert to Previous Version (Manual)

```bash
# 1. SSH into production server
ssh user@production-server

# 2. Navigate to application directory
cd /var/www/application

# 3. Checkout previous stable version
git checkout tags/v1.2.2  # previous version

# 4. Reinstall dependencies
npm install --production

# 5. Rollback database (if needed - see Database Rollback)
npm run migrate:rollback

# 6. Restart application
pm2 restart app

# 7. Verify
curl http://localhost:PORT/health
```


#### Method 2: Docker Rollback

```bash
# 1. Stop current container
docker stop myapp
docker rm myapp

# 2. Run previous version
docker run -d \
  --name myapp \
  --env-file .env.production \
  -p 80:8080 \
  registry.company.com/myapp:v1.2.2

# 3. Verify
docker logs myapp
curl http://localhost/health
```

#### Method 3: Kubernetes Rollback

```bash
# Quick rollback to previous revision
kubectl rollout undo deployment/myapp -n production

# Rollback to specific revision
kubectl rollout history deployment/myapp -n production
kubectl rollout undo deployment/myapp --to-revision=3 -n production

# Verify rollback
kubectl rollout status deployment/myapp -n production
kubectl get pods -n production
```

#### Method 4: Blue-Green Rollback

```bash
# Switch traffic back to blue environment
switch-traffic.sh blue

# Verify traffic routing
verify-traffic.sh blue

# Keep green environment for investigation
```

### Database Rollback

**CRITICAL**: Database rollbacks are complex and risky. Always test rollback procedures.

```bash
# 1. Restore from backup (if data loss is acceptable)
restore-database.sh production_db 2024-01-15T10:00:00

# 2. Run reverse migrations
npm run migrate:rollback
# or
python manage.py migrate app_name previous_migration

# 3. Verify data integrity
run-data-verification.sh
```

### Post-Rollback Steps

1. Notify stakeholders of rollback
2. Create incident report
3. Investigate root cause
4. Fix issues in development
5. Plan re-deployment


---

## CI/CD Pipeline

### Pipeline Overview

Document your continuous integration and deployment pipeline:

```
[Code Commit]
    ↓
[CI Triggers] (GitHub Actions / GitLab CI / Jenkins)
    ↓
[Build & Test Stage]
    ├─ Lint code
    ├─ Run unit tests
    ├─ Run integration tests
    ├─ Security scan
    └─ Build artifacts
    ↓
[Staging Deployment] (Automatic)
    ├─ Deploy to staging
    ├─ Run smoke tests
    └─ Performance tests
    ↓
[Manual Approval] (Production gate)
    ↓
[Production Deployment]
    ├─ Blue-green / Canary
    ├─ Health checks
    └─ Smoke tests
    ↓
[Monitoring & Alerts]
```

### GitHub Actions Example

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests
        run: |
          npm install
          npm test
      
      - name: Build Docker image
        run: docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ${{ env.REGISTRY }} -u ${{ github.actor }} --password-stdin
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          # Deployment commands here
          
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Human/CD deploy to production
        run: |
          # Production deployment commands
```


### GitLab CI Example

**File**: `.gitlab-ci.yml`

```yaml
stages:
  - build
  - test
  - deploy-staging
  - deploy-production

variables:
  DOCKER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH

build:
  stage: build
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA

test:
  stage: test
  script:
    - npm install
    - npm test
    - npm run lint

deploy-staging:
  stage: deploy-staging
  environment:
    name: staging
    url: https://staging.yourproject.com
  script:
    - kubectl set image deployment/myapp myapp=$DOCKER_IMAGE:$CI_COMMIT_SHA -n staging
  only:
    - main

deploy-production:
  stage: deploy-production
  environment:
    name: production
    url: https://yourproject.com
  script:
    - kubectl set image deployment/myapp myapp=$DOCKER_IMAGE:$CI_COMMIT_SHA -n production
  when: manual
  only:
    - tags
```

### Jenkins Pipeline Example

**File**: `Jenkinsfile`

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "myregistry/myapp"
        KUBE_NAMESPACE = "production"
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
                sh 'npm run lint'
            }
        }
        
        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh "kubectl set image deployment/myapp myapp=${DOCKER_IMAGE}:${BUILD_NUMBER} -n staging"
            }
        }
        
        stage('Deploy to Production') {
            when {
                tag "v*"
            }
            steps {
                input message: 'Human/CD deploy to production?'
                sh "kubectl set image deployment/myapp myapp=${DOCKER_IMAGE}:${BUILD_NUMBER} -n production"
            }
        }
    }
    
    post {
        failure {
            // Notify team on failure
            slackSend color: 'danger', message: "Deployment failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        success {
            slackSend color: 'good', message: "Deployment successful: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
    }
}
```


### Pipeline Best Practices

1. **Automated Testing**: Run full test suite before deployment
2. **Security Scanning**: Include vulnerability scanning in pipeline
3. **Artifact Management**: Version and store build artifacts
4. **Environment Parity**: Keep environments as similar as possible
5. **Manual Gates**: Require approval for production deployments
6. **Rollback Capability**: Automate rollback procedures
7. **Notifications**: Alert team of deployment status
8. **Deployment Windows**: Schedule deployments during low-traffic periods

---

## Environment Variables

### Environment Variable Management

**NEVER** commit secrets to version control. Use secret management tools:

### Development (.env.development)

```bash
# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://localhost:5432/myapp_dev
DATABASE_POOL_SIZE=5

# External APIs (use test/sandbox keys)
API_KEY=test_key_123
STRIPE_KEY=sk_test_...

# Features
ENABLE_FEATURE_X=true
```

### Staging (.env.staging)

```bash
# Application
NODE_ENV=staging
PORT=8080
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://staging-db.internal:5432/myapp
DATABASE_POOL_SIZE=10

# External APIs (use test keys)
API_KEY=staging_key_456
STRIPE_KEY=sk_test_...

# Features
ENABLE_FEATURE_X=true
```

### Production (.env.production)

```bash
# Application
NODE_ENV=production
PORT=8080
LOG_LEVEL=warn

# Database (retrieve from secret manager)
DATABASE_URL=${SECRET_DATABASE_URL}
DATABASE_POOL_SIZE=20
DATABASE_SSL=true

# External APIs (use production keys from secret manager)
API_KEY=${SECRET_API_KEY}
STRIPE_KEY=${SECRET_STRIPE_KEY}

# Features
ENABLE_FEATURE_X=true
```


### Secret Management Solutions

#### AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name production/database/password \
  --secret-string "super-secure-password"

# Retrieve secret in application
aws secretsmanager get-secret-value \
  --secret-id production/database/password \
  --query SecretString \
  --output text
```

#### HashiCorp Vault

```bash
# Store secret
vault kv put secret/production/database password="super-secure-password"

# Retrieve secret
vault kv get -field=password secret/production/database
```

#### Kubernetes Secrets

```bash
# Create secret from file
kubectl create secret generic app-secrets \
  --from-env-file=.env.production \
  -n production

# Reference in deployment
# See k8s deployment manifests for usage
```

### Environment Variable Checklist

Document all required environment variables:

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `NODE_ENV` | Environment name | Yes | - | `production` |
| `PORT` | Application port | Yes | 8080 | `8080` |
| `DATABASE_URL` | Database connection | Yes | - | `postgresql://...` |
| `API_KEY` | External API key | Yes | - | `sk_prod_...` |
| `LOG_LEVEL` | Logging verbosity | No | `info` | `warn` |
| `ENABLE_FEATURE_X` | Feature flag | No | `false` | `true` |

---

## Database Migrations

### Migration Strategy

**Golden Rule**: Migrations must be backward compatible during deployment.

### Migration Workflow

```
[Write Migration] → [Test Locally] → [Review] → [Deploy to Staging] → [Verify] → [Deploy to Production]
```

### Forward Migration Process

#### Step 1: Create Migration

```bash
# Generate migration
npm run migrate:generate -- add-user-email-column
# or
python manage.py makemigrations
```

#### Step 2: Review Migration

```sql
-- Example migration: 001_add_user_email.sql
-- UP Migration
ALTER TABLE users ADD COLUMN email VARCHAR(255);
CREATE INDEX idx_users_email ON users(email);

-- DOWN Migration (for rollback)
DROP INDEX idx_users_email;
ALTER TABLE users DROP COLUMN email;
```

#### Step 3: Test Migration

```bash
# Test up migration
npm run migrate:up

# Test down migration
npm run migrate:down

# Test idempotency (run twice)
npm run migrate:up
npm run migrate:up
```


#### Step 4: Deploy Migration

```bash
# Backup database first
pg_dump -h production-db -U user -d myapp > backup_$(date +%Y%m%d_%H%M%S).sql

# Run migration
npm run migrate:up
# or
python manage.py migrate

# Verify migration
psql -h production-db -U user -d myapp -c "\d users"
```

### Migration Best Practices

1. **Backward Compatibility**: New code must work with old schema during deployment
2. **Separate Deployments**: Deploy schema changes before code changes
3. **No Data Loss**: Never drop columns with data without backup
4. **Incremental Changes**: Break large migrations into smaller steps
5. **Test Rollback**: Always test down migrations
6. **Performance**: Test migrations on production-sized datasets
7. **Timing**: Run heavy migrations during low-traffic windows

### Complex Migration Example: Renaming a Column

**Problem**: Renaming `name` to `full_name` requires zero-downtime strategy

**Solution**: Multi-phase deployment

```sql
-- Phase 1: Add new column (backward compatible)
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
UPDATE users SET full_name = name WHERE full_name IS NULL;

-- Deploy code that writes to both columns
-- Wait for deployment to complete

-- Phase 2: Backfill and verify
UPDATE users SET full_name = name WHERE full_name IS NULL;

-- Deploy code that reads from new column
-- Wait for deployment to complete

-- Phase 3: Drop old column (in next release)
ALTER TABLE users DROP COLUMN name;
```

### Migration Tools by Platform

- **Node.js**: Knex.js, Sequelize, TypeORM, Prisma
- **Python**: Alembic (SQLAlchemy), Django migrations
- **Ruby**: ActiveRecord migrations
- **Go**: golang-migrate, goose
- **Java**: Flyway, Liquibase

---

## Health Checks and Monitoring

### Health Check Endpoints

Implement standardized health check endpoints:

#### Basic Health Check

```javascript
// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
```


#### Detailed Health Check

```javascript
// GET /health/detailed
app.get('/health/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalAPI: await checkExternalAPI(),
      diskSpace: await checkDiskSpace()
    }
  };
  
  const allHealthy = Object.values(health.checks).every(c => c.status === 'healthy');
  const statusCode = allHealthy ? 200 : 503;
  
  res.status(statusCode).json(health);
});

async function checkDatabase() {
  try {
    await db.query('SELECT 1');
    return { status: 'healthy', responseTime: '5ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

#### Readiness vs Liveness Probes

**Liveness Probe**: Is the application running?
```javascript
// GET /health/live
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});
```

**Readiness Probe**: Is the application ready to serve traffic?
```javascript
// GET /health/ready
app.get('/health/ready', async (req, res) => {
  const ready = await checkDatabaseConnection() && await checkRequiredServices();
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not ready' });
});
```

### Monitoring Setup

#### Application Metrics

Monitor these key metrics:

**Performance Metrics:**
- Request rate (requests per second)
- Response time (p50, p95, p99)
- Error rate (percentage of failed requests)
- Throughput (data processed per second)

**Resource Metrics:**
- CPU usage (percentage)
- Memory usage (MB/GB)
- Disk I/O (read/write operations)
- Network I/O (bandwidth usage)

**Business Metrics:**
- User sign-ups
- Transactions completed
- Revenue generated
- Feature usage

#### Monitoring Tools Configuration

**Prometheus + Grafana:**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
```


**Datadog Configuration:**

```javascript
const StatsD = require('node-dogstatsd').StatsD;
const dogstatsd = new StatsD('localhost', 8125);

// Track metrics
dogstatsd.increment('page.views');
dogstatsd.histogram('request.duration', 256);
dogstatsd.gauge('users.online', 1000);
```

**New Relic Configuration:**

```javascript
// newrelic.js
exports.config = {
  app_name: ['My Application'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  }
};
```

### Logging Strategy

**Log Levels:**
- `ERROR`: Application errors requiring immediate attention
- `WARN`: Warning conditions that should be reviewed
- `INFO`: General informational messages
- `DEBUG`: Detailed debugging information (dev/staging only)

**Structured Logging Example:**

```javascript
const logger = require('winston');

logger.info('User logged in', {
  userId: 12345,
  email: 'user@example.com',
  timestamp: new Date().toISOString(),
  ipAddress: req.ip
});
```

**Log Aggregation:**
- Centralize logs using ELK Stack, Splunk, or CloudWatch
- Set up log retention policies (e.g., 30 days)
- Create alerts for error patterns

### Alerting Rules

Define alerting thresholds:

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Error rate | >1% | >5% | Investigate/Rollback |
| Response time (p95) | >500ms | >2s | Scale up/Optimize |
| CPU usage | >70% | >90% | Scale up |
| Memory usage | >75% | >90% | Scale up/Check leaks |
| Disk space | <20% free | <10% free | Clean up/Expand |
| Failed health checks | 2 consecutive | 5 consecutive | Restart/Investigate |

**Alert Channels:**
- PagerDuty for critical alerts
- Slack for warnings
- Email for summaries

---

## Security Considerations

### Pre-Deployment Security Checklist

- [ ] All dependencies scanned for vulnerabilities
- [ ] Secrets removed from codebase
- [ ] HTTPS/TLS enabled
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Authentication/authorization tested
- [ ] Security logging enabled


### Security Best Practices

#### 1. Dependency Security

```bash
# Scan for vulnerabilities
npm audit
# or
pip check
# or
bundle audit

# Fix vulnerabilities
npm audit fix
```

#### 2. Secret Management

**DON'T:**
```javascript
const apiKey = 'sk_prod_abc123xyz'; // NEVER hardcode secrets
```

**DO:**
```javascript
const apiKey = process.env.API_KEY; // Read from environment
```

#### 3. Security Headers

```javascript
// Express.js example with helmet
const helmet = require('helmet');
app.use(helmet());

// Manual configuration
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

#### 4. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### 5. Database Security

- Use parameterized queries (prevent SQL injection)
- Enable SSL/TLS for database connections
- Use read-only database users where possible
- Implement connection pooling with limits
- Regular security audits and patching

#### 6. Network Security

- Configure firewalls to allow only necessary ports
- Use VPCs/Virtual Networks to isolate resources
- Implement WAF (Web Application Firewall)
- Enable DDoS protection
- Use private subnets for databases

### Security Monitoring

- Monitor failed login attempts
- Track unusual API usage patterns
- Alert on privilege escalation attempts
- Log all access to sensitive resources
- Regular security audits and penetration testing

---

## Post-Deployment Verification

### Verification Checklist

Complete these checks after every deployment:

#### 1. Health Checks (2-5 minutes)

```bash
# Basic health check
curl https://yourproject.com/health

# Expected: {"status":"healthy"}

# Detailed health check
curl https://yourproject.com/health/detailed

# Verify all components are healthy
```


#### 2. Smoke Tests (5-10 minutes)

Run critical path tests:

```bash
# Run automated smoke tests
npm run test:smoke

# Or manual checks:
# - User can log in
# - User can view dashboard
# - User can perform core action (e.g., create order)
# - API endpoints respond correctly
# - Static assets load
```

#### 3. Performance Verification (10-15 minutes)

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourproject.com/api/endpoint

# Load test (if applicable)
ab -n 1000 -c 10 https://yourproject.com/

# Monitor metrics dashboard
# - Response times within acceptable range
# - Error rate < 0.1%
# - CPU/Memory usage normal
```

#### 4. Log Verification (5 minutes)

```bash
# Check application logs for errors
tail -f /var/log/app/production.log

# Or in Kubernetes
kubectl logs -f deployment/myapp -n production

# Look for:
# - No ERROR level logs
# - Application started successfully
# - Database connections established
# - External service connections working
```

#### 5. Database Verification (5 minutes)

```bash
# Verify migrations applied
npm run migrate:status

# Check database connectivity
psql -h production-db -U user -d myapp -c "SELECT version();"

# Verify critical data integrity (if applicable)
psql -h production-db -U user -d myapp -c "SELECT COUNT(*) FROM users;"
```

#### 6. Feature Verification (10-20 minutes)

Manually test new features:
- [ ] Feature X works as expected
- [ ] No regression in existing features
- [ ] UI displays correctly
- [ ] Mobile responsiveness maintained
- [ ] Cross-browser compatibility (if applicable)

#### 7. Monitoring Dashboard Check (5 minutes)

Review dashboards:
- [ ] All services showing green
- [ ] No spike in error rates
- [ ] Response times normal
- [ ] Resource usage within limits
- [ ] No alerts triggered

### Automated Verification Script

```bash
#!/bin/bash
# verify-deployment.sh

echo "Starting post-deployment verification..."

# Health check
echo "1. Health check..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://yourproject.com/health)
if [ $HEALTH -ne 200 ]; then
  echo "❌ Health check failed (HTTP $HEALTH)"
  exit 1
fi
echo "✅ Health check passed"

# Smoke tests
echo "2. Running smoke tests..."
npm run test:smoke
if [ $? -ne 0 ]; then
  echo "❌ Smoke tests failed"
  exit 1
fi
echo "✅ Smoke tests passed"

# Performance check
echo "3. Performance check..."
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://yourproject.com)
if (( $(echo "$RESPONSE_TIME > 2.0" | bc -l) )); then
  echo "⚠️  Response time high: ${RESPONSE_TIME}s"
else
  echo "✅ Response time good: ${RESPONSE_TIME}s"
fi

echo "🎉 Deployment verification complete!"
```

---

## Troubleshooting

### Common Deployment Issues

#### Issue 1: Application Won't Start

**Symptoms:**
- Container/service fails to start
- Health checks failing
- Application crashes immediately

**Diagnosis:**
```bash
# Check logs
kubectl logs deployment/myapp -n production
# or
docker logs myapp
# or
tail -f /var/log/app/error.log

# Check application status
systemctl status myapp
```

**Common Causes & Solutions:**

1. **Missing Environment Variables**
   ```bash
   # Verify all required env vars are set
   printenv | grep DATABASE_URL
   # Add missing variables to environment configuration
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :8080
   # Kill the process or use different port
   ```

3. **Insufficient Permissions**
   ```bash
   # Check file permissions
   ls -la /var/www/app
   # Fix permissions
   chown -R appuser:appuser /var/www/app
   ```

#### Issue 2: Database Connection Failures

**Symptoms:**
- "Connection refused" errors
- "Too many connections" errors
- Timeout errors

**Diagnosis:**
```bash
# Test database connectivity
psql -h production-db -U user -d myapp

# Check connection pool
psql -h production-db -U user -d myapp -c "SELECT COUNT(*) FROM pg_stat_activity;"
```

**Solutions:**

1. **Connection Pool Exhausted**
   - Increase pool size: `DATABASE_POOL_SIZE=20`
   - Fix connection leaks in code

2. **Network Connectivity**
   ```bash
   # Test network connectivity
   telnet production-db 5432
   ping production-db
   # Check security groups/firewall rules
   ```

3. **Wrong Credentials**
   - Verify credentials in secret manager
   - Check DATABASE_URL format


#### Issue 3: High Memory Usage / OOM Errors

**Symptoms:**
- Application crashes with "Out of Memory" error
- Kubernetes pod restarts frequently
- Slow performance

**Diagnosis:**
```bash
# Check memory usage
free -h
# or for containers
docker stats myapp
# or for Kubernetes
kubectl top pod myapp -n production

# Check for memory leaks
node --inspect app.js
# Use Chrome DevTools to profile memory
```

**Solutions:**

1. **Increase Memory Limits**
   ```yaml
   # Kubernetes
   resources:
     limits:
       memory: "2Gi"
     requests:
       memory: "1Gi"
   ```

2. **Fix Memory Leaks**
   - Profile application to identify leaks
   - Check for uncleared timers/intervals
   - Review event listener cleanup

3. **Optimize Code**
   - Implement pagination for large datasets
   - Use streaming for large file processing
   - Clear caches periodically

#### Issue 4: 502/504 Gateway Errors

**Symptoms:**
- Intermittent 502 Bad Gateway
- 504 Gateway Timeout
- Users can't access application

**Diagnosis:**
```bash
# Check load balancer health checks
aws elb describe-target-health --target-group-arn arn:...

# Check backend servers
curl http://backend-server:8080/health

# Check logs
tail -f /var/log/nginx/error.log
```

**Solutions:**

1. **Backend Server Down**
   - Restart application servers
   - Check health check endpoint

2. **Timeout Too Short**
   - Increase timeout in load balancer/proxy config
   ```nginx
   proxy_read_timeout 300s;
   proxy_connect_timeout 75s;
   ```

3. **Backend Overloaded**
   - Scale up number of instances
   - Implement caching
   - Optimize slow queries


#### Issue 5: Static Assets Not Loading (404 Errors)

**Symptoms:**
- CSS/JS files return 404
- Images not displaying
- Broken styling

**Solutions:**

1. **Build Assets**
   ```bash
   npm run build
   # Verify dist/public folder exists
   ls -la dist/
   ```

2. **Check Web Server Configuration**
   ```nginx
   # Nginx example
   location /static/ {
       alias /var/www/app/dist/;
       expires 1y;
   }
   ```

3. **Verify CDN Configuration**
   - Check CDN cache status
   - Invalidate CDN cache if needed
   - Verify CORS headers

#### Issue 6: Migration Failures

**Symptoms:**
- Migration script fails
- Database schema mismatch
- Application errors after deployment

**Diagnosis:**
```bash
# Check migration status
npm run migrate:status

# View migration errors
npm run migrate:up --verbose
```

**Solutions:**

1. **Rollback Failed Migration**
   ```bash
   npm run migrate:rollback
   # Fix migration script
   npm run migrate:up
   ```

2. **Manual Intervention Required**
   ```bash
   # Connect to database
   psql -h production-db -U user -d myapp
   # Manually fix schema
   # Mark migration as complete
   ```

### Debugging Tools

```bash
# System resource monitoring
top
htop
vmstat 1

# Network debugging
netstat -tuln
ss -tuln
tcpdump -i eth0

# Process debugging
ps aux | grep myapp
strace -p <pid>

# Container debugging
docker exec -it myapp /bin/bash
kubectl exec -it myapp-pod -n production -- /bin/bash

# Log streaming
journalctl -u myapp -f
kubectl logs -f deployment/myapp -n production --tail=100
```

### Emergency Contacts

Maintain a list of contacts for deployment emergencies:

- **DevOps Lead**: John Doe - john@company.com - +1-555-0100
- **Database Admin**: Jane Smith - jane@company.com - +1-555-0101
- **Security Team**: security@company.com - +1-555-0102
- **On-Call Rotation**: Use PagerDuty schedule

---

## Related Files and Tools

### Project Files

Document the location of deployment-related files:

```
project/
├── .github/
│   └── workflows/
│       ├── deploy-staging.yml      # Staging deployment pipeline
│       └── deploy-production.yml   # Production deployment pipeline
├── .gitlab-ci.yml                  # GitLab CI/CD configuration
├── Jenkinsfile                     # Jenkins pipeline definition
├── docker-compose.yml              # Docker composition for local dev
├── Dockerfile                      # Container image definition
├── infrastructure/
│   ├── terraform/                  # Infrastructure as Code
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── environments/
│   │       ├── staging.tfvars
│   │       └── production.tfvars
│   └── ansible/                    # Configuration management
│       ├── playbooks/
│       └── inventory/
├── k8s/                           # Kubernetes manifests
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   └── overlays/
│       ├── staging/
│       └── production/
├── scripts/
│   ├── deploy.sh                  # Deployment script
│   ├── rollback.sh                # Rollback script
│   ├── verify-deployment.sh       # Post-deployment verification
│   └── backup-database.sh         # Database backup script
├── migrations/                    # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_add_users_table.sql
│   └── ...
├── .env.example                   # Environment variables template
└── docs/
    ├── DEPLOYMENT.md             # This file
    ├── RUNBOOK.md               # Operations runbook
    └── ARCHITECTURE.md          # System architecture
```

### Configuration Files

#### Docker Compose (docker-compose.yml)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```


#### Kubernetes Deployment (k8s/production/deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: registry.company.com/myapp:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
```

### Essential Tools

Document the tools required for deployment:

#### Command-Line Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| `kubectl` | Kubernetes management | `brew install kubectl` |
| `docker` | Container management | `brew install docker` |
| `terraform` | Infrastructure as Code | `brew install terraform` |
| `aws-cli` | AWS management | `brew install awscli` |
| `gcloud` | GCP management | `brew install google-cloud-sdk` |
| `psql` | PostgreSQL client | `brew install postgresql` |
| `redis-cli` | Redis client | `brew install redis` |
| `jq` | JSON processing | `brew install jq` |
| `curl` | HTTP testing | (usually pre-installed) |

#### Monitoring & Debugging Tools

- **Grafana**: Metrics visualization - https://grafana.yourcompany.com
- **Prometheus**: Metrics collection - https://prometheus.yourcompany.com
- **Kibana**: Log analysis - https://kibana.yourcompany.com
- **Datadog**: APM and monitoring - https://app.datadoghq.com
- **PagerDuty**: Incident management - https://yourcompany.pagerduty.com
- **Sentry**: Error tracking - https://sentry.io/yourcompany

#### Access & Credentials

- **AWS Console**: https://console.aws.amazon.com
- **GCP Console**: https://console.cloud.google.com
- **Azure Portal**: https://portal.azure.com
- **Secret Manager**: [Your secret management solution]
- **CI/CD Platform**: [GitHub Actions / GitLab / Jenkins URL]

---
ication started successfully
# - Database connections established
# - External service connections working
```

#### 5. Database Verification (5 minutes)

```bash
# Verify migrations applied
npm run migrate:status

# Check database connectivity
psql -h production-db -U user -d myapp -c "SELECT version();"

# Verify critical data integrity (if applicable)
psql -h production-db -U user -d myapp -c "SELECT COUNT(*) FROM users;"
```

#### 6. Feature Verification (10-20 minutes)

Manually test new features:
- [ ] Feature X works as expected
- [ ] No regression in existing features
- [ ] UI displays correctly
- [ ] Mobile responsiveness maintained
- [ ] Cross-browser compatibility (if applicable)

#### 7. Monitoring Dashboard Check (5 minutes)

Review dashboards:
- [ ] All services showing green
- [ ] No spike in error rates
- [ ] Response times normal
- [ ] Resource usage within limits
- [ ] No alerts triggered

### Automated Verification Script

Create an automated verification script:

```bash
#!/bin/bash
# deploy-verify.sh

echo "Starting post-deployment verification..."

# Health check
echo "1. Checking health endpoint..."
HEALTH=$(curl -s https://yourproject.com/health | jq -r '.status')
if [ "$HEALTH" != "healthy" ]; then
  echo "❌ Health check failed!"
  exit 1
fi
echo "✓ Health check passed"

# Run smoke tests
echo "2. Running smoke tests..."
npm run test:smoke
if [ $? -ne 0 ]; then
  echo "❌ Smoke tests failed!"
  exit 1
fi
echo "✓ Smoke tests passed"

# Check error rate
echo "3. Checking error rate..."
ERROR_RATE=$(curl -s "https://metrics.yourproject.com/api/error-rate" | jq -r '.rate')
if (( $(echo "$ERROR_RATE > 1.0" | bc -l) )); then
  echo "❌ Error rate too high: $ERROR_RATE%"
  exit 1
fi
echo "✓ Error rate normal: $ERROR_RATE%"

echo "✅ All verification checks passed!"
```

---

## Troubleshooting

### Common Deployment Issues

#### Issue: Application Won't Start

**Symptoms:**
- Container/service repeatedly crashing
- "Cannot connect" errors
- Health check failures

**Diagnosis:**
```bash
# Check logs
kubectl logs deployment/myapp -n production
# or
docker logs myapp
# or
journalctl -u myapp -n 100

# Check environment variables
kubectl exec deployment/myapp -n production -- env
```

**Common Causes & Solutions:**
- Missing environment variables → Verify all required env vars are set
- Database connection failure → Check DATABASE_URL, network connectivity
- Port conflict → Verify port is not already in use
- Insufficient resources → Check memory/CPU limits
- Failed migrations → Rollback or fix migration, redeploy

---

#### Issue: 502 Bad Gateway

**Symptoms:**
- Load balancer returns 502
- Intermittent connection failures

**Diagnosis:**
```bash
# Check if application is running
kubectl get pods -n production
docker ps

# Check application logs
kubectl logs deployment/myapp -n production --tail=100

# Test application directly (bypass load balancer)
kubectl port-forward deployment/myapp 8080:80 -n production
curl http://localhost:8080/health
```

**Common Causes & Solutions:**
- Application crashed → Check logs, restart service
- Health check failing → Fix health check endpoint
- Timeout too short → Increase load balancer timeout
- App listening on wrong port → Verify PORT environment variable

---

#### Issue: Database Connection Errors

**Symptoms:**
- "ECONNREFUSED" errors
- "Connection timeout" errors
- Database query failures

**Diagnosis:**
```bash
# Test database connectivity from application pod
kubectl exec deployment/myapp -n production -- \
  psql $DATABASE_URL -c "SELECT 1;"

# Check database status
kubectl get pods -n production -l app=database

# Check connection pool
# Review application metrics
```

**Common Causes & Solutions:**
- Wrong DATABASE_URL → Verify connection string
- Database not running → Check database service status
- Network policy blocking → Review security groups/firewall rules
- Connection pool exhausted → Increase pool size or fix connection leaks
- Authentication failure → Verify credentials

---

#### Issue: High Memory Usage / Memory Leaks

**Symptoms:**
- Application crashes with OOM (Out of Memory)
- Gradually increasing memory usage
- Slow performance over time

**Diagnosis:**
```bash
# Monitor memory usage
kubectl top pods -n production

# Get detailed metrics
kubectl describe pod <pod-name> -n production

# Generate heap dump (Node.js)
kubectl exec deployment/myapp -n production -- \
  node --heap-prof index.js
```

**Common Causes & Solutions:**
- Memory leak in code → Use profiling tools, fix leaks
- Insufficient memory allocation → Increase memory limits
- Large payloads → Implement streaming, pagination
- Unclosed connections → Ensure connections are properly closed

---

#### Issue: Slow Performance / High Response Times

**Symptoms:**
- Response times >2 seconds
- Timeout errors
- User complaints about slowness

**Diagnosis:**
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourproject.com/api/endpoint

# Check database query performance
psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Check application metrics
# Review APM dashboard (New Relic, Datadog, etc.)
```

**Common Causes & Solutions:**
- Unoptimized database queries → Add indexes, optimize queries
- N+1 query problem → Use eager loading
- External API latency → Add caching, timeout limits
- Insufficient resources → Scale horizontally/vertically
- Missing cache → Implement Redis/Memcached caching

---

#### Issue: Deployment Stuck / Not Rolling Out

**Symptoms:**
- Kubernetes rollout stuck at X%
- New pods not starting
- Old pods not terminating

**Diagnosis:**
```bash
# Check rollout status
kubectl rollout status deployment/myapp -n production

# Check pod status
kubectl get pods -n production

# Describe problem pods
kubectl describe pod <pod-name> -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'
```

**Common Causes & Solutions:**
- Image pull error → Verify image tag, registry credentials
- Resource limits → Check cluster resources, increase limits
- Failed health checks → Fix health check or application
- PodDisruptionBudget blocking → Review PDB settings
- Insufficient nodes → Scale cluster

---

#### Issue: SSL/TLS Certificate Errors

**Symptoms:**
- "Certificate expired" errors
- "Certificate invalid" warnings
- HTTPS not working

**Diagnosis:**
```bash
# Check certificate expiry
echo | openssl s_client -servername yourproject.com \
  -connect yourproject.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Check certificate details
kubectl get certificate -n production
kubectl describe certificate myapp-tls -n production
```

**Common Causes & Solutions:**
- Certificate expired → Renew certificate
- Wrong certificate → Verify certificate matches domain
- Certificate not updated → Restart ingress/load balancer
- cert-manager issue (K8s) → Check cert-manager logs

---

#### Issue: Environment Variable Not Being Applied

**Symptoms:**
- Application using default values
- Feature flags not working
- Wrong configuration

**Diagnosis:**
```bash
# Check environment variables in running container
kubectl exec deployment/myapp -n production -- env | grep VARIABLE_NAME
# or
docker exec myapp env | grep VARIABLE_NAME

# Check secret/configmap
kubectl get secret app-secrets -n production -o yaml
kubectl get configmap app-config -n production -o yaml
```

**Common Causes & Solutions:**
- Typo in variable name → Fix typo, redeploy
- Secret not mounted → Check deployment manifest
- Need to restart → Restart pods to pick up new values
- Wrong namespace → Verify secret exists in correct namespace

---

### Debug Commands Cheat Sheet

#### Docker

```bash
# View logs
docker logs myapp
docker logs -f --tail=100 myapp

# Execute command in container
docker exec -it myapp /bin/bash
docker exec myapp env

# Inspect container
docker inspect myapp

# Check resource usage
docker stats myapp

# View container processes
docker top myapp
```

#### Kubernetes

```bash
# View logs
kubectl logs deployment/myapp -n production
kubectl logs -f deployment/myapp -n production --tail=100
kubectl logs <pod-name> -n production --previous  # Previous container logs

# Execute command in pod
kubectl exec -it deployment/myapp -n production -- /bin/bash
kubectl exec deployment/myapp -n production -- env

# Describe resources
kubectl describe pod <pod-name> -n production
kubectl describe deployment myapp -n production

# Check resource usage
kubectl top pods -n production
kubectl top nodes

# Port forward for testing
kubectl port-forward deployment/myapp 8080:80 -n production

# View events
kubectl get events -n production --sort-by='.lastTimestamp'

# Rollout management
kubectl rollout history deployment/myapp -n production
kubectl rollout undo deployment/myapp -n production
```

#### Database (PostgreSQL)

```bash
# Connect to database
psql -h hostname -U username -d database

# Check connections
SELECT * FROM pg_stat_activity;

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

# Check indexes
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

## Deployment Checklist

Use this checklist for human/CD-managed production deployments. Prodige may
prepare this checklist but must not execute deployment steps.

### Pre-Deployment (T-24 hours)

- [ ] All code merged and reviewed
- [ ] All tests passing in CI/CD
- [ ] Staging environment deployed and tested
- [ ] Database migrations reviewed and tested
- [ ] Rollback plan documented
- [ ] Deployment window scheduled
- [ ] Stakeholders notified
- [ ] On-call engineer assigned
- [ ] Monitoring alerts configured
- [ ] Security scan completed
- [ ] Dependencies audit completed
- [ ] Deployment runbook reviewed

### Deployment (T-0)

- [ ] Database backup completed
- [ ] Pre-deployment health check passed
- [ ] Code freeze in effect
- [ ] Human/CD pipeline initiated production deployment
- [ ] Deployment progress monitored
- [ ] Application restarted/rolled out
- [ ] Health checks passing
- [ ] Smoke tests passing

### Post-Deployment (T+1 hour)

- [ ] All health endpoints returning 200 OK
- [ ] Automated tests passing
- [ ] Key features manually verified
- [ ] Error rates normal (<0.1%)
- [ ] Response times normal
- [ ] Resource usage normal
- [ ] No critical errors in logs
- [ ] Monitoring dashboards green
- [ ] Database performance normal
- [ ] Stakeholders notified of success

### Post-Deployment (T+24 hours)

- [ ] No user-reported issues
- [ ] Metrics stable over 24 hours
- [ ] No abnormal patterns in logs
- [ ] Deployment notes documented
- [ ] Incident reports filed (if any)
- [ ] Lessons learned documented
- [ ] Rollback artifacts cleaned up (if applicable)

---

## Example Deployment Workflows

### Example 1: Node.js Application with Docker to AWS ECS

```bash
#!/bin/bash
# deploy-to-ecs.sh

set -e  # Exit on error

VERSION=$1
REGION="us-east-1"
CLUSTER="production"
SERVICE="myapp"
ECR_REPO="123456789.dkr.ecr.us-east-1.amazonaws.com/myapp"

echo "Deploying version $VERSION to ECS..."

# 1. Build Docker image
echo "Building Docker image..."
docker build -t myapp:$VERSION .

# 2. Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_REPO

# 3. Tag and push image
echo "Pushing image to ECR..."
docker tag myapp:$VERSION $ECR_REPO:$VERSION
docker tag myapp:$VERSION $ECR_REPO:latest
docker push $ECR_REPO:$VERSION
docker push $ECR_REPO:latest

# 4. Update ECS service
echo "Updating ECS service..."
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --force-new-deployment \
  --region $REGION

# 5. Wait for deployment to complete
echo "Waiting for deployment..."
aws ecs wait services-stable \
  --cluster $CLUSTER \
  --services $SERVICE \
  --region $REGION

# 6. Verify deployment
echo "Verifying deployment..."
HEALTH=$(curl -s https://myapp.com/health | jq -r '.status')
if [ "$HEALTH" != "healthy" ]; then
  echo "❌ Health check failed!"
  exit 1
fi

echo "✅ Deployment successful!"
```

---

### Example 2: Python Django Application to Kubernetes

```bash
#!/bin/bash
# deploy-django-k8s.sh

set -e

VERSION=$1
NAMESPACE="production"
APP_NAME="myapp"
REGISTRY="gcr.io/my-project"

echo "Deploying Django app version $VERSION..."

# 1. Build image
echo "Building Docker image..."
docker build -t $APP_NAME:$VERSION .

# 2. Tag for GCR
echo "Tagging image..."
docker tag $APP_NAME:$VERSION $REGISTRY/$APP_NAME:$VERSION

# 3. Push to registry
echo "Pushing to GCR..."
docker push $REGISTRY/$APP_NAME:$VERSION

# 4. Run database migrations
echo "Running database migrations..."
kubectl run django-migrate-$VERSION \
  --image=$REGISTRY/$APP_NAME:$VERSION \
  --restart=Never \
  --namespace=$NAMESPACE \
  --command -- python manage.py migrate

# Wait for migration to complete
kubectl wait --for=condition=complete \
  --timeout=300s \
  job/django-migrate-$VERSION \
  --namespace=$NAMESPACE

# 5. Update deployment
echo "Updating Kubernetes deployment..."
kubectl set image deployment/$APP_NAME \
  $APP_NAME=$REGISTRY/$APP_NAME:$VERSION \
  --namespace=$NAMESPACE

# 6. Monitor rollout
echo "Monitoring rollout..."
kubectl rollout status deployment/$APP_NAME --namespace=$NAMESPACE

# 7. Run post-deployment checks
echo "Running smoke tests..."
kubectl run smoke-test-$VERSION \
  --image=$REGISTRY/$APP_NAME:$VERSION \
  --restart=Never \
  --namespace=$NAMESPACE \
  --command -- python manage.py test smoke_tests

echo "✅ Deployment complete!"
```

---

### Example 3: Static Site to S3 + CloudFront

```bash
#!/bin/bash
# deploy-static-site.sh

set -e

BUCKET="my-website-prod"
DISTRIBUTION_ID="E1234567890ABC"
BUILD_DIR="build"

echo "Deploying static site..."

# 1. Build the site
echo "Building site..."
npm run build

# 2. Sync to S3
echo "Syncing to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET \
  --delete \
  --cache-control "public, max-age=31536000"

# 3. Upload index.html separately (no cache)
echo "Uploading index.html..."
aws s3 cp $BUILD_DIR/index.html s3://$BUCKET/index.html \
  --cache-control "no-cache"

# 4. Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

# 5. Verify deployment
echo "Verifying deployment..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://mywebsite.com)
if [ "$HTTP_STATUS" != "200" ]; then
  echo "❌ Site not accessible!"
  exit 1
fi

echo "✅ Deployment successful!"
```

---

## Related Files and Tools

### Documentation References

- [SETUP.md](./SETUP.md) - Initial project setup instructions
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow and guidelines
- [API.md](./API.md) - API documentation
- [RELEASE.md](./RELEASE.md) - Release process and versioning

### Infrastructure as Code

- `infrastructure/` - Terraform/CloudFormation templates
- `k8s/` - Kubernetes manifests
- `docker-compose.yml` - Docker Compose configuration
- `.github/workflows/` - GitHub Actions CI/CD pipelines

### Configuration Files

- `.env.example` - Example environment variables
- `Dockerfile` - Container image definition
- `k8s/production/` - Production Kubernetes configs
- `nginx.conf` - Web server configuration

### Deployment Scripts

- `scripts/deploy.sh` - Main deployment script
- `scripts/rollback.sh` - Rollback script
- `scripts/migrate.sh` - Database migration script
- `scripts/verify.sh` - Post-deployment verification

### Monitoring and Alerting

- Monitoring Dashboard: [https://monitoring.yourproject.com]
- Log Aggregation: [https://logs.yourproject.com]
- APM Dashboard: [https://apm.yourproject.com]
- Status Page: [https://status.yourproject.com]

---

## Additional Resources

### Cloud Platform Guides

- [AWS Deployment Best Practices](https://aws.amazon.com/architecture/well-architected/)
- [GCP Deployment Manager](https://cloud.google.com/deployment-manager/docs)
- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)

### Container Orchestration

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)

### CI/CD Tools

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [CircleCI Documentation](https://circleci.com/docs/)

### Monitoring and Observability

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Datadog Guides](https://docs.datadoghq.com/)
- [New Relic Documentation](https://docs.newrelic.com/)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2024 | [Your Team] | Complete rewrite as comprehensive template |
| 1.0 | [Date] | [Author] | Initial version |

---

## Support and Contact

**Deployment Issues:**
- On-call Engineer: [Contact method]
- DevOps Team: [Slack channel / Email]
- Emergency Hotline: [Phone number]

**For deployment documentation questions:**
- Technical Writer: [Contact]
- Platform Team: [Contact]

---

**Remember**: This is a TEMPLATE. Customize it for your project's specific needs!
