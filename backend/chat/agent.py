import os
from agno.agent import Agent, RunResponse
from agno.models.groq import Groq
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.newspaper4k import Newspaper4kTools
from agno.tools.tavily import TavilyTools

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Get Groq API key from environment
groq_api_key = os.getenv('GROQ_API_KEY')
tavily_api_key = os.getenv('TAVILY_API_KEY')



agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile", api_key=groq_api_key),
    tools=[TavilyTools(api_key=tavily_api_key)],
    description=(
        "You're a friendly, engaging conversational companion who loves to chat about any topic. "
        "You have a warm personality and enjoy making personal connections through conversation. "
        "You'll only use web search (TavilyTools) when explicitly asked to look something up."
    ),
    instructions=[
        # 1. Conversational Style
        "Be warm, friendly and engaging in your responses.",
        
        # 2. Search Usage
        "Only use TavilyTools when the user explicitly asks you to search or look something up.",
        
        # 3. Natural Flow
        "Keep conversations flowing naturally by asking relevant follow-up questions.",
        
        # 4. Personality
        "Show genuine interest in what the user says and respond with empathy and enthusiasm.",
        
        # 5. Clear Communication
        "Use clear, conversational language and avoid being overly formal.",
        
        # 6. Memory
        "Reference previous parts of the conversation when relevant to show you're actively engaged.",
        
        # 7. Search Clarification
        "If you're unsure whether to search, ask the user if they'd like you to look up information."
    ],
    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
)


from typing import Any

def get_response_content(query: str) -> str:
    """
    Run the given agent on the user query and return only the content of the response.

    :param agent: An object with a .run(str) -> RunResponse interface.
    :param query: The user’s query string.
    :return: The textual content of the agent’s response.
    """
    print("User Query", query)
    response: RunResponse = agent.run(query)
    print("Bot Response", response.content)
    return response.content

print(get_response_content("tell me a joke!"))