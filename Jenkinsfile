pipeline {
    agent any
    
    environment {
        APP_NAME = 'imtihan-display'
        APP_PORT = '3010'
        SOCKET_PORT = '3011'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build & Deploy') {
            steps {
                echo 'Building Docker image and deploying...'
                sh '''
                    set -e
                    
                    # Check Docker Compose availability
                    if docker compose version >/dev/null 2>&1; then
                        COMPOSE="docker compose"
                    elif command -v docker-compose >/dev/null 2>&1; then
                        COMPOSE="docker-compose"
                    else
                        echo "Docker Compose is not installed on this Jenkins server."
                        exit 1
                    fi
                    
                    # Stop and remove old containers
                    $COMPOSE -f docker-compose.prod.yml down || true
                    
                    # Force stop & remove any existing conflicting container
                    if docker ps -a --format '{{.Names}}' | grep -Eq "^imtihan-display$"; then
                        echo "Removing conflicting container..."
                        docker rm -f imtihan-display || true
                    fi
                    
                    # Build and start new containers
                    $COMPOSE -f docker-compose.prod.yml up -d --build
                    
                    echo "Deployment complete!"
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Verifying deployment...'
                sh '''
                    sleep 5
                    STATUS=$(docker inspect -f '{{.State.Status}}' imtihan-display || echo "not-found")
                    echo "Container status: $STATUS"
                    if [ "$STATUS" != "running" ]; then
                        echo "? Container is not running successfully! Status: $STATUS"
                        docker logs imtihan-display --tail 100
                        exit 1
                    fi
                    echo "? Container is running successfully"
                '''
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Cleaning up old Docker images...'
                sh 'docker image prune -f || true'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "Imtihan Display is now running on:"
            echo "  - Next.js App:  http://192.168.1.60:${APP_PORT}"
            echo "  - Socket.IO:    http://192.168.1.60:${SOCKET_PORT}"
        }
        failure {
            echo '❌ Pipeline failed!'
            sh 'docker ps -a | grep imtihan-display || true'
            sh 'docker logs imtihan-display --tail 50 || true'
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
