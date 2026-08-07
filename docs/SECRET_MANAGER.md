# Google Secret Manager Configuration

This document lists all configuration secrets required to run SlotStars WordPress in production and details how to populate them.

---

## 1. Secrets Reference List

| Secret Name | Description | Source / Format |
| :--- | :--- | :--- |
| `slotstars-db-password` | Password for Cloud SQL user `wp_user` | Alpha-numeric random string |
| `slotstars-bridge-secret`| HMAC signing secret key | Random 64-char hex string |
| `slotstars-wp-auth-key` | WordPress core security key | Unique random salt |
| `slotstars-wp-secure-auth-key`| WordPress core security key | Unique random salt |
| `slotstars-wp-logged-in-key` | WordPress core security key | Unique random salt |
| `slotstars-wp-nonce-key` | WordPress core security key | Unique random salt |
| `slotstars-wp-auth-salt` | WordPress core security key | Unique random salt |
| `slotstars-wp-secure-auth-salt`| WordPress core security key | Unique random salt |
| `slotstars-wp-logged-in-salt`| WordPress core security key | Unique random salt |
| `slotstars-wp-nonce-salt` | WordPress core security key | Unique random salt |

---

## 2. Populating Secret Values

Create versions of each secret using the Google Cloud CLI (or utilize the console dashboard):

```bash
# Example database password
echo -n "some-secure-random-db-password-92837" | gcloud secrets versions add slotstars-db-password --data-file=- --project="your-gcp-project-id"

# Example bridge secret
echo -n "bridge-secret-64-character-hex-string-..." | gcloud secrets versions add slotstars-bridge-secret --data-file=- --project="your-gcp-project-id"
```

To generate secure WordPress random salts, run:
```bash
# Fetch unique random salts from official service API
curl -s https://api.wordpress.org/secret-key/1.1/salt/
```

Populate the output variables into the respective `slotstars-wp-...` secrets.
