pipeline {
    agent any

    environment {
        IMAGE_NAME = "hello-devops"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = "${IMAGE_NAME}-${BUILD_NUMBER}"
        APP_PORT = "8000"
        INTERNAL_PORT = "3000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📦 Checking out repository..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                script {
                    echo "🧹 Cleaning up old containers..."
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "🚀 Running new container..."
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${INTERNAL_PORT} ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "sleep 2"
                    sh "docker ps --filter name=${CONTAINER_NAME} --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
                }
            }
        }

        stage('Test Application') {
            steps {
                script {
                    echo "🔍 Testing container response..."
                    sh "curl -f http://localhost:${APP_PORT} || (echo '❌ Application not responding' && exit 1)"
                }
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline completed at ${new Date()}"
        }
        failure {
            echo "❌ Build failed! Check logs for details."
        }
    }
}
