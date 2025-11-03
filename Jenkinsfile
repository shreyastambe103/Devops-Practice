pipeline {
    agent any

    environment {
        IMAGE_NAME = "hello-devops"
        IMAGE_TAG = "8"
        CONTAINER_NAME = "${IMAGE_NAME}-${IMAGE_TAG}"
        HOST_PORT = "8000"
        CONTAINER_PORT = "3000"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo "📦 Cloning repository..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                script {
                    echo "🧹 Cleaning up old containers using port ${HOST_PORT}..."
                    sh """
                    # Find any container exposing port 8000
                    old_container=\$(docker ps -q --filter "publish=${HOST_PORT}")
                    if [ ! -z "\$old_container" ]; then
                      echo "⚠️ Stopping container using port ${HOST_PORT}..."
                      docker stop \$old_container || true
                      docker rm \$old_container || true
                    fi

                    # Also remove container with same name if it exists
                    docker rm -f ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    echo "🚀 Running new container..."
                    sh """
                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      -p ${HOST_PORT}:${CONTAINER_PORT} \
                      ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "🔍 Verifying deployment..."
                    sh """
                    sleep 3
                    app_ip=\$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${CONTAINER_NAME})
                    echo "App is running at IP: \$app_ip"
                    echo "Checking if app is reachable at http://\$app_ip:${CONTAINER_PORT}"
                    curl -f http://\$app_ip:${CONTAINER_PORT} || (echo '❌ Application not responding!' && exit 1)
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Visit http://localhost:${HOST_PORT}"
        }
        failure {
            echo "❌ Deployment failed. Check logs above."
        }
    }
}
