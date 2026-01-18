import os
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class LLMClient(ABC):
    @abstractmethod
    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        pass

class MockLLM(LLMClient):
    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        # Simple echo/simulated response for testing without keys
        return f"[MOCK LLM RESPONSE] Processed: {prompt[:50]}..."

class OpenAILLM(LLMClient):
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        if not self.api_key:
            print("Warning: No OpenAI API key provided. Calls will fail.")
        
        from openai import OpenAI
        self.client = OpenAI(api_key=self.api_key)

    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error calling OpenAI: {e}"

class GeminiLLM(LLMClient):
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-pro"):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.model = model
        if not self.api_key:
            print("Warning: No Google API key provided. Calls will fail.")
        
        import google.generativeai as genai
        genai.configure(api_key=self.api_key)
        self.client = genai.GenerativeModel(self.model)
    
    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        try:
            # Note: system_instruction support depends on library version/model, 
            # effectively baking it into prompt for broad compatibility here if needed,
            # but newer API supports it. We'll prepend for checks.
            full_prompt = prompt
            if system_instruction:
                full_prompt = f"System: {system_instruction}\nUser: {prompt}"
            
            response = self.client.generate_content(full_prompt)
            return response.text
        except Exception as e:
            return f"Error calling Gemini: {e}"
