# InquireAI Lite

## 🚀 Features

### 🧠 **Advanced AI-Powered Web Search**
InquireAI uses a sophisticated 3-step process for every query:

1. **🔍 Query Analysis**: The AI analyzes your question to determine the best search strategies
2. **🌐 Multi-Search Execution**: Performs multiple targeted web searches based on the analysis
3. **📝 Intelligent Response**: Combines search results with AI knowledge to provide comprehensive, source-cited answers

### ✨ **Key Capabilities**
- **Always Current**: Every response includes the latest web information
- **Source Citations**: All information is properly cited with clickable source links
- **Search Transparency**: See exactly what queries were used to find information
- **Multi-Perspective**: Gathers information from multiple sources for balanced answers
- **Real-time Data**: Access to current news, prices, weather, and more

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Google Gemini API Key
- Google Custom Search API Key

### Environment Variables
Create a `.env.local` file in the root directory:

```bash
# Clone the repository
git clone <your-repo-url>
cd inquire

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting!

## 🔧 Development

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 📱 Features in Detail

### Smart Search Detection
The AI automatically determines what information needs to be searched based on your question, considering:
- Time-sensitive information (news, weather, prices)
- Technical how-to questions
- Factual queries requiring current data
- Multi-perspective topics

### Source Integration
- **Clickable Sources**: All search results are displayed as clickable cards
- **Citation Numbers**: Sources are referenced with [1], [2], etc. in responses
- **Search Transparency**: See exactly what queries were used
- **Multiple Perspectives**: Gathers information from various sources

### Enhanced UX
- **Progressive Loading**: Shows analysis → searching → generating phases
- **Typing Animation**: Realistic AI response typing
- **Auto-scroll**: Automatically scrolls to new messages
- **Error Handling**: Graceful error messages and recovery