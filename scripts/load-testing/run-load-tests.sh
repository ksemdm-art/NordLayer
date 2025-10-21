#!/bin/bash

# Load Testing Script for 3D Printing Platform
# Usage: ./run-load-tests.sh [environment] [test-type]

set -e

ENVIRONMENT=${1:-local}
TEST_TYPE=${2:-basic}

# Configuration
case $ENVIRONMENT in
    "local")
        HOST="http://localhost:8000"
        ;;
    "staging")
        HOST="https://staging.nordlayer.com"
        ;;
    "production")
        echo "WARNING: Running load tests against production!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Aborted."
            exit 1
        fi
        HOST="https://nordlayer.com"
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        echo "Usage: $0 [local|staging|production] [basic|stress|spike]"
        exit 1
        ;;
esac

echo "Running load tests against: $HOST"
echo "Test type: $TEST_TYPE"

# Create results directory
RESULTS_DIR="scripts/load-testing/results/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RESULTS_DIR"

# Run tests based on type
case $TEST_TYPE in
    "basic")
        echo "Running basic load test (10 users, 2 minutes)"
        locust -f scripts/load-testing/locustfile.py \
               --host="$HOST" \
               --users=10 \
               --spawn-rate=2 \
               --run-time=2m \
               --html="$RESULTS_DIR/basic_report.html" \
               --csv="$RESULTS_DIR/basic" \
               --headless
        ;;
    "stress")
        echo "Running stress test (50 users, 5 minutes)"
        locust -f scripts/load-testing/locustfile.py \
               --host="$HOST" \
               --users=50 \
               --spawn-rate=5 \
               --run-time=5m \
               --html="$RESULTS_DIR/stress_report.html" \
               --csv="$RESULTS_DIR/stress" \
               --headless
        ;;
    "spike")
        echo "Running spike test (100 users, 3 minutes)"
        locust -f scripts/load-testing/locustfile.py \
               --host="$HOST" \
               --users=100 \
               --spawn-rate=10 \
               --run-time=3m \
               --html="$RESULTS_DIR/spike_report.html" \
               --csv="$RESULTS_DIR/spike" \
               --headless
        ;;
    *)
        echo "Unknown test type: $TEST_TYPE"
        echo "Available types: basic, stress, spike"
        exit 1
        ;;
esac

echo "Load test completed. Results saved to: $RESULTS_DIR"
echo "Open $RESULTS_DIR/*_report.html to view detailed results"

# Generate summary
echo "=== LOAD TEST SUMMARY ===" > "$RESULTS_DIR/summary.txt"
echo "Environment: $ENVIRONMENT" >> "$RESULTS_DIR/summary.txt"
echo "Host: $HOST" >> "$RESULTS_DIR/summary.txt"
echo "Test Type: $TEST_TYPE" >> "$RESULTS_DIR/summary.txt"
echo "Date: $(date)" >> "$RESULTS_DIR/summary.txt"
echo "" >> "$RESULTS_DIR/summary.txt"

if [ -f "$RESULTS_DIR/${TEST_TYPE}_stats.csv" ]; then
    echo "=== RESPONSE TIME STATS ===" >> "$RESULTS_DIR/summary.txt"
    head -n 20 "$RESULTS_DIR/${TEST_TYPE}_stats.csv" >> "$RESULTS_DIR/summary.txt"
fi

echo "Summary saved to: $RESULTS_DIR/summary.txt"