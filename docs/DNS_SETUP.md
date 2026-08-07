# DNS & Domain Configuration

This document specifies the target DNS records required to link SlotStars production hosts to Vercel and Google Cloud.

---

## 1. Domain Map Summary

| Domain Host | Service Provider | Target Destination | Purpose |
| :--- | :--- | :--- | :--- |
| `slotstars.fun` | Vercel | `76.76.21.21` (A) | Next.js canonical frontend |
| `www.slotstars.fun` | Vercel | `cname.vercel-dns.com` | Next.js frontend alias |
| `cms.slotstars.fun` | Google Cloud | GCLB / Cloud Run custom map | WordPress headless admin |

---

## 2. Next.js Frontend Configuration (Vercel DNS)

Configure the following records at your domain registrar:

```text
# Root A Record
Type: A
Name: @
Value: 76.76.21.21

# WWW CNAME Record
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 3. WordPress Backend Domain Mapping (GCP Custom Domain)

Use Google Cloud Run Custom Domains settings to generate secure mappings:

1. In Google Cloud Console, navigate to **Cloud Run -> slotstars-wordpress -> Manage Custom Domains**.
2. Click **Add Mapping**. Select your verified domain `slotstars.fun` and set the subdomain prefix to `cms`.
3. GCP will automatically request a free Let's Encrypt SSL certificate and output the DNS destination.
4. Add the generated DNS CNAME records to your domain registrar settings:
   ```text
   Type: CNAME
   Name: cms
   Value: ghs.googlehosted.com.
   ```
