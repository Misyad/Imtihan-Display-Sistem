pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20.x'
        DEPLOY_ENV = 'production'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Running ESLint...'
                sh 'npm run lint'
            }
        }
        
        stage('Type Check') {
            steps {
                echo 'Running TypeScript type checking...'
                sh 'npx tsc --noEmit'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building Next.js application...'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Uncomment when tests are implemented
                // sh 'npm test'
                echo 'Tests not yet implemented - skipping'
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security audit...'
                sh 'npm audit --audit-level=moderate || true'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: '.next/**/*', fingerprint: true
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                // Add your staging deployment commands here
                sh '''
                    echo "Staging deployment would happen here"
                    # Example: scp -r .next user@staging-server:/app
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'master'
            }
            steps {
                echo 'Deploying to production environment...'
                // Add your production deployment commands here
                sh '''
                    echo "Production deployment would happen here"
                    # Example: vercel --prod
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            // Send notification (e.g., Slack, email)
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notification
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
