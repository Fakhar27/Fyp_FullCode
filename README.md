# AI-Powered Reel Generator

An innovative AI-powered tool that generates full-featured video reels from simple text prompts. This project combines multiple cutting-edge AI technologies to automate the time-consuming process of reel creation.

## 🌟 Features

- **Text-to-Reel Generation**: Convert simple text prompts into complete video reels
- **AI-Powered Components**:
  - Image generation using state-of-the-art models
  - Voice synthesis and audio generation
  - Automatic transcription and subtitle creation
- **Customization Options**: Control various aspects of the generated reels
- **User Authentication**: Secure user accounts with JWT-based authentication

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with Vite
- **State Management**: React Context API
- **Styling**: CSS/SCSS
- **API Communication**: Fetch API
- **Authentication**: JWT token-based auth

### Backend
- **Framework**: Django with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT with Simple JWT
- **Media Processing**: MoviePy

### AI Services
- **Image Generation**: DreamShaper XL
- **Audio Generation**: Suno Bark
- **Transcription**: Whisper
- **Orchestration**: LangChain
- **Text Generation**: Cohere

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Development Environment**: Fully containerized local development

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- API keys for:
  - [Cohere](https://dashboard.cohere.com/api-keys)
  - [LangChain](https://langchain.com/)
  - [LangSmith](https://smith.langchain.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-reel-generator.git
   cd ai-reel-generator
   ```

2. **Set up environment variables**
   
   Create a `.env.docker` file in the root directory with the following variables:
   ```
   # Django settings
   DEBUG=1
   SECRET_KEY=your_secret_key
   
   # Database
   DATABASE_URL=postgresql://postgres:Fakhar27@db:5432/genAI
   
   # AI Service API Keys
   COHERE_API_KEY=your_cohere_api_key
   LANGCHAIN_API_KEY=your_langchain_api_key
   LANGCHAIN_PROJECT=your_langchain_project
   LANGSMITH_API_KEY=your_langsmith_api_key
   ```

3. **Launch the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - Admin interface: [http://localhost:8000/admin](http://localhost:8000/admin)

### Stopping the Application

```bash
docker-compose down
```

To remove all data including database volumes:
```bash
docker-compose down -v
```

## 📁 Project Structure

```
ai-reel-generator/
├── backend/                # Django backend
│   ├── genAI/              # Main Django app
│   ├── Dockerfile          # Backend container configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend container configuration
├── ai-services/            # AI service containers
│   ├── image-generation/   # Image generation service
│   ├── sound-generation/   # Sound generation service
│   └── whisper/            # Transcription service
├── docker-compose.yml      # Docker Compose configuration
└── .env.docker            # Environment variables for Docker
```

## 🔧 Advanced Configuration

### Scaling AI Services

For production deployments, you may want to scale AI services independently. This can be achieved by modifying the `docker-compose.yml` file:

```yaml
services:
  image-service:
    deploy:
      replicas: 2
```

### GPU Support

For improved performance, enable GPU support by modifying the AI service sections in `docker-compose.yml`:

```yaml
services:
  image-service:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```
## 🙏 Acknowledgements

- [Cohere](https://cohere.com/) for text generation capabilities
- [LangChain](https://langchain.com/) for AI orchestration
- [Suno Bark](https://github.com/suno-ai/bark) for audio generation
- [OpenAI Whisper](https://github.com/openai/whisper) for transcription
- [DreamShaper XL](https://huggingface.co/lykon/dreamshaper-xl-lightning) for image generation
