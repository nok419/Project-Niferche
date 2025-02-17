Developing a React Content Platform on AWS (EC2, S3, Cognito, Route 53)

Building a content platform with React on AWS involves leveraging several services in tandem. This report covers the detailed usage, configuration, and implementation of four key AWS services – EC2, S3, Cognito, and Route 53 – and how they integrate (with tools like AWS Amplify) to support a scalable, secure React application. We will discuss setup steps, best practices, troubleshooting tips, and cost management for each service. Finally, we consider the development environment (Windows 11, PowerShell) and continuous deployment with AWS Amplify (Gen 2) and Git integration.

Amazon EC2 – Hosting the React Application Server

Amazon Elastic Compute Cloud (EC2) provides resizable virtual servers in the cloud. EC2 is a fundamental building block in AWS for running backend services or hosting applications​
AUBERGINE.CO
. In the context of a React content platform, you might use EC2 to host the application’s backend (e.g. an API or server-side rendering) or even serve the React front-end if needed. Below, we cover EC2 instance setup, scaling, cost optimization, and deploying a React app on EC2.

EC2 Instance Setup and Configuration
To get started, you launch an EC2 instance and configure it as the server for your platform. Key setup steps include:

Launch an EC2 Instance: Choose an appropriate Amazon Machine Image (AMI) such as Amazon Linux 2 or Ubuntu, and an instance type sized for your needs (e.g., a t3.small for a small app). Configure networking (default VPC or custom VPC) and a Security Group to allow necessary traffic – typically open port 22 (SSH) for administration, and port 80/443 for web traffic. Attach a key pair for SSH access or enable AWS Systems Manager for passwordless login.
Initial Server Configuration: After launch, connect to the instance via SSH (e.g. ssh -i YourKey.pem ec2-user@<EC2-public-DNS>)​
AUBERGINE.CO
. Update the system packages (sudo apt-get update && sudo apt-get upgrade on Ubuntu) and install required software:
Node.js and npm (needed to run or build the React app)​
AUBERGINE.CO
.
Git (to pull your project code from the repository)​
AUBERGINE.CO
.
Web Server: If serving a static React build, install Nginx or Apache. For Node.js backend or SSR, you can run the Node app directly or with a process manager.
Fetch Application Code: Navigate to a working directory on the instance (e.g. /home/ubuntu or /var/www) and clone your Git repository (Project-Niferche) to the server (git clone <repo_url>)​
AUBERGINE.CO
. Alternatively, you can use AWS CodeDeploy or AWS Amplify CI/CD for automated deployment from Git – this can streamline updates.
Build and Deploy the React App:
If your React app is a single-page application (SPA), run the build process on the instance: npm install to install dependencies, then npm run build to create an optimized production build​
AUBERGINE.CO
. This generates static files (HTML, JS, CSS) typically in a /build or /dist directory.
Move or copy the build files to the web server’s directory. For example, on Nginx default root (/usr/share/nginx/html or /var/www/html), you would place the index.html and static assets there.
Configure the web server: Update Nginx configuration to serve the React app. Set the document root to your build folder and add a “fallback” for the SPA routes. In Nginx, this is done with the try_files directive:
server {
  listen 80;
  server_name your_domain.com;
  root /var/www/html;
  index index.html;
  try_files $uri $uri/ /index.html;
}
This ensures that any request for a route that isn’t a real file returns index.html (letting the React router handle it)​
AUBERGINE.CO
. Start Nginx and verify it’s running (sudo service nginx start and visit the instance’s public IP in a browser)​
AUBERGINE.CO
​
AUBERGINE.CO
. You should see your React app’s homepage.
Enable HTTPS (SSL): For production, configure SSL on the server. The most robust approach is to use an AWS Certificate Manager (ACM) certificate with a Load Balancer or CloudFront (covered in the Route 53 section). If you need to terminate SSL directly on the EC2 instance (without a load balancer), you can obtain a certificate from Let’s Encrypt using a tool like Certbot​
AUBERGINE.CO
. Certbot will generate an SSL certificate for your domain, which you then configure in Nginx (ssl_certificate and ssl_certificate_key in the Nginx config)​
AUBERGINE.CO
. Keep in mind you’ll need to renew Let’s Encrypt certs every ~90 days. Using ACM with an AWS-managed load balancer or CloudFront is often easier for automatic renewal.
Best Practices:

Security Groups & Firewalls: Ensure only necessary ports are open to the public. For example, open HTTP/HTTPS to everyone, but restrict SSH (port 22) to your IP or use AWS Session Manager. Always use SSH keys or Systems Manager – never username/password login.
OS Hardening: Regularly patch the OS and consider using Amazon Linux (which is optimized for AWS). Remove or disable unnecessary services on the VM.
Monitoring: Install the CloudWatch agent or use EC2’s monitoring to watch CPU, memory, and disk usage. This helps in scaling decisions and troubleshooting.
Backup and Recovery: For critical servers, create AMIs or snapshots of the instance (especially after setting it up). This allows quick recovery or the ability to launch additional instances with the same configuration.
Scaling and High Availability on EC2
As your platform grows, a single EC2 instance may become insufficient. AWS provides tools to scale out (add more instances) and scale up (move to a larger instance type) as needed:

Auto Scaling Groups (ASG): An ASG can automatically manage a fleet of EC2 instances. You define a launch configuration/template (instance type, AMI, security group, etc.) and scaling policies. EC2 Auto Scaling will ensure a minimum number of instances are always running and can add instances when load increases or remove them when load decreases​
AWS.AMAZON.COM
. For example, you might run 2 instances normally, but scale out to 5 during peak traffic. Auto Scaling uses health checks – if an instance becomes unhealthy, it can replace it automatically to maintain availability​
AWS.AMAZON.COM
.
Load Balancing: When running multiple instances, use an Elastic Load Balancer (ELB) (specifically an Application Load Balancer for HTTP/S) in front of them. The load balancer distributes incoming requests across instances and provides a single endpoint for your users. It also performs health checks and stops sending traffic to any instance that is not responding. In Route 53, you would point your domain to the load balancer (rather than directly to an EC2) for a highly available setup.
Stateless Architecture: Design your application to be stateless across EC2 instances. This means any user-uploaded content or sessions should not be stored on the instance’s local disk. Instead, use external storage – e.g. Amazon S3 for user content, or a database for sessions or data. This way, any instance can handle any request, and instances can scale in/out without losing data. For session management, consider using cookies with JWTs (via Cognito) or an external store like Redis if needed.
Geographic Distribution: EC2 instances are in a specific AWS Region/AZ. For global users and redundancy, you can run instances in multiple Availability Zones (the load balancer can span AZs) to survive AZ outages. Route 53 can even do latency-based or failover routing across regions if needed (beyond basic scope here).
Scaling Best Practices: Start with an instance size that covers your expected base load. Use CloudWatch alarms to trigger Auto Scaling actions (for example, add an instance when CPU > 70% for 5 minutes). Test the scaling policies. For deployment in an Auto Scaling group, you’ll need an automated way to get your latest code on new instances (User Data scripts, baked AMI, or using CodeDeploy). AWS CodeDeploy integrates with Auto Scaling to smoothly deploy updates across instances without downtime.

EC2 Cost Optimization
Uncontrolled, EC2 costs can grow, so it’s important to optimize usage:

Right-Size Instances: Choose the instance type that best fits your workload. AWS offers over 750 instance types, varying by vCPU, memory, storage type, etc. Don’t over-provision resources “just in case.” Use AWS Compute Optimizer and Cost Explorer’s rightsizing recommendations to identify if your instance is underutilized​
AWS.AMAZON.COM
. For example, if CPU usage is low, a smaller instance or a burstable type (T-series) could handle the load at lower cost.
Leverage Pricing Models: EC2 has multiple pricing options:
On-Demand: Pay by the hour/second with no commitment – highest flexibility, but highest cost per unit time. Good for spiky or unknown workloads.
Savings Plans / Reserved Instances: Commit to a certain usage (e.g. 1-year or 3-year term, or a spending commitment) to get significant discounts (up to ~72% off)​
AWS.AMAZON.COM
. If you know your server will run long-term at steady state, a Compute Savings Plan or converting the instance to a Reserved Instance reduces cost greatly.
Spot Instances: Use spare AWS capacity at up to 90% discount​
AWS.AMAZON.COM
 – ideal for non-critical or batch workloads that can tolerate interruptions (AWS can reclaim spot instances with short notice). A content web app’s main servers should typically be On-Demand or Reserved, but you might use Spot for background processing jobs to save money.
Auto Scaling for Cost: Auto Scaling not only helps performance, but cost – by scaling down during low-traffic periods. For example, scale to a single instance at night when traffic is low, instead of running many idle servers. You can also schedule scaling – e.g., if you know nightly traffic is minimal, schedule to reduce capacity during certain hours.
Use Newer and Efficient Instances: AWS’s newer instance families or processors often have better price-performance. Graviton2/3 (ARM-based) instances can offer 40% better price-performance vs older Intel instances for workloads that can run on ARM​
AWS.AMAZON.COM
 (Node.js runs on ARM just fine). Migrating to these or instances with burst capability (T4g, T3) can cut costs if suitable for your usage pattern.
Stop/Start Environments: For dev/test environments, shut down EC2 instances when not in use (you can automate stop at 7 PM, start at 8 AM for example). You pay for EBS storage but not compute when an instance is stopped. This is an easy cost saver in non-production.
Monitoring and Alerts: Set up billing alerts or use AWS Budgets to get notified if EC2 costs exceed a threshold. This catches unintended cost issues (like an instance left running or scaled out unexpectedly).
Deploying React Applications on EC2 – Specific Considerations
Deploying a React app to EC2 largely means serving the compiled static files or running a Node server for it:

Static Site on EC2: While you can serve a React SPA from EC2 (with Nginx or Apache as described above), note that this approach is not the most cost-effective or scalable for static content. AWS best practice is to offload static files to S3/CloudFront (see S3 section)​
DOCS.AWS.AMAZON.COM
. Serving a React build via EC2 is reasonable for development or small-scale use, but for a production content platform, consider using EC2 only for dynamic parts (like an API, or server-side rendering if using Next.js/SSR) and use S3/CloudFront for the front-end. This will reduce load on EC2 and simplify scaling (since S3/CloudFront handle static scaling automatically).
Server-Side Rendering (SSR): If your React app uses Next.js or another framework for SSR, you might run it on EC2 (or AWS Lambda with containers). In that case, you’d run a Node.js server that serves pages. Ensure you use a process manager (like PM2 or systemd) to keep the Node server running, and consider an ASG + load balancer for scaling SSR nodes. AWS Amplify Hosting (Gen 2) now also supports SSR builds for frameworks like Next.js, which could remove the need to manage EC2 yourself.
Continuous Deployment: Manually SSHing into EC2 to pull code and rebuild works, but for team collaboration and agility, automate deployments:
AWS Amplify Console: You can connect your Git repository to Amplify for front-end deployment. Amplify will build and deploy the app to a global CDN (no manual EC2 steps needed). This is ideal for static sites.
AWS CodeDeploy/CodePipeline: For EC2-based deployment, you can use CodePipeline (with GitHub or CodeCommit as source) and CodeDeploy to push out new versions to the EC2 instance(s). This can even do rolling updates across an Auto Scaling group.
Docker/Containers: Containerizing the app and using Amazon ECS or AWS App Runner could be an alternative to managing individual EC2 servers. For instance, AWS App Runner can directly deploy a web app from source or container and scale it automatically, simplifying ops (though this uses ECS under the hood, not in our main scope).
Troubleshooting EC2 Deployments:

If your website isn’t reachable, first check security group settings (common oversight). Ensure inbound rules allow HTTP/HTTPS from the internet. Next, check the Network ACLs of the subnet (default usually ok) and that the instance is in a public subnet with an Elastic IP or public IP attached.
If using an ALB and you get a “502 Bad Gateway,” it often means the EC2 instances aren’t responding on the expected port. Verify your app server is running on the correct port and the security group permits the load balancer’s health checks.
For SSH issues (timeout), ensure the instance’s public IP is correct and you’re using the right key. Check that the instance status checks are passing in the console (if not, there might be a boot issue – check system logs via EC2 console or AWS Support).
If Nginx is running but you see a default page or 404 for your React routes, double-check the Nginx config. The try_files ... /index.html rule is crucial for client-side routing​
AUBERGINE.CO
. Without it, refreshing a route like /dashboard may return 404. Also verify your files are in the directory Nginx expects (permission issues or wrong path can cause blank pages).
For performance issues, use CloudWatch metrics. High CPU could mean the instance is underpowered – consider scaling up or out. If memory is an issue (and you’re on a small instance), you might need to increase instance size or add swap space as a quick fix.
Always make sure to log errors. Check Node.js logs (if running a Node server) or Nginx access/error logs for clues when debugging a blank page or malfunctioning API.
Cost Management Tip: Tag your EC2 resources (instances, volumes, load balancers) with a project name (e.g., “Project-Niferche”) and environment (“Dev”/“Prod”). This helps track costs per project in AWS Cost Explorer, so you can attribute and possibly cut costs for non-production resources easily.

Amazon S3 – Static Hosting and Content Storage

Amazon Simple Storage Service (S3) is AWS’s object storage service, ideal for storing static files and user-generated content. For a React content platform, S3 plays two major roles: hosting the static website assets (HTML, JS, CSS, images for your React app) and storing dynamic content (uploads like user photos, videos, documents, etc.). S3 is highly durable and cost-effective for these purposes. We will cover configuring S3 for static website hosting, managing content, optimizing performance, and applying security best practices.

Static Website Hosting on S3
You can host a static website (like a React SPA) entirely on S3 without needing a web server. S3 will serve your files via an HTTP endpoint. Key steps to set up static hosting on S3:

Create an S3 Bucket: In the AWS console, create a new bucket. For hosting a website, it’s convenient (but not strictly required) to name the bucket after your domain (e.g., niferche.com) so that it can be easily mapped. If you intend to use an S3 static website endpoint directly with your custom domain, the bucket name must match the domain name for DNS routing to work. Otherwise, for usage behind CloudFront, the bucket can be named arbitrarily.
Enable Static Website Hosting: In the bucket’s properties, turn on “Static website hosting”. Specify the index document (e.g., index.html) and an error document (e.g., error.html). For single-page applications, a common trick is to set the error document to index.html as well, so that any invalid path will return your main page which can handle client-side routing. This ensures refreshing on a React route doesn’t give a 404. (If using CloudFront instead, you can similarly configure it to redirect 404s to index or use an Edge function for SPA routing.)
Upload Your Site Content: Upload the React build files (the contents of the build or dist directory) to the bucket. This can be done via the S3 Console (Upload button) or automated with AWS CLI (aws s3 cp --recursive) or CI pipeline. Ensure the files are readable by the public – by default S3 buckets block public access. You will need to adjust bucket permissions as described next.
Set Permissions for Web Access: By design, S3 is private. For a public website, you must allow public read access to the bucket’s objects:
Disable Block Public Access: In the bucket settings, if “Block Public Access” is enabled, you may need to disable it (or at least allow public access for this bucket).
Bucket Policy: Add a bucket policy that permits s3:GetObject on the bucket for all users. For example:
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
This allows anyone to fetch objects from this bucket. (Be careful to limit this policy to just the needed bucket and path; you don’t want to inadvertently expose other buckets.) After this, the bucket’s files (like index.html) will be publicly accessible.
Test the Website: Each S3 static site has an endpoint URL (visible in the Static Website Hosting settings). It will be of the form http://<bucket-name>.s3-website-<AWS-region>.amazonaws.com. Try opening this URL – you should see your React app’s content. Note that the S3 website endpoint only supports HTTP, not HTTPS. In practice, for a production site you will put CloudFront or use a custom domain with SSL (discussed later), since you want HTTPS. But at this stage, ensure the content is serving correctly.
Benefits: Hosting a React SPA on S3 is highly scalable and cost-effective. You don’t need any EC2 servers just to serve static files​
DOCS.AWS.AMAZON.COM
. S3 will handle potentially thousands of concurrent requests with no fuss. Additionally, S3 storage is cheap (and you only pay for what you use in terms of GB stored and data transferred).

Using AWS Amplify Hosting: AWS Amplify Hosting is a managed service that actually uses S3 and CloudFront under the hood to host static sites. It automates the above steps. You simply connect your Git repository and Amplify will build and deploy your React app to an S3 bucket + CloudFront distribution, and give you a convenient domain (e.g. https://master.abcd123.amplifyapp.com) with HTTPS by default​
DOCS.AWS.AMAZON.COM
. Amplify also supports custom domains and CDNs, which we cover later. AWS’s own documentation recommends Amplify Hosting for S3-hosted sites because it streamlines the process and adds a CDN easily​
DOCS.AWS.AMAZON.COM
. However, it’s valuable to know the manual steps (as above) for full control or understanding.

Content Management with S3
For a content platform, user content (images, videos, documents, etc.) can be stored in S3. This decouples file storage from your web servers and takes advantage of S3’s durability and scalability. Key considerations for managing content in S3:

Bucket Organization: Organize your bucket to segregate user content from site assets. You might use a separate bucket (e.g., niferche-user-content) or at least a different prefix/folder (e.g., content/ vs site/). Within user content, a common pattern is to give each user a folder (prefix) for their uploads, or categorize by content type. Good organization makes it easier to apply fine-grained security rules.
Direct Uploads from Client: A big advantage of S3 is you can upload files directly from the browser, avoiding routing large files through your server. Using the AWS SDK (or Amplify Storage library), you can put objects into S3. For security, you should not expose your AWS credentials in the browser. Instead, use Amazon Cognito Identity Pools to get temporary credentials for authenticated users. Cognito Identity Pools issue AWS credentials after a user logs in (usually via a Cognito User Pool). With an attached IAM role, these credentials can be limited to allow S3 uploads/downloads only in certain paths (for example, only to a folder corresponding to that user’s ID)​
DOCS.AWS.AMAZON.COM
. This way, a user can upload their files securely without a server proxy, and they cannot access other users’ files. (Alternatively, your server can generate pre-signed S3 URLs that the client can PUT to – also a secure method without exposing keys.)
Integrating Amplify Storage: AWS Amplify includes a Storage category that simplifies linking an S3 bucket to your app. With a few lines of config, you can use Storage.put('key', file) to upload and Amplify will handle using the Cognito credentials. Amplify CLI can even create the S3 bucket and configure the permissions automatically when you run amplify add storage. Under the hood, it creates an S3 bucket and an IAM role tied to Cognito identity pool that allows actions like s3:PutObject to a protected prefix for the user. For instance, Amplify’s default might create folder paths like /public/, /protected/, /private/<userId>/ for different sharing levels. This is a convenient way to manage user content.
Versioning and Lifecycle: Enable versioning on the content bucket if you want to keep previous versions of files (this can help if users may overwrite content and you want the ability to restore older versions). Versioning adds storage cost but increases data safety. You can pair this with Lifecycle rules to manage storage cost long-term. For example, you might transition older versions to cheaper storage classes or delete them after X days if not needed​
DOCS.AWS.AMAZON.COM
​
DOCS.AWS.AMAZON.COM
.
Large Files: If users will upload large files (say, high-resolution videos), consider using S3’s multi-part upload API which is handled automatically by the AWS SDK for files above a certain size. This ensures reliable uploads and the ability to resume if an upload fails mid-way. Also, encourage or implement client-side compression for images/videos if appropriate to reduce file sizes and bandwidth.
Content Delivery: If your platform delivers a lot of media, use Amazon CloudFront (CDN) in front of S3. CloudFront will cache content at edge locations, improving download speed for users globally and reducing direct S3 traffic (which can save cost if a file is requested frequently). We’ll discuss CloudFront integration more in Performance.

Performance Optimization for S3 Content
Out of the box, S3 can handle heavy traffic, but to optimize performance (especially perceived end-user performance):

Use CloudFront CDN: Serving your static React app and user content through CloudFront significantly improves latency for users worldwide. CloudFront caches your files in Edge locations around the world. Users fetch from a nearby server instead of from your S3 bucket’s region (which might be far from them). This reduces load times and bandwidth costs. AWS’s guidance is that static content should be delivered via CloudFront for best performance​
DOCS.AWS.AMAZON.COM
. CloudFront also provides HTTPS by default and can compress files on the fly (if not already compressed). For example, your JSON or HTML files can be GZIP’d or Brotli-compressed by CloudFront when sending to the user.
Cache Control: Set proper cache headers on your S3 objects. For static assets (JS/CSS), you can set a long cache lifetime (Cache-Control: max-age=31536000 for a year) since they usually change only when you deploy a new version (in which case their file names often change due to content hashing). This way, repeat visitors can load resources from their browser cache. For content that might change or be user-specific, use appropriate caching (or none). You can configure these headers during upload or with S3 Bucket Rules, or let your build tool handle it (e.g., some build tools can upload to S3 with the right headers).
S3 Transfer Acceleration: If you have users in remote areas uploading large files to S3, enabling Transfer Acceleration on your bucket can improve upload speed. This feature uses CloudFront’s network to accelerate data transfer into S3. It costs extra per GB, so use it only if needed for your use case.
Optimize Media: For a content-heavy site, optimize images and videos. Store images in modern formats like WebP/AVIF for web, or have multiple resolutions and let the frontend choose (responsive images). Although not an S3 setting per se, this reduces bytes delivered from S3. You might integrate an image processing service or Lambda for this.
Parallelize and Paginate: S3 can handle many requests, but if listing huge buckets (thousands of objects) in one go, it may be slow – always paginate listing requests (the AWS SDK does this automatically via continuation tokens). Also, design your app to not repeatedly fetch the same data from S3 when not needed – leverage caching in the app or a database index if listing often.
Content Delivery Network (for User Content): Just like the main site, user-uploaded content (especially if public or shared) can be behind CloudFront. You can set up a CloudFront distribution with the S3 content bucket as origin. If the content is private (e.g., each user’s files should only be accessible to them), you can still use CloudFront but employ signed URLs or cookies for access control, or use origin request lambda to validate access. That adds complexity; if content is mostly public, CloudFront is straightforward.
Security and Access Control in S3
Security is paramount since you don’t want to accidentally expose data. Consider the following best practices for S3:

Least Privilege IAM: Only grant access that’s necessary. If using Cognito identity pools for user uploads, the IAM role for authenticated users should allow s3:PutObject and s3:GetObject only on a path like bucket-name/users/${cognito-identity.amazonaws.com:sub}/* (where ${cognito-identity.amazonaws.com:sub} is replaced by the user’s unique identity ID at runtime)​
DOCS.AWS.AMAZON.COM
​
DOCS.AWS.AMAZON.COM
. This effectively sandboxes each user’s access to their own folder. AWS provides policy examples for this pattern​
DOCS.AWS.AMAZON.COM
. Similarly, your web app (if running on EC2 or Lambda with IAM role) might have permission to read/write certain buckets – restrict those in the role attached to that service.
Bucket Public Access: Keep buckets private by default. For the React app hosting bucket, you intentionally made it public or accessible via CloudFront. Review those settings carefully. S3 now has Block Public Access settings at both account and bucket level – generally keep them enabled, and only disable for the specific bucket that needs public access. Even then, consider using CloudFront with an Origin Access Identity (OAI) or Origin Access Control, so the bucket itself isn’t public, only CloudFront can fetch from it. This way you can block all public access on the bucket and rely on CloudFront signed requests. This is slightly advanced, but it greatly enhances security by not exposing S3 directly.
Encryption: Enable server-side encryption on buckets. You can set a bucket default to encrypt all objects (AES-256 by S3, or use a KMS Key if you need extra control). This ensures data at rest is encrypted without needing any changes in how you upload/download. It’s a checkbox that can satisfy compliance requirements easily. For very sensitive data, using a KMS customer-managed key adds the ability to control access via the key policy and see audit logs of key usage.
MFA Delete: For buckets that hold critical content, consider enabling MFA Delete (which requires MFA token to delete objects or change versioning state). This is more for preventing accidental or malicious mass deletion (e.g., a compromised admin account couldn’t wipe the bucket without physical MFA).
Access Logging: Enable S3 access logs or CloudTrail data events for S3. This will record requests made on the bucket. Access logs can be delivered to another S3 bucket, while CloudTrail can send to S3 or CloudWatch. This helps in auditing and troubleshooting (e.g., you can see if an object was accessed by someone unexpected).
CORS Configuration: If your React app is served from a domain and it needs to make AJAX calls to S3 (e.g., to GET an image or PUT an upload), you’ll need to set a CORS (Cross-Origin Resource Sharing) policy on the bucket. Configure allowed origins (your domain), allowed methods (GET, PUT, etc. as needed), and allowed headers. Amplify CLI or the S3 console’s Permissions tab allows setting a CORS JSON document. Without proper CORS, the browser may block requests to S3 even if the credentials/permissions are correct.
Static Hosting Confidentiality: Remember that any file in a public website bucket can be seen by anyone who knows the URL. Don’t put private data in the same bucket as your public site unless it’s protected. If you have some parts of the site that should be protected (say a members-only section), you might need to implement that differently (e.g., behind a CloudFront that requires login, or simply ensure those pages fetch data only after auth).
Cost Management for S3: S3 costs come from storage ($ per GB-month), data transfer out ($ per GB, but note CloudFront is cheaper for high volumes of transfer plus has a free tier of 1 TB/month), and API requests (GET, PUT requests cost fractions of a cent per 1,000). To manage costs:

Use Lifecycle rules to transition infrequently accessed data to cheaper tiers (Standard-IA, Glacier, etc.) if applicable​
DOCS.AWS.AMAZON.COM
​
DOCS.AWS.AMAZON.COM
. For example, if user-uploaded content older than 1 year is rarely accessed, you could move it to Glacier and save on storage (with trade-off of retrieval latency when needed).
Delete unused data: Implement cleanup for expired content. If users delete something in your app, actually remove it from S3 (or at least move to an “deleted” prefix and lifecycle-expire it after 30 days).
Data Transfer: Leverage CloudFront caching to reduce direct S3 downloads. Also, within AWS (say your EC2 or Lambda accessing S3 in same region), data transfer is free – so design your architecture to use same-region access to avoid unnecessary costs.
The S3 free tier is 5 GB storage and 20,000 GET + 2,000 PUT requests per month, which can cover a small-scale dev/test usage. Monitor usage as you grow. Amazon S3 has various storage classes; ensure you’re using the right one for the right data (don’t use Standard for archive data that could be Glacier, etc., but also don’t prematurely optimize – Standard is fine for most active content).
Amazon Cognito – User Authentication and Authorization

Amazon Cognito is a serverless user authentication and user management service. It allows you to add sign-up, login, password recovery, and even social login to your web app with minimal backend code. Cognito consists of User Pools and Identity Pools (now also called Federated Identity). For a React content platform, Cognito can handle the authentication (AuthN) of users (verifying identity) and help with authorization (AuthZ) by issuing tokens or temporary AWS credentials. We’ll discuss setting up a Cognito user pool, integrating OAuth providers, using Amplify for implementation, and best practices.

Setting Up User Authentication with Cognito User Pools
A Cognito User Pool is a user directory. It stores user profiles, credentials (hashed passwords), and manages the user lifecycle (sign-up, account verification, login, MFA, etc.). To use Cognito for your site’s login system:

Create a User Pool: Through the AWS Console or AWS Amplify CLI, create a new User Pool. You will configure:
Sign-in Options: Decide how users will sign in. Cognito supports using a username, email, phone number, or a combination. For simplicity, many choose email address as the unique login (Cognito can treat email as username)​
DOCS.AWS.AMAZON.COM
.
Password Policy: You can enforce password strength requirements (min length, special chars, etc.) or even enable MFA (multi-factor auth) for added security.
User Attributes: Specify what information to collect and store for each user (e.g., name, email, etc.). Email and phone can be marked required and used for verification.
Verification: Choose if users need to verify email/phone on sign-up (Cognito can automatically send a verification code by SMS or email).
App Clients: Create an App Client for your React application. This is essentially credentials for the front-end to interact with the user pool (client ID and an optional secret – for a public client like a JS app you do not use a secret). Configure the App Client’s settings: e.g., enable the User Password Auth flow, set refresh token expiration (the default is 30 days), and (if using the hosted UI/OAuth) define callback URLs.
Domain (for Hosted UI): If you plan to use Cognito’s hosted login page or social provider redirects, you’ll need to set up a domain for the user pool. Cognito provides a <your-pool>.auth.<region>.amazoncognito.com domain by default, or you can use a custom domain (which requires an SSL cert in ACM).
Cognito Identity Pool (optional): If you want to authorize users to access AWS resources (like S3) directly, set up an Identity Pool. In the Identity Pool, configure it to “Integrate with Cognito User Pool” for authentication. You will attach two IAM roles: one for authenticated users and one for unauthenticated (guest) users. The identity pool will exchange a successful user pool login for temporary AWS credentials via the authenticated role. In that role, you attach policies for allowed actions (for example, an S3 access policy as discussed). If you only need user login and plan to call AWS services from your backend, you might not need an identity pool at all – you can strictly use the user pool and handle AWS resource access with your backend using the user’s tokens.
AWS Amplify CLI for Auth: As an alternative to doing the above manually, Amplify CLI can provision these resources for you quickly. Running amplify add auth in your project will walk you through creating a user pool with default settings​
DOCS.AWS.AMAZON.COM
​
DOCS.AWS.AMAZON.COM
. You can even enable federated logins (social providers) through that CLI flow​
DOCS.AWS.AMAZON.COM
. When you then do amplify push, it uses CloudFormation to create the Cognito user pool (and identity pool, if selected) in your AWS account​
DOCS.AWS.AMAZON.COM
. The Amplify CLI outputs an aws-exports.js file in your React app with all the config (user pool ID, region, etc.)​
DOCS.AWS.AMAZON.COM
. This is very convenient for integration, as we’ll see next.
Using Cognito in the React App: Once the user pool is created, your React front-end will interact with it to register and authenticate users. This can be done via:

Amplify Auth Library: The Amplify JavaScript libraries provide a high-level interface to Cognito. After configuring Amplify with the aws-exports.js (which contains the Cognito details), you can call functions like Auth.signUp({ username, password, attributes: {...} }) to register a user, Auth.confirmSignUp(username, code) to confirm them (if verification code is required), and Auth.signIn(username, password) to log in. Amplify handles the low-level API calls to Cognito for you.
Cognito Hosted UI: Cognito also offers a hosted web UI for sign-in/up. You redirect users to the Cognito Hosted UI (which you can customize with your branding to some extent), and after login it redirects back to your app with tokens. Amplify’s Auth library can help invoke this, or you can manually integrate it by constructing the correct URL (including your App Client ID, requested scopes, and redirect URI). The Hosted UI is especially handy when using social logins – it presents a “Sign in with Google/Facebook/…” button and handles that OAuth flow.
OAuth and Social Login Integration
Amazon Cognito User Pools support federation with external identity providers via OAuth2/OIDC or SAML. Commonly, you can allow users to log in with Google, Facebook, Apple, Amazon, or any OIDC-compatible provider. For our React app, this means users could choose to sign in using their Google account, and Cognito will create a linked user in the user pool.

To set up social login (for example, Google OAuth):

In Cognito User Pool Identity Providers section, enable Google. You’ll need to obtain OAuth 2.0 client credentials from Google API Console (Google will give a Client ID and Client Secret for your app). Provide those to Cognito.
Cognito will generate a callback URL for Google (which you’ll have set in Google’s console). It will be something like https://<your-cognito-domain>/oauth2/idpresponse. This is the URL Google will redirect to after authentication.
In App Client Settings for the user pool, enable the Identity Provider (Google in this case) for the client application. Also specify the callback URL(s) (where Cognito will redirect after login – e.g., your React app URL) and allowed OAuth scopes (e.g., email, openid, profile for basic info).
Now, Cognito’s hosted UI will show a “Sign in with Google” option. When a user chooses it, Cognito handles the OAuth flow with Google. Upon successful login, the user is either mapped to an existing Cognito user or a new user is created in your user pool (with a unique ID and the Google email linked).
From the React front-end perspective, if using Amplify, you can simply call Auth.federatedSignIn({ provider: 'Google' }) or even easier, use Amplify UI components that will show social login buttons. Amplify’s withAuthenticator HOC or <Authenticator> component can be configured to include social provider buttons if Cognito is set up for them.

Cognito also supports other providers (Facebook works similarly by providing an App ID/secret, etc.). It supports Sign in with Apple for Apple devices, and any OIDC provider (enterprise logins) or SAML 2.0 (for corporate identity).

If you prefer to handle OAuth flows in your own UI without redirecting to Cognito’s hosted page, you can still use libraries like amazon-cognito-auth-js or directly use the OAuth endpoints of Cognito, but this is complex – it’s usually easier to use the hosted UI or Amplify’s abstractions.

Security note: When using social logins, ensure that your app’s callback URL is correctly whitelisted in Cognito App Client settings; otherwise the redirect will be rejected. Also, consider what data you want to pull from the provider – Cognito can map attributes (like Google profile name, picture) into Cognito user attributes if you set up attribute mapping.

Implementing an Authentication Flow in React with Amplify
Using AWS Amplify to integrate Cognito dramatically simplifies the coding required. Here’s how you might implement a full auth system in your React app using Amplify:

Install Amplify Libraries: npm install aws-amplify @aws-amplify/ui-react. The aws-amplify package provides the Auth class, and @aws-amplify/ui-react gives pre-built React components for authentication (if you want to use them).
Configure Amplify: In your app startup (e.g., index.js or App component), import the aws-exports.js file that Amplify CLI created, and call Amplify.configure(awsconfig). This sets the library to use your Cognito User Pool and other resources​
DOCS.AWS.AMAZON.COM
.
Use Amplify UI Components (optional): The quickest way to add a user login interface is to use Amplify’s provided UI. For example, you can wrap your App with the withAuthenticator HOC:
import { withAuthenticator } from '@aws-amplify/ui-react';
export default withAuthenticator(App);
This will automatically inject a sign-in/sign-up form when the user is not logged in, and show your App when they are. It handles user sign-up, confirmation, login, and even a basic UI for forgotten passwords by default. It will use your Cognito user pool configuration (you must have configured Amplify as above). Amplify UI can be customized in appearance and steps, but out-of-the-box it’s a big time saver​
DOCS.AWS.AMAZON.COM
. You also get a signOut function via props to log the user out.
Custom Auth Implementation: If you need a custom-designed auth experience, you can use Amplify’s Auth API directly. For instance, you might have a custom form where on submit you call Auth.signIn(username, password). If successful, Cognito will return user session tokens (ID token, access token, refresh token) which Amplify stores for you (e.g., in localStorage by default). You can then use Auth.currentAuthenticatedUser() or Auth.currentSession() to retrieve the logged-in user’s info or tokens as needed (for example, to attach the ID token in Authorization header when calling your backend APIs).
Protecting Routes: With React Router, you can create Protected Routes that only render if Auth.user is present or similar. Amplify also provides a hook useAuthenticator() in the newer UI library to get authentication state in functional components.
Using Cognito Tokens: After login, you typically use the Cognito ID Token (JWT) to identify the user on the client side (it contains user’s claims like username, email), and possibly the Access Token to authorize against Cognito resources (like if using Cognito Groups or admin APIs). If you have a custom backend (say, an API on EC2 or API Gateway), you can verify these JWTs on the backend to authenticate requests. Cognito publishes JSON Web Key sets (JWKs) that your backend can use to validate token signatures. This avoids needing a separate session mechanism – the JWT is the session credential.
Identity Pool Usage: If you set up an identity pool for S3 access, Amplify will automatically exchange the Cognito token for AWS credentials. This means after login, calls to Storage.put or any AWS service through Amplify will use valid credentials behind the scenes. The identity pool’s IAM role ensures those actions are limited as per your config. The Amplify config (aws-exports) will include the identity pool ID and it knows to do this if present.
Cognito Best Practices:

Secure Password Policies: Enforce a strong password policy and possibly MFA for sensitive operations or admin users. Cognito can enforce MFA either for all users or conditional (Adaptive Authentication available in advanced security features or via Lambda triggers).
Email/Phone Verification: It’s good practice to verify emails, so users can recover accounts and to prevent spam accounts. Cognito can send a verification code on signup or when a user requests password reset.
Cognito Triggers: Cognito allows custom Lambda triggers at various stages (Pre sign-up, Post confirmation, Pre authentication, Post authentication, etc.). Use these to implement custom logic, like auto-confirming users, adding a user record to a database upon sign-up, sending a welcome email via SES, or validating custom fields.
User Groups and Roles: You can create Cognito User Pool Groups (e.g., “Admins”, “Editors”, “Users”) and assign users to them. This can be used to implement role-based access in your app. The group membership can be encoded in the JWT token (if you choose in app client settings), so your front-end or back-end can read the user’s groups to authorize actions. For example, only allow users in “Admins” group to access certain admin pages (the React app can check the decoded ID token for group claims).
Scaling and Quotas: Cognito can handle large numbers of users (millions), but note that by default there are rate limits (like 50 sign-in requests per second, etc.). For a content platform, these are usually sufficient. If you ever approach them, AWS can increase limits on request. Monitor CloudWatch metrics for Cognito (like number of logins, latency, errors).
Cost: As of the latest pricing, Amazon Cognito has a free tier for up to 10,000 monthly active users (MAUs) for user pools​
AWS.AMAZON.COM
. This should cover small-to-medium apps at no cost for auth. Above that, pricing is tiered per MAU (for instance, ~$0.0055 per MAU for 50k-100k in the older pricing model; AWS updated pricing in 2024 with Lite/Essentials tiers). Identity pools (federated identities) are free of charge for the basic feature​
AWS.AMAZON.COM
 – you only pay if you use premium features like metrics or network transfer. This means Cognito can be extremely cost-effective compared to rolling your own auth system or using a third-party, as long as you stay within reasonable MAUs.
Troubleshooting Cognito Integration:

If users cannot log in and you see “User is not confirmed” errors, it means they need to complete sign-up confirmation (check your User Pool if auto-confirm is off). You may need to implement a screen to ask for the confirmation code (Amplify UI handles this by default).
If using the Hosted UI and it’s not redirecting back to your app, double-check the callback URL in Cognito App Client settings matches exactly the URL of your app (including the correct domain, path, and port if localhost dev). Also check the OAuth scopes and that your code is expecting the right response (Amplify usually does this for you).
Social login not working? Ensure that the third-party credentials (Google client ID, etc.) are correct and that the third-party sees the correct redirect URI. A common mistake is not enabling the Google API or using the wrong OAuth consent screen configuration.
For any Amplify Auth issues, enable debug logging (Amplify.Logger.LOG_LEVEL = 'DEBUG') to see what’s happening under the hood. It will show the API calls to Cognito and errors.
If you customized domain for Cognito (so that users see auth.niferche.com instead of the AWS URL during login), remember you need to provide a certificate in ACM (in the same region as Cognito user pool) and verify that domain in Route 53. Custom domains in Cognito are a bit involved (you’d create a CNAME from auth.yourdomain to the Cognito provided domain and verify it). If misconfigured, the hosted UI might not be reachable.
JWT token expiration: ID and Access tokens expire by default after 1 hour. If your user stays logged in, Amplify will automatically use the Refresh token (valid for 30 days by default) to get new tokens. If you find users get logged out after an hour, ensure that the refresh token is being used (Amplify should handle it; if not using Amplify, you’d need to call the InitiateAuth(REFRESH_TOKEN_AUTH) API yourself). Also check that the App Client is configured to have a refresh token (some flows like using only the “implicit” grant in OAuth don’t use refresh tokens – but Amplify by default uses the user pool “USER_PASSWORD_AUTH” which does).
If you integrate an Identity Pool and see errors accessing S3 (Access Denied), verify the identity pool’s roles and policy. The user’s identity ID can be obtained via Auth.currentCredentials() and you can ensure it matches how your bucket policy is written. A handy approach is to test by logging in a user and using AWS CLI or SDK with their credentials to access S3 – or use the Cognito console’s “Get AWS credentials” feature for a test user.
Amazon Route 53 – Domain Name System and SSL Configuration

Amazon Route 53 is a DNS (Domain Name System) web service. It translates human-friendly domain names (like niferche.com) into IP addresses or other service endpoints. For our platform, Route 53 will be used to configure the custom domain for the website, set up DNS records to point to our AWS resources (EC2, CloudFront, etc.), and manage DNS-based verification for SSL certificates. We’ll look at how to map niferche.com to our app, how to handle SSL certificates via AWS Certificate Manager (ACM), and overall DNS settings.

Configuring a Custom Domain in Route 53
If you own the domain niferche.com, you likely have it either purchased through Route 53 or another registrar. The goal is to use that domain for your React app’s URL (e.g., https://niferche.com). General steps:

Domain Registration: If not already done, you can register domains via Route 53 Domains. If the domain is registered elsewhere (e.g., GoDaddy, Namecheap), you can still use Route 53 for DNS by transferring the DNS hosting. You’d create a Hosted Zone in Route 53 for the domain and update your registrar’s name server records to the Route 53 name servers.
Hosted Zone: In Route 53, create a Hosted Zone for niferche.com. This will provide a set of NS (Name Server) records and a SOA record. If Route 53 is your registrar, this is done automatically. If external registrar, copy the NS records into your registrar’s configuration so that DNS queries delegate to Route 53.
Subdomains: Decide if you want to use the bare domain (apex domain) niferche.com or www.niferche.com for the site (or both). It’s common to support both – usually redirecting one to the other. You might serve your site on the apex domain and redirect “www” to it, or vice versa. Route 53 can handle either.
DNS Records for AWS Resources: Route 53 has tight integration allowing Alias records to AWS resources like CloudFront distributions, Elastic Load Balancers, S3 static websites, etc., which is very convenient:
If your React app is hosted on CloudFront (recommended for production static hosting), create an A record (Alias) for niferche.com that points to the CloudFront distribution domain. In Route 53 console, when creating an A record, set “Alias: Yes”, and select the CloudFront distribution from the dropdown. This alias is similar to a CNAME but at the DNS level – it maps the apex domain to CloudFront’s domain and Route 53 will resolve it correctly​
DOCS.AWS.AMAZON.COM
. (Under the hood, Route 53 handles the fact that CloudFront’s IPs may change, and there’s no extra cost for alias queries to AWS endpoints​
DOCS.AWS.AMAZON.COM
.) For the www subdomain, you can also add an A Alias or a CNAME record to the CloudFront distribution. Alias is preferable since it also works for the apex and is free of charge.
If you used an Application Load Balancer (for an EC2 setup), similarly use an A Alias to point to the ALB’s DNS name. Route 53 will list ALBs in the dropdown for alias targets. (You would request an ACM cert in the same region as the ALB in that case, rather than us-east-1).
If you were pointing directly to an EC2, you cannot use an alias to an IP, but you could directly set an A record to the Elastic IP of the instance. However, using CloudFront or ELB is preferred for managed elasticity and SSL.
Redirects: If you want to redirect www.niferche.com to niferche.com (or vice versa), Route 53 alone doesn’t do redirects – it only maps names. A simple way is to create a second S3 bucket named www.niferche.com, enable static hosting on it but not with a website – instead, choose “Redirect requests to: niferche.com”. Then in Route 53, point www.niferche.com (A Alias) to that S3 bucket’s website endpoint (Route 53 supports alias to S3 website for this exact use)​
DOCS.AWS.AMAZON.COM
​
DOCS.AWS.AMAZON.COM
. This way, hitting the www address will redirect to the main site. Alternatively, some use their CDN or ALB to perform redirects.
SSL Certificate Management with AWS Certificate Manager (ACM)
For any production website, SSL/TLS is a must (serving content over HTTPS). AWS Certificate Manager is a service that issues SSL certificates (at no cost) for use with AWS resources like CloudFront, ELB, or API Gateway. Steps to get and use a certificate for niferche.com:

Request a Public Certificate in ACM: Go to AWS Certificate Manager in the AWS console. Request a certificate for your domain name. Include both the apex and the www (e.g., niferche.com and www.niferche.com) in the same certificate (you can add multiple Subject Alternative Names). Choose DNS validation (since you are using Route 53, DNS validation is easiest). ACM will prompt you to create a DNS CNAME record to prove you own the domain​
DOCS.AWS.AMAZON.COM
. If you have the Route 53 hosted zone, you can have ACM create this validation record automatically.
Validate Domain: Once the CNAME is in place, within a few minutes ACM will validate and issue the certificate. You’ll see the status become “Issued” in ACM console.
Important: For CloudFront distributions, the ACM certificate must be requested in the us-east-1 (N. Virginia) region, because CloudFront only checks that region for certificates​
DOCS.AWS.AMAZON.COM
. (This is a common gotcha – if you requested in another region, CloudFront can’t use it). For an ELB, the cert must be in the same region as the ELB. If using Amplify Hosting, Amplify will handle certificate issuance in the correct region automatically when you connect a domain.
Attach Certificate to CloudFront/ELB: In your CloudFront distribution settings, specify the Alternate Domain Name (your domain) and select the ACM certificate you requested. This tells CloudFront to present that certificate when users access via your domain. CloudFront requires HTTPS by default (you can also configure it to only allow HTTPS and redirect HTTP to HTTPS for good measure). If you’re using an Application Load Balancer, you would edit the HTTPS Listener to use the ACM certificate (the ALB must have an HTTPS listener on port 443 with the cert attached).
Test HTTPS: After deploying these changes (CloudFront can take ~15 minutes to update), access https://niferche.com. You should get a secure connection (lock icon in browser). The certificate will be issued by Amazon and valid for 1 year (auto-renewed by ACM). Use SSL labs or browser dev tools to verify no mixed content (all resources should also load via https).
Enable HTTP -> HTTPS redirect: To ensure all users end up on the secure site, configure a redirect. With CloudFront, you can set the Viewer Protocol Policy to “Redirect HTTP to HTTPS” for each behavior. With an ALB, you might create an HTTP (port 80) listener that returns a redirect to HTTPS. With an S3 static site (if you were not using CloudFront), note that S3 website endpoints themselves don’t support SSL – that’s why using CloudFront or an ALB is necessary for HTTPS on custom domains.
SSL Best Practices:

Use strong cipher policies (CloudFront default is good; for ELB you can choose a security policy). ACM will manage the actual certificate strength (it issues SHA-256 with 2048-bit RSA keys by default, which is industry standard).
Monitor certificate expiration (ACM auto-renews, but if DNS validation record is removed, renewal could fail – keep the validation CNAME in place indefinitely). AWS will alert the account owner email if renewal is in jeopardy.
If using a custom domain for Cognito Hosted UI or something like that, you would also use ACM to issue a cert (in the same region as the user pool, typically), and then configure the custom domain in that service. For our main website, ACM+CloudFront covers it.
For local development, you might not use the domain/SSL (you’d use http://localhost:3000), but in production all traffic should be HTTPS and pointing to your domain.
DNS Records and Configuration Details
Within your Route 53 Hosted Zone for niferche.com, you will manage several DNS record types:

A Record (Alias) for niferche.com -> CloudFront distribution (or ELB, S3 static site, etc.). This covers IPv4. You should also create an AAAA Record (Alias) for IPv6 to the same target, as CloudFront and ALBs support IPv6 natively. This ensures users on IPv6 networks can resolve your domain.
CNAME or A Record for www.niferche.com -> either the same target or to the redirect bucket if you set that up. If you point www directly to the CloudFront as well, that’s fine; then handle redirect in app or simply allow both domains (maybe less ideal for SEO). Many prefer to redirect one domain to the other for a single canonical URL.
MX Records: If you plan to use email on this domain, you’d add MX records pointing to your email provider (not an AWS service unless you use WorkMail or SES inbound). This is beyond our current scope but just to be aware not to delete any necessary DNS records unrelated to the website.
TXT Records: Often used for verification (like Google site verification, or Amazon SES if you use it for emails from this domain, etc.). Also, if using Gmail/Google Workspace for email, you’d have SPF/DKIM records. Keep these in mind if applicable.
The ACM validation CNAME: If ACM created a CNAME for you to validate the cert, that will also appear in Route 53. Leave this as is; it has a long random name.
Route 53 DNS changes propagate very quickly (usually under a minute worldwide due to Route 53’s global network). However, DNS caching means if you had previous records, it might take time for clients to update. By default, Route 53 A records have a TTL of 300 seconds (5 minutes) which is fine. If you change an IP or target, expect a few minutes for everyone to see it.

Troubleshooting DNS & SSL:

After setting up, if your domain doesn’t resolve, check that the domain’s nameservers match the Route 53 NS records. A common mistake is to create a hosted zone in Route 53 but not update the registrar’s NS records, meaning nobody actually queries your Route 53 zone.
If the domain resolves but you get an HTTP error or timeout: verify the DNS target. For CloudFront, ensure the distribution is deployed and that the domain name is added as an alternate domain in CloudFront. CloudFront will not serve your custom domain unless it’s configured (it will reply with a CNAME mismatch error). Also verify the alias is correctly pointing to that distribution (in Route 53 console, the alias target should exactly match your CloudFront domain).
If HTTPS is not working but HTTP is: likely an SSL issue. Check CloudFront settings – was the ACM certificate associated? In a browser, see if it served a certificate. If it served the default *.cloudfront.net certificate, then your custom domain wasn’t recognized – usually means the distribution doesn’t have your domain on it, or the request didn’t reach CloudFront at all (DNS misconfiguration). If CloudFront says “SSL cert invalid” in logs, ensure the ACM cert is in us-east-1 and in Issued state, and that CloudFront is using it.
If you get a certificate warning about domain mismatch: double-check that you accessed the right domain (www vs non-www). The cert needs to cover whichever subdomain you’re using. If your cert only has niferche.com and you try www.niferche.com, it will warn (and vice versa). Solution: include both names in the cert or do a redirect so users don’t hit the uncovered domain.
Development vs Production: It’s wise to test the whole setup (S3/CloudFront/Route 53/ACM) in a staging environment or with a subdomain (like staging.niferche.com) before switching the production domain’s records. This way you can ensure everything is working without disrupting the live site if one exists.
Development Workflow and AWS Amplify Integration

With the AWS services configured (EC2, S3, Cognito, Route 53), you should establish a smooth development and deployment workflow. This involves setting up your development environment on Windows 11, using AWS Amplify (possibly the new Gen 2 features) for integrating front-end and back-end, and managing your code via Git (Project-Niferche repository) with continuous deployment.

Local Development Environment (Windows 11 & PowerShell)
Developing a React app on Windows 11 is straightforward:

Install the latest Node.js and npm on your machine (Amplify CLI and many tools require Node.js). Ensure you have at least Node 14+ for modern React and Amplify usage​
DOCS.AWS.AMAZON.COM
.
Use PowerShell or Windows Terminal as your command-line. You can run all necessary tools (Amplify CLI, AWS CLI, Create React App commands, etc.) here. It’s a good idea to upgrade PowerShell to the latest version or use Windows Terminal for a better experience.
Install the AWS CLI (v2) on Windows if you plan to interact with AWS services from terminal (optional but useful). You can configure your AWS credentials with aws configure. Alternatively, Amplify CLI will handle AWS access through an access key or AWS SSO.
Install the Amplify CLI globally via npm:
npm install -g @aws-amplify/cli
This gives you the amplify command in PowerShell​
DOCS.AWS.AMAZON.COM
. Run amplify configure once to set up a profile – it will open a browser for you to login to AWS and set up an IAM user if you don’t have one. This step links the CLI to your AWS account.
In your React project directory, initialize Amplify (if you haven’t): amplify init. This will create an Amplify project, ask for a name, environment name (like “dev”), AWS region, and which editor you use. It will also link to an AWS profile (created by amplify configure) for deploying. This stores some configs in amplify/ directory and an amplifyconfiguration.json or aws-exports.js for the front-end.
As you add features (auth, storage, API) via Amplify CLI, those configurations will be locally stored (as Infrastructure as Code, using CloudFormation templates under the hood). Always commit the amplify/ directory changes to your Git, so that your infrastructure setup is version-controlled and team members can pull it.
When you’re ready to create/update AWS resources, run amplify push. This will deploy any changes (e.g., creating the Cognito user pool or S3 bucket as defined). The CLI shows a summary of changes and you confirm. After a successful push, it updates aws-exports.js with any new resource info (like resource IDs, etc.).
Regular React development (running npm start) can continue as usual. Amplify provides a mock mode for some resources (like AppSync APIs or Lambdas) if needed, but for Cognito and S3, you typically just use the real services (Amplify will point the config to the cloud resources).
Using Git (Project-Niferche): Since your code is in a Git repository, use branching and merging as needed for features. You might have a main branch that auto-deploys to production, and a dev branch for staging, etc. Some guidelines:

Do not commit sensitive info. The aws-exports.js contains resource IDs and endpoints but nothing truly sensitive (no secret keys – Cognito client secrets are not used in JS apps). It’s fine to commit. If you ever manually put secrets (like API keys) in code, rather use environment variables or AWS Secrets Manager.
Use .gitignore to exclude things like node_modules/ and any build artifacts. Amplify CLI by default adds some files like local-aws-info.json to .gitignore.
Write clear commit messages including when you make infrastructure changes via Amplify, so you know which commit corresponds to adding auth or storage, etc.
AWS Amplify Gen 2 – Fullstack Deployment
AWS Amplify has introduced a “Gen 2” experience that is more code-centric for backend and integrates deeply with the Amplify Console for deployment​
AWS.AMAZON.COM
. Key aspects and how they apply:

Infrastructure as Code in TypeScript: Amplify Gen 2 allows you to define backend resources (like data models, Auth, functions) in TypeScript within your repo, rather than mainly through the CLI prompts. This means your backend configuration lives as code (with constructs similar to AWS CDK under the hood). It enables a more programmable approach to infrastructure. For instance, you define a data model in a file and Amplify interprets and provisions DynamoDB tables and GraphQL API.
Amplify Studio and new Console: The Amplify Console (web interface) in Gen 2 has improvements like viewing and editing data, user management for Cognito, and managing custom domains and branch deployments in one place​
AWS.AMAZON.COM
. You can access the Amplify Console by running amplify console or through the AWS web console under Amplify.
Git-based Continuous Deployment: Amplify supports connecting your repository so that every commit to certain branches triggers a new deploy (Frontend build and backend deployment). With Gen 2, this is even more streamlined – your Git is the “source of truth” for both application code and infrastructure​
DOCS.AMPLIFY.AWS
. If you push a commit that changes a backend TypeScript file (like adding a new data model) and also changes front-end code, the Amplify service will deploy those changes together.
Setting up Amplify CI/CD: In the Amplify Console, create a new App and connect it to your Git repository (Amplify can connect to GitHub, GitLab, Bitbucket, or AWS CodeCommit). You’ll authorize Amplify to access the repo. Then select the branch (e.g., main) to deploy. Amplify will detect the framework (React) and suggest a build script (which usually does npm ci && npm run build and then amplify push if backend is present, and then deploy the build to hosting). You can customize this amplify.yml build spec as needed (for example, to run tests).
Amplify Hosting: Amplify will create a hosting environment (similar to S3+CloudFront) for your app. It’s fully managed; you don’t directly see the S3 bucket or CloudFront distribution (unless you go digging), but they exist. Amplify gives you a preview URL and you can add custom domains. This hosting automatically handles invalidation on deploy, etc.
Custom Domain in Amplify: Instead of manually doing Route 53 and CloudFront config, Amplify Console can automate it. In the Amplify Console domain management, add niferche.com. If Route 53 is managing that domain in the same AWS account, Amplify will offer to create the necessary DNS records and request the ACM certificate on your behalf (basically one-click setup). It uses ACM (in us-east-1 for global) behind the scenes and validates the domain via DNS. After a few minutes, your custom domain will be linked to the Amplify deployment. If you prefer manual control or the domain is in a different account, you can still manage DNS yourself by creating CNAMEs to Amplify’s domain and verifying, but the automated way is easier.
Branch Deployments & Previews: A cool Amplify feature is deploying multiple branches. For instance, your dev branch could be connected to a separate Amplify backend environment (like an Amplify “dev” environment) and get its own URL (dev.niferche.com or a Amplify-provided subdomain). Amplify Gen 2 also introduced Pull Request Previews – where each PR can spin up a temporary deployment for testing. These capabilities can accelerate testing new features.
Cost: Amplify Hosting pricing is based on build minutes and data storage/transfer. The free tier gives 1000 build minutes per month and 15 GB storage, 5 GB bandwidth (these numbers might change, but as of writing). Beyond that, it’s something like $0.01 per build minute and $0.023 per GB served. It’s generally very cost-effective for moderate usage, and you avoid managing servers.

Bringing It All Together
With the above services configured and Amplify set up, the development cycle would be:

Code your React app (perhaps using Amplify libraries to call Cognito, etc.). Test it locally (npm start can be used with a local config that points to dev resources).
When ready to deploy a change, push to your Git repository. Amplify will pick up the commit, run the build, test, and deploy automatically to your hosting. In a few minutes, your changes are live at niferche.com (if you set that up) or the appropriate domain. No manual SSH or file upload needed.
The Cognito user pool, S3 buckets, etc., remain in AWS and Amplify CLI will manage updates to those if you run changes via CLI. If using Gen 2 and defining resources in code, then those updates also get deployed via the same pipeline.
Monitor the app via AWS CloudWatch (for Lambda functions or any CloudFront logs) and the Amplify Console, which shows build & deploy logs. Amazon Cognito has CloudWatch logs for errors (like if a Lambda trigger fails).
If you need to troubleshoot an AWS resource, you can still go to the AWS console for that service (e.g., check Cognito users in the Cognito console, or see S3 objects in the bucket). Amplify doesn’t hide these; it just creates and manages them.
Additional Tips:

Use AWS CloudTrail to audit changes in your AWS resources. For example, if someone on the team changed a Route 53 record or a Cognito setting manually, CloudTrail logs will show it. This can help debugging unexpected config changes.
Implement Monitoring & Alerts for your platform. Consider AWS Pinpoint or Amazon SNS for sending notifications (like user signup emails, etc.), and Amazon CloudWatch Alarms for any error spikes (Amplify Console can also hook into Slack or email to notify if a deployment fails).
Plan for scalability from day one: using S3, CloudFront, Cognito (all fully managed) means you can handle sudden spikes without much trouble. If your backend is on EC2, ensure Auto Scaling is configured to handle bursts. For serverless backends (if you choose API Gateway + Lambda via Amplify API category), scaling is mostly automatic.
Keep an eye on costs: While initial usage might be covered by free tiers (S3 5GB, Cognito 10k users, CloudFront 1TB, Amplify free builds), as you grow, set up AWS Budgets alerts per service. For instance, an alert if monthly EC2 cost exceeds $50, or if CloudFront data transfer exceeds some threshold, etc.
Conclusion

Developing a React-based content platform on AWS is highly feasible and can be done in a scalable, secure manner by combining the strengths of EC2, S3, Cognito, and Route 53:

EC2 provides flexibility for running servers (for dynamic content or custom needs) with control over scaling and cost (through right-sizing and auto scaling)​
AWS.AMAZON.COM
. It’s the go-to for any compute needs that aren’t covered by fully managed services.
S3 offers a durable and low-cost solution for hosting static content and storing user data. It eliminates the need for servers to serve files, and when paired with CloudFront, delivers high performance and security (with WAF integration) for your site​
DOCS.AWS.AMAZON.COM
.
Cognito simplifies building a robust auth system, handling everything from basic sign-ups to federated logins. With Amplify, implementing auth in the React app is quick and avoids the pitfalls of rolling your own authentication (like storing passwords). Cognito scales to millions of users and has a generous free tier for MAUs​
AWS.AMAZON.COM
.
Route 53 ties it all together by giving your platform a professional presence on your own domain, with reliable DNS routing and easy integration to AWS endpoints via alias records​
DOCS.AWS.AMAZON.COM
. It works hand-in-hand with ACM to provide SSL so your users’ data is secure in transit.
AWS Amplify (including the new Gen 2 features) acts as the glue for front-end developers – abstracting away a lot of the complexity and allowing you to focus on your application code. It automates resource provisioning, CI/CD deployment, and even offers a visual interface for data and users, accelerating development​
AWS.AMAZON.COM
​
AWS.AMAZON.COM
.