# Google Cloud SQL Setup & Configuration

This guide details configuration, networking, connection limits, and backup management for the MySQL database on Google Cloud SQL.

---

## 1. Instance Creation

Create the database instance using low-cost tiers for start-up:

```bash
gcloud sql instances create slotstars-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region="europe-west3" \
  --project="your-gcp-project-id"
```

> [!TIP]
> A `db-f1-micro` is appropriate for initial builds. Scale to `db-g1-small` or standard vCPU tiers if import operations require higher IOPS or memory.

---

## 2. Database & User Configuration

Create the database and database user credentials:

```bash
# Create Database
gcloud sql databases create slotstars_db \
  --instance=slotstars-mysql \
  --project="your-gcp-project-id"

# Create User
gcloud sql users create wp_user \
  --instance=slotstars-mysql \
  --password="your-generated-db-password" \
  --project="your-gcp-project-id"
```

---

## 3. Networking & Security

- **Private Connections**: Cloud Run communicates with Cloud SQL securely using a local Unix socket configured via annotation `run.googleapis.com/cloudsql-instances`.
- **Public IP Restrictions**: By default, do not configure public IP access ranges (Authorized Networks) for this instance unless strictly required for admin migrations. All access should go through the secure IAM Auth proxy or VPC network connectors.

---

## 4. Backup & Recovery

Configure backups and PITR (Point-in-Time Recovery):

- **Automated Backups**: Enable daily automated backups with at least 7 days retention.
- **PITR (Point-In-Time Recovery)**: Highly recommended for production. PITR records binlogs to allow recovery to any specific second in the past.
  ```bash
  gcloud sql instances patch slotstars-mysql \
    --enable-bin-log \
    --backup-start-time="02:00" \
    --project="your-gcp-project-id"
  ```

---

## 5. Database Connection Limits

A `db-f1-micro` instance has a limit of **250** concurrent connections. 
To prevent hitting limits:
1. Limit Cloud Run maximum instances to `5` or `10`.
2. Do not use persistent database connections inside container scripts.
