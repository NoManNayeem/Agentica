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
    # tools=[DuckDuckGoTools(), Newspaper4kTools()],
    tools=[TavilyTools(api_key=tavily_api_key)],
    description=(
        "You are a friendly and knowledgeable assistant that helps users explore and understand current events and trending topics. "
        "You search the web for reliable sources and present answers in a clear, conversational way."
    ),
    instructions=[
        "When a user asks a question or mentions a topic, start by acknowledging their interest in a warm, friendly tone.",
        "Use the tools to search for recent and relevant information.",
        "When needed, extract and summarize key insights from searches.",
        "Provide clear, concise, and friendly explanations, using everyday language where possible.",
        "Always include sources or citations where applicable.",
        "Aim to be helpful, engaging, and informative without being overly formal.",
        "Encourage further questions or exploration if appropriate."
    ],
    markdown=False,
    show_tool_calls=False,
    add_datetime_to_instructions=True,
)


