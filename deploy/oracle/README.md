# Oracle Cloud Deployment Guide

This guide is for the easiest beginner setup:

- 1 Oracle Cloud Always Free Ubuntu VM
- MySQL installed on the same VM
- Spring Boot backend running as a `systemd` service
- React frontend built into static files
- Nginx serving the frontend and proxying `/api` and WebSocket traffic

This is the easiest Oracle setup for this project because everything lives on one server.

## Architecture

- Frontend files are served from: `/var/www/cybercrime`
- Backend JAR runs from: `/opt/cybercrime/backend`
- Backend uploads go to: `/opt/cybercrime/uploads`
- Backend env file lives at: `/opt/cybercrime/backend.env`
- Nginx proxies:
  - `/api/*` -> `http://127.0.0.1:8081`
  - `/api/ws` -> `ws://127.0.0.1:8081/ws`

## Before You Start

You need:

- Oracle Cloud Free Tier account
- GitHub repository containing this project
- SSH key pair

Recommended Oracle VM:

- Ubuntu
- Always Free shape

Oracle docs:

- Oracle Cloud Free Tier overview:
  https://docs.oracle.com/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- Launch a compute instance:
  https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/launchinginstance.htm

## Step 1: Create the Oracle VM

In Oracle Cloud:

1. Open the Oracle Cloud Console.
2. Create a Compute instance.
3. Choose:
   - Ubuntu image
   - Always Free eligible shape
4. Upload or paste your SSH public key.
5. Create the instance.

After creation, note:

- Public IP address

## Step 2: Open Network Ports

You need these inbound ports:

- `22` for SSH
- `80` for HTTP
- `443` for HTTPS later if you add SSL

Oracle networking/security docs:

- Security lists and rules:
  https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/securityrules.htm

## Step 3: Connect to the VM

From your terminal:

```bash
ssh -i /path/to/private_key ubuntu@YOUR_PUBLIC_IP
```

## Step 4: Install Required Software

Run these commands on the VM:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven nginx mysql-server git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Check versions:

```bash
java -version
mvn -version
node -v
npm -v
nginx -v
mysql --version
```

## Step 5: Create the App Directories

```bash
sudo mkdir -p /opt/cybercrime/backend
sudo mkdir -p /opt/cybercrime/uploads
sudo mkdir -p /var/www/cybercrime
sudo chown -R ubuntu:ubuntu /opt/cybercrime
sudo chown -R ubuntu:ubuntu /var/www/cybercrime
```

## Step 6: Set Up MySQL

Open MySQL:

```bash
sudo mysql
```

Inside MySQL run:

```sql
CREATE DATABASE cyber_crime_tracker;
CREATE USER 'cybercrime'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON cyber_crime_tracker.* TO 'cybercrime'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 7: Clone Your Project

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

## Step 8: Build the Backend

```bash
cd backend
mvn clean package -DskipTests
```

Copy the built JAR:

```bash
cp target/cyber-crime-tracker-1.0.0.jar /opt/cybercrime/backend/
```

## Step 9: Create the Backend Environment File

Use this repo file as the base:

- [`deploy/oracle/backend.env.example`](./backend.env.example)

On the VM:

```bash
cp deploy/oracle/backend.env.example /opt/cybercrime/backend.env
nano /opt/cybercrime/backend.env
```

Set values like:

```env
DB_URL=jdbc:mysql://127.0.0.1:3306/cyber_crime_tracker?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=cybercrime
DB_PASSWORD=change_this_password
SERVER_PORT=8081
JWT_SECRET=replace_with_a_long_random_secret
MAIL_USERNAME=no-reply@example.com
MAIL_PASSWORD=replace_with_real_mail_password
FRONTEND_URL=http://YOUR_PUBLIC_IP
FILE_STORAGE_PATH=/opt/cybercrime/uploads
```

If you have a domain, replace `http://YOUR_PUBLIC_IP` with your domain.

## Step 10: Configure the Backend as a Service

Use the provided service file:

- [`deploy/oracle/systemd/cybercrime-backend.service`](./systemd/cybercrime-backend.service)

Copy it:

```bash
sudo cp deploy/oracle/systemd/cybercrime-backend.service /etc/systemd/system/
```

Reload and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cybercrime-backend
sudo systemctl start cybercrime-backend
```

Check status:

```bash
sudo systemctl status cybercrime-backend
```

Check logs:

```bash
journalctl -u cybercrime-backend -f
```

## Step 11: Build the Frontend

Use the Oracle-specific frontend env:

- [`frontend/.env.oracle.example`](../../frontend/.env.oracle.example)

From the project root:

```bash
cd frontend
cp .env.oracle.example .env
npm install
npm run build
```

Copy built files:

```bash
cp -r dist/* /var/www/cybercrime/
```

## Step 12: Configure Nginx

Use the provided config:

- [`deploy/oracle/nginx/cybercrime.conf`](./nginx/cybercrime.conf)

Copy it:

```bash
sudo cp deploy/oracle/nginx/cybercrime.conf /etc/nginx/sites-available/cybercrime
sudo ln -s /etc/nginx/sites-available/cybercrime /etc/nginx/sites-enabled/cybercrime
sudo rm -f /etc/nginx/sites-enabled/default
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 13: Open the App

Visit:

```text
http://YOUR_PUBLIC_IP
```

Backend direct URL:

```text
http://YOUR_PUBLIC_IP/api
```

Swagger:

```text
http://YOUR_PUBLIC_IP/api/swagger-ui/index.html
```

## Step 14: Default Admin Login

- Email: `admin@cybercrime.local`
- Password: `Admin@123`

## Step 15: Optional HTTPS

Once the app works with HTTP and you have a domain:

1. Point your domain to the VM public IP
2. Install Certbot
3. Enable HTTPS with Let's Encrypt

Commands:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Why This Oracle Option Is Easier

For this project, the easiest option is:

**Oracle VM + same-server frontend**

Why:

- one machine to understand
- one public IP
- no cross-platform deployment confusion
- uploads can stay on the same server
- MySQL can be local
- Nginx handles both frontend and backend routing

Compared with separating services, this is much easier for a beginner.

## What To Do When You Update the App

### Backend update

```bash
cd ~/YOUR_REPO/backend
mvn clean package -DskipTests
cp target/cyber-crime-tracker-1.0.0.jar /opt/cybercrime/backend/
sudo systemctl restart cybercrime-backend
```

### Frontend update

```bash
cd ~/YOUR_REPO/frontend
npm install
npm run build
rm -rf /var/www/cybercrime/*
cp -r dist/* /var/www/cybercrime/
sudo systemctl reload nginx
```

## Troubleshooting

### Backend not starting

```bash
sudo systemctl status cybercrime-backend
journalctl -u cybercrime-backend -f
```

### Nginx not loading

```bash
sudo nginx -t
sudo systemctl status nginx
```

### MySQL login issues

```bash
mysql -u cybercrime -p
```

### CORS or WebSocket issues

Check:

- `FRONTEND_URL` in `/opt/cybercrime/backend.env`
- frontend was built with `VITE_API_BASE_URL=/api`
- Nginx config was reloaded after changes

## Beginner Summary

If you want the easiest Oracle deployment:

- put frontend and backend on the same VM
- use Nginx in front
- use systemd for backend
- use MySQL on the same VM

That is the simplest path for this project.
