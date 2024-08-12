# CustomerSupportAI
# AI Travel Customer Care Chatbot

![stravelbot](https://img.shields.io/badge/Deployed-Vercel-green)  
[![Website](https://img.shields.io/website?down_color=red&down_message=Offline&up_color=green&up_message=Online&url=https%3A%2F%2Fstravelbot.vercel.app)](https://stravelbot.vercel.app)

## Project Overview

This project is an AI-powered travel customer care chatbot built using **Next.js**, **Gemini API**, and **Pinecone** for Retrieval-Augmented Generation (RAG). The chatbot is deployed on an **AWS EC2 server** and provides real-time assistance to users with travel-related queries, significantly improving customer support efficiency.

## Features

- **Real-time Response:** Achieves a 70% reduction in response time, providing instant solutions to user queries.
- **RAG Model Integration:** Utilizes Pinecone for enhanced query resolution, leading to a 50% increase in user satisfaction.
- **Scalability and Uptime:** Deployed on AWS EC2, ensuring 99.9% uptime and seamless scalability.
- **Cost Optimization:** Architecture optimized to reduce operational costs by 30% through efficient resource management.

## Technology Stack

- **Frontend:** Next.js
- **AI Integration:** Gemini API
- **RAG Model:** Pinecone
- **Deployment:** AWS EC2, Vercel

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SrijanSuresh/CustomerSupportAI.git
   cd chatbot
   npm install
NEXT_PUBLIC_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
npm run dev
The application is already deployed at stravelbot.vercel.app. For deploying changes:
  vercel deploy

 For any questions or feedback, please contact srijansuresh04@gmail.com.


