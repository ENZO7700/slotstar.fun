# Google Cloud Storage Media Storage

Cloud Run containers have ephemeral local file storage. Files written to `wp-content/uploads` are deleted when instances scale down or recycle. We must offload media uploads to Google Cloud Storage (GCS).

---

## 1. Storage Bucket Creation

Create the bucket using the project-bound naming convention to avoid conflicts:

```bash
# Bucket name template: slotstars-media-${GCP_PROJECT_ID}
export BUCKET_NAME="slotstars-media-your-gcp-project-id"

# Create Bucket
gsutil mb -l europe-west3 -p "your-gcp-project-id" "gs://${BUCKET_NAME}"

# Configure fine-grained access control or uniform public permissions
gsutil iam ch allUsers:objectViewer "gs://${BUCKET_NAME}"
```

---

## 2. WordPress Media Offload Integration

To offload media, use a secure, maintained WordPress plugin. 
Recommended options:

### Option A: `wp-stateless` (Recommended)
- **Plugin Name**: WP-Stateless (available in official repository)
- **Features**: Automatically uploads new media files to GCS and rewrites local URLs to point to Google Cloud Storage bucket path.
- **Mode**: Choose `Stateless` mode. This deletes the local file immediately after uploading it to GCS, keeping Cloud Run disks clean.

### Option B: Core Code Hooks (Plugin-free)
- If you prefer zero plugins, you can register custom code hooks filtering `wp_handle_upload` to call GCS client APIs using Google Cloud PHP SDK inside your custom plugin. However, `wp-stateless` is production-proven.

---

## 3. CDN & Cache Control Configurations

- **Browser Cache TTL**: Configure GCS default object headers to include Cache-Control max-age (e.g. `Cache-Control: public, max-age=31536000`).
- **Cloud CDN integration**: Map a custom subdomain (e.g. `media.slotstars.fun`) to Google Cloud CDN pointing to the bucket backend to speed up delivery and reduce egress bandwidth charges.
