pipeline {
    agent any
    
    environment {
        APP_NAME = 'imtihan-display'
        APP_PORT = '3007'
        SOCKET_PORT = '3008'
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
                    docker ps | grep imtihan-display || (echo "Container not running!" && exit 1)
                    echo "✅ Container is running"
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
