pipeline {
  agent any

  environment {
    IMAGE_NAME = "hello-devops"
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    CONTAINER_NAME = "hello-devops-${env.BUILD_NUMBER}"
    APP_PORT = "3000"
    HOST_PORT = "8000" // host port to map for verification
  }

  stages {
    stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/shreyastambe103/Devops-Practice.git'
            }
        }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
        }
      }
    }

    stage('Run Container') {
      steps {
        script {
          // remove any old container with same name (safer in repeated runs)
          sh """
            if docker ps -a --format '{{.Names}}' | grep -q ${CONTAINER_NAME}; then
              docker rm -f ${CONTAINER_NAME} || true
            fi
            docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${APP_PORT} ${IMAGE_NAME}:${IMAGE_TAG}
            sleep 2
            echo "Container started. Listing containers:"
            docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
          """
        }
      }
    }

    stage('Smoke Test') {
      steps {
        script {
            echo "Running smoke test..."
            def containerIP = sh(script: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' hello-devops-3", returnStdout: true).trim()
            echo "Container IP: ${containerIP}"
            sh "curl -sSf http://${containerIP}:3000"
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline completed SUCCESS"
    }
    failure {
      echo "Pipeline FAILED — check logs"
      // keep the container for debugging; optionally remove it here if desired
    }
  }
}
