# AI Chatbot Implementation Guide

## Overview

This guide outlines the implementation of an AI-powered chatbot feature for the Korn Ferry Personas application. The chatbot will allow users to interact with personas and data using OpenAI's API, featuring a slide-out panel interface with streaming responses.

## Prerequisites

- OpenAI API key configured in `.env` as `OPENAI_API_KEY`
- Next.js 15+ with TypeScript
- Existing UI components and Tailwind CSS setup

## Implementation Steps

### Phase 1: Project Setup & Dependencies

#### Step 1: Install Required Dependencies

```bash
npm install openai @types/openai
```

#### Step 2: Environment Configuration

Ensure `.env.local` contains:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Phase 2: Core Components Development

#### Step 3: Create Chatbot Context & State Management

**File:** `src/contexts/ChatbotContext.tsx`

- Create React context for chatbot state management
- Manage panel visibility, messages, streaming state
- Provide methods for opening/closing panel, sending messages

#### Step 4: Create Chatbot API Route

**File:** `src/app/api/chat/route.ts`

- Implement OpenAI streaming chat endpoint
- Handle POST requests with user messages
- Stream responses back to client
- Include system prompts for persona/data context

#### Step 5: Build Core Chatbot Components

##### Step 5a: Chatbot Panel Container

**File:** `src/components/chatbot/ChatbotPanel.tsx`

- Sliding panel from right side
- Fixed positioning with proper z-index
- Smooth animations using Tailwind transitions
- Close button and panel controls

##### Step 5b: Message Components

**File:** `src/components/chatbot/Message.tsx`

- User message bubble (right-aligned)
- AI response bubble (left-aligned)
- Streaming indicator for active responses
- Timestamp and status indicators

##### Step 5c: Chat Input Component

**File:** `src/components/chatbot/ChatInput.tsx`

- Bottom-anchored input box
- Send button with loading states
- Auto-resize textarea
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

##### Step 5d: Chat Messages Container

**File:** `src/components/chatbot/ChatMessages.tsx`

- Scrollable message container
- Auto-scroll to bottom for new messages
- Scroll-to-interrupt streaming functionality
- Message history management

#### Step 6: Create Custom Hooks

##### Step 6a: Chat Hook

**File:** `src/hooks/useChat.ts`

- Manage chat state and message history
- Handle streaming responses from API
- Implement scroll-to-interrupt logic
- Provide send message functionality

##### Step 6b: Auto-scroll Hook

**File:** `src/hooks/useAutoScroll.ts`

- Detect user scroll behavior
- Auto-scroll to bottom on new messages
- Interrupt streaming when user scrolls up

### Phase 3: Navigation Integration

#### Step 7: Update Global Navigation

**File:** `src/components/GlobalNav.tsx`

- Add AI chat icon to navigation bar
- Position icon appropriately in the nav
- Implement click handler to open chatbot panel
- Use appropriate icon from lucide-react or custom SVG

#### Step 8: Update Layout for Chatbot

**File:** `src/app/layout.tsx`

- Integrate ChatbotContext provider
- Add ChatbotPanel component to layout
- Ensure proper z-index and positioning

### Phase 4: Advanced Features

#### Step 9: Implement Streaming Logic

**File:** `src/lib/chatbot/streaming.ts`

- Handle Server-Sent Events (SSE) for streaming
- Parse and display partial responses
- Manage connection states and error handling

#### Step 10: Context-Aware Responses

**File:** `src/lib/chatbot/context.ts`

- Integrate with existing persona data
- Provide relevant context to OpenAI API
- Handle different conversation contexts (personas vs. data)

#### Step 11: UI Polish & Animations

- Implement smooth slide-in/slide-out animations
- Add loading states and typing indicators
- Responsive design for different screen sizes
- Accessibility improvements (ARIA labels, keyboard navigation)

### Phase 5: Testing & Optimization

#### Step 12: Error Handling

- API rate limiting and error responses
- Network connectivity issues
- Graceful degradation for API failures

#### Step 13: Performance Optimization

- Message history limits
- Efficient re-rendering patterns
- Lazy loading for large conversations

#### Step 14: User Experience Enhancements

- Conversation persistence (localStorage)
- Conversation clearing functionality
- Export chat history feature

## Technical Architecture

### Component Structure

```
src/
├── components/
│   ├── chatbot/
│   │   ├── ChatbotPanel.tsx      # Main panel container
│   │   ├── ChatMessages.tsx      # Messages display
│   │   ├── ChatInput.tsx         # User input
│   │   ├── Message.tsx           # Individual message
│   │   └── StreamingIndicator.tsx # Typing indicator
├── contexts/
│   └── ChatbotContext.tsx        # Global state management
├── hooks/
│   ├── useChat.ts               # Chat functionality
│   └── useAutoScroll.ts         # Scroll behavior
├── lib/
│   └── chatbot/
│       ├── streaming.ts         # Streaming utilities
│       └── context.ts           # Context preparation
└── app/
    └── api/
        └── chat/
            └── route.ts         # OpenAI API integration
```

### Key Features Implementation

#### Sliding Panel

- Fixed positioning: `fixed right-0 top-0 h-full`
- Transform animations: `translate-x-full` to `translate-x-0`
- Backdrop blur and overlay for focus

#### Streaming Responses

- Server-Sent Events (SSE) from OpenAI API
- Character-by-character or word-by-word streaming
- Interrupt capability on user scroll

#### Auto-scroll Behavior

- Detect user scroll position
- Auto-scroll to bottom on new messages
- Pause streaming when user scrolls up

#### Context Integration

- Access to persona data for relevant responses
- Dynamic system prompts based on current page
- Data querying capabilities through chat interface

## Styling Guidelines

### Design System

- Use existing Korn Ferry brand colors (`#0A523E` for primary)
- Consistent with existing UI patterns
- Radix UI components where applicable
- Tailwind CSS for styling

### Panel Design

- Width: `w-96` (384px) on desktop, full width on mobile
- Background: White with subtle shadow
- Border: Left border in brand color
- Animations: Smooth 300ms transitions

### Message Styling

- User messages: Right-aligned, brand color background
- AI messages: Left-aligned, gray background
- Rounded corners, proper spacing
- Readable typography with good contrast

## API Integration Details

### OpenAI Configuration

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [...conversationHistory],
  stream: true,
  max_tokens: 1000,
  temperature: 0.7,
});
```

### System Prompts

- Context about Korn Ferry and personas
- Instructions for helpful, professional responses
- Data access and querying capabilities
- Conversation flow guidance

## Security Considerations

### API Security

- Server-side API key handling only
- Rate limiting implementation
- Input sanitization and validation
- Error message sanitization

### Data Privacy

- No conversation logging to external services
- Local storage encryption for persistence
- Clear data deletion capabilities

## Testing Strategy

### Unit Tests

- Component rendering and interactions
- Hook functionality and state management
- API route testing with mocked OpenAI responses

### Integration Tests

- End-to-end chat flow
- Streaming functionality
- Panel animations and interactions

### User Acceptance Testing

- Conversation flow and UX
- Performance under various conditions
- Accessibility compliance

## Deployment Considerations

### Environment Variables

- Secure API key storage
- Different keys for development/production
- Proper environment variable validation

### Performance Monitoring

- API response times
- Streaming performance metrics
- User engagement analytics

## Future Enhancements

### Phase 2 Features

- Voice input/output capabilities
- File upload and analysis
- Advanced persona interaction modes
- Multi-language support

### Advanced AI Features

- RAG (Retrieval-Augmented Generation) with persona data
- Custom fine-tuned models
- Conversation summarization
- Smart suggestions and prompts

---

## Implementation Checklist

- [ ] Install OpenAI dependencies
- [ ] Create chatbot context and state management
- [ ] Build API route for OpenAI integration
- [ ] Develop core chatbot components
- [ ] Implement streaming functionality
- [ ] Add AI icon to navigation
- [ ] Integrate with existing layout
- [ ] Implement auto-scroll and interrupt logic
- [ ] Add error handling and loading states
- [ ] Style components according to design system
- [ ] Test functionality across different scenarios
- [ ] Optimize performance and accessibility
- [ ] Deploy and monitor

This implementation will provide a professional, integrated AI chatbot experience that enhances the Korn Ferry Personas application with intelligent conversational capabilities.
