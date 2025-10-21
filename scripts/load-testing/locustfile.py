"""
Load testing configuration for 3D Printing Platform using Locust
"""
import json
import random
from locust import HttpUser, task, between
from locust.exception import RescheduleTask


class WebsiteUser(HttpUser):
    """Simulate regular website users"""
    wait_time = between(1, 5)
    
    def on_start(self):
        """Setup user session"""
        self.client.verify = False
        
    @task(3)
    def view_homepage(self):
        """Load homepage"""
        self.client.get("/")
        
    @task(2)
    def browse_gallery(self):
        """Browse project gallery"""
        response = self.client.get("/api/v1/projects")
        if response.status_code == 200:
            projects = response.json().get("data", [])
            if projects:
                # View random project details
                project = random.choice(projects)
                self.client.get(f"/api/v1/projects/{project['id']}")
                
    @task(2)
    def view_services(self):
        """View services page"""
        self.client.get("/api/v1/services")
        
    @task(1)
    def read_articles(self):
        """Browse blog articles"""
        response = self.client.get("/api/v1/articles")
        if response.status_code == 200:
            articles = response.json().get("data", [])
            if articles:
                article = random.choice(articles)
                self.client.get(f"/api/v1/articles/{article['id']}")


class OrderUser(HttpUser):
    """Simulate users creating orders"""
    wait_time = between(2, 8)
    
    def on_start(self):
        self.client.verify = False
        
    @task(1)
    def create_order(self):
        """Create a test order"""
        # First get services
        services_response = self.client.get("/api/v1/services")
        if services_response.status_code != 200:
            raise RescheduleTask()
            
        services = services_response.json().get("data", [])
        if not services:
            raise RescheduleTask()
            
        service = random.choice(services)
        
        # Create order payload
        order_data = {
            "customer_name": f"Test User {random.randint(1000, 9999)}",
            "customer_email": f"test{random.randint(1000, 9999)}@example.com",
            "customer_phone": f"+7900{random.randint(1000000, 9999999)}",
            "service_id": service["id"],
            "specifications": {
                "material": random.choice(["PLA", "ABS", "PETG"]),
                "quality": random.choice(["draft", "normal", "high"]),
                "infill": random.choice([15, 20, 25])
            },
            "delivery_needed": "false",
            "source": "WEB"
        }
        
        # Submit order
        with self.client.post("/api/v1/orders", 
                            json=order_data,
                            catch_response=True) as response:
            if response.status_code == 201:
                response.success()
            else:
                response.failure(f"Order creation failed: {response.status_code}")


class AdminUser(HttpUser):
    """Simulate admin panel usage"""
    wait_time = between(3, 10)
    
    def on_start(self):
        self.client.verify = False
        # Login as admin (simplified for testing)
        self.token = None
        
    @task(2)
    def view_orders(self):
        """View orders list"""
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        self.client.get("/api/v1/admin/orders", headers=headers)
        
    @task(1)
    def view_projects(self):
        """View projects in admin"""
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        self.client.get("/api/v1/admin/projects", headers=headers)