from typing import Dict, Any, List

class VideoStoryboardAgent:
    def generate(self, content_text: str, audio_script: str) -> List[Dict[str, Any]]:
        print("[VideoAgent] Generating storyboard...")
        return [
            {"time": "00:00", "frame": "Intro Slide", "script": "Welcome..."},
            {"time": "00:10", "frame": "Concept Diagram", "script": "Here we see..."}
        ]
