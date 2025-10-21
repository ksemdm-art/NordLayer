#!/usr/bin/env python3
"""
Performance testing script for NordLayer 3D Printing Platform
Runs comprehensive performance tests and generates reports
"""

import argparse
import json
import time
import requests
import subprocess
import sys
from pathlib import Path
from datetime import datetime
import matplotlib.pyplot as plt
import pandas as pd


class PerformanceTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = {}
        self.start_time = None
        
    def test_endpoint_performance(self, endpoint, method="GET", data=None, iterations=100):
        """Test individual endpoint performance"""
        print(f"Testing {method} {endpoint}...")
        
        response_times = []
        errors = 0
        
        for i in range(iterations):
            start = time.time()
            try:
                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", timeout=30)
                elif method == "POST":
                    response = requests.post(f"{self.base_url}{endpoint}", json=data, timeout=30)
                
                response_time = (time.time() - start) * 1000  # Convert to ms
                response_times.append(response_time)
                
                if response.status_code >= 400:
                    errors += 1
                    
            except Exception as e:
                errors += 1
                response_times.append(30000)  # 30s timeout
                
            if i % 10 == 0:
                print(f"  Progress: {i}/{iterations}")
        
        # Calculate statistics
        avg_response_time = sum(response_times) / len(response_times)
        min_response_time = min(response_times)
        max_response_time = max(response_times)
        p95_response_time = sorted(response_times)[int(0.95 * len(response_times))]
        error_rate = (errors / iterations) * 100
        
        result = {
            "endpoint": endpoint,
            "method": method,
            "iterations": iterations,
            "avg_response_time": avg_response_time,
            "min_response_time": min_response_time,
            "max_response_time": max_response_time,
            "p95_response_time": p95_response_time,
            "error_rate": error_rate,
            "response_times": response_times
        }
        
        self.results[f"{method} {endpoint}"] = result
        return result
    
    def test_critical_endpoints(self):
        """Test all critical endpoints"""
        print("Testing critical endpoints...")
        
        # Test GET endpoints
        endpoints = [
            "/health",
            "/api/v1/projects",
            "/api/v1/projects?page=1&per_page=20",
            "/api/v1/services",
            "/api/v1/articles",
            "/api/v1/categories",
            "/api/v1/colors"
        ]
        
        for endpoint in endpoints:
            self.test_endpoint_performance(endpoint, iterations=50)
        
        # Test POST endpoints (with sample data)
        order_data = {
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890",
            "service_id": 1,
            "specifications": {
                "material": "PLA",
                "quality": "normal",
                "infill": 20
            },
            "delivery_needed": "false",
            "source": "WEB"
        }
        
        # Note: This would create actual orders, so use with caution
        # self.test_endpoint_performance("/api/v1/orders", "POST", order_data, iterations=10)
    
    def run_load_test(self, users=10, duration="2m"):
        """Run Locust load test"""
        print(f"Running load test with {users} users for {duration}...")
        
        # Create results directory
        results_dir = Path("scripts/load-testing/results") / datetime.now().strftime("%Y%m%d_%H%M%S")
        results_dir.mkdir(parents=True, exist_ok=True)
        
        # Run Locust
        cmd = [
            "locust",
            "-f", "scripts/load-testing/locustfile.py",
            "--host", self.base_url,
            "--users", str(users),
            "--spawn-rate", "2",
            "--run-time", duration,
            "--html", str(results_dir / "load_test_report.html"),
            "--csv", str(results_dir / "load_test"),
            "--headless"
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            if result.returncode == 0:
                print("Load test completed successfully")
                return str(results_dir)
            else:
                print(f"Load test failed: {result.stderr}")
                return None
        except subprocess.TimeoutExpired:
            print("Load test timed out")
            return None
    
    def generate_performance_report(self):
        """Generate performance report"""
        if not self.results:
            print("No performance data available")
            return
        
        print("\n" + "="*60)
        print("PERFORMANCE TEST RESULTS")
        print("="*60)
        
        # Summary table
        print(f"{'Endpoint':<30} {'Avg (ms)':<10} {'P95 (ms)':<10} {'Errors (%)':<10}")
        print("-" * 60)
        
        for endpoint, result in self.results.items():
            print(f"{endpoint:<30} {result['avg_response_time']:<10.1f} "
                  f"{result['p95_response_time']:<10.1f} {result['error_rate']:<10.1f}")
        
        # Performance thresholds
        print("\n" + "="*60)
        print("PERFORMANCE ANALYSIS")
        print("="*60)
        
        issues = []
        for endpoint, result in self.results.items():
            if result['avg_response_time'] > 500:
                issues.append(f"⚠️  {endpoint}: High average response time ({result['avg_response_time']:.1f}ms)")
            
            if result['p95_response_time'] > 1000:
                issues.append(f"🔴 {endpoint}: Very high P95 response time ({result['p95_response_time']:.1f}ms)")
            
            if result['error_rate'] > 1:
                issues.append(f"🔴 {endpoint}: High error rate ({result['error_rate']:.1f}%)")
        
        if issues:
            print("Issues found:")
            for issue in issues:
                print(f"  {issue}")
        else:
            print("✅ All endpoints performing within acceptable limits")
        
        # Recommendations
        print("\n" + "="*60)
        print("RECOMMENDATIONS")
        print("="*60)
        
        slow_endpoints = [ep for ep, result in self.results.items() 
                         if result['avg_response_time'] > 300]
        
        if slow_endpoints:
            print("Consider optimizing these endpoints:")
            for endpoint in slow_endpoints:
                result = self.results[endpoint]
                print(f"  - {endpoint}: {result['avg_response_time']:.1f}ms average")
                
                if "projects" in endpoint:
                    print("    * Add database indexes on frequently queried columns")
                    print("    * Implement caching for project lists")
                    print("    * Consider pagination optimization")
                elif "orders" in endpoint:
                    print("    * Optimize order creation workflow")
                    print("    * Add database connection pooling")
                elif "files" in endpoint:
                    print("    * Implement file upload optimization")
                    print("    * Consider using CDN for file serving")
        
        # Generate charts
        self.generate_charts()
    
    def generate_charts(self):
        """Generate performance charts"""
        if not self.results:
            return
        
        # Response time comparison chart
        endpoints = list(self.results.keys())
        avg_times = [self.results[ep]['avg_response_time'] for ep in endpoints]
        p95_times = [self.results[ep]['p95_response_time'] for ep in endpoints]
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
        
        # Average response times
        ax1.bar(range(len(endpoints)), avg_times, color='skyblue', alpha=0.7)
        ax1.set_title('Average Response Times')
        ax1.set_ylabel('Response Time (ms)')
        ax1.set_xticks(range(len(endpoints)))
        ax1.set_xticklabels([ep.split()[-1] for ep in endpoints], rotation=45, ha='right')
        ax1.axhline(y=500, color='orange', linestyle='--', label='Warning (500ms)')
        ax1.axhline(y=1000, color='red', linestyle='--', label='Critical (1000ms)')
        ax1.legend()
        
        # P95 response times
        ax2.bar(range(len(endpoints)), p95_times, color='lightcoral', alpha=0.7)
        ax2.set_title('95th Percentile Response Times')
        ax2.set_ylabel('Response Time (ms)')
        ax2.set_xticks(range(len(endpoints)))
        ax2.set_xticklabels([ep.split()[-1] for ep in endpoints], rotation=45, ha='right')
        ax2.axhline(y=1000, color='orange', linestyle='--', label='Warning (1000ms)')
        ax2.axhline(y=2000, color='red', linestyle='--', label='Critical (2000ms)')
        ax2.legend()
        
        plt.tight_layout()
        
        # Save chart
        chart_path = Path("scripts/load-testing/results") / f"performance_chart_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        chart_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(chart_path, dpi=300, bbox_inches='tight')
        print(f"\nPerformance chart saved to: {chart_path}")
        
        plt.close()
    
    def save_results(self):
        """Save results to JSON file"""
        if not self.results:
            return
        
        results_file = Path("scripts/load-testing/results") / f"performance_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        results_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Prepare data for JSON serialization
        json_results = {}
        for endpoint, result in self.results.items():
            json_result = result.copy()
            # Remove response_times array to reduce file size
            json_result.pop('response_times', None)
            json_results[endpoint] = json_result
        
        with open(results_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'base_url': self.base_url,
                'results': json_results
            }, f, indent=2)
        
        print(f"Results saved to: {results_file}")


def main():
    parser = argparse.ArgumentParser(description='NordLayer Performance Testing')
    parser.add_argument('--url', default='http://localhost:8000', 
                       help='Base URL for testing (default: http://localhost:8000)')
    parser.add_argument('--test-type', choices=['endpoints', 'load', 'both'], 
                       default='both', help='Type of test to run')
    parser.add_argument('--users', type=int, default=10, 
                       help='Number of concurrent users for load test')
    parser.add_argument('--duration', default='2m', 
                       help='Duration for load test (e.g., 2m, 30s)')
    
    args = parser.parse_args()
    
    tester = PerformanceTester(args.url)
    
    print(f"Starting performance tests against: {args.url}")
    print(f"Test type: {args.test_type}")
    print("-" * 60)
    
    if args.test_type in ['endpoints', 'both']:
        tester.test_critical_endpoints()
    
    if args.test_type in ['load', 'both']:
        tester.run_load_test(args.users, args.duration)
    
    if args.test_type in ['endpoints', 'both']:
        tester.generate_performance_report()
        tester.save_results()
    
    print("\nPerformance testing completed!")


if __name__ == "__main__":
    main()