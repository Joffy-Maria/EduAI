import sys
import json
import os
from amlgp.orchestrator import Orchestrator
from amlgp.llm_client import MockLLM, OpenAILLM, GeminiLLM

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <query> [provider: mock|openai|gemini]")
        sys.exit(1)
    
    query = sys.argv[1]
    provider = sys.argv[2].lower() if len(sys.argv) > 2 else "mock"
    
    print(f"[System] Initializing with provider: {provider}")
    
    llm_client = None
    if provider == "openai":
        llm_client = OpenAILLM()
    elif provider == "gemini":
        llm_client = GeminiLLM()
    else:
        llm_client = MockLLM()
    
    orchestrator = Orchestrator(llm_client=llm_client)
    try:
        response = orchestrator.proccess_request(query)
        
        # Output result to JSON file
        output_file = "output.json"
        with open(output_file, "w") as f:
            f.write(response.model_dump_json(indent=2))
            
        print(f"\n[System] Lesson generated successfully. Output saved to {output_file}")
        
    except Exception as e:
        print(f"\n[System] Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
