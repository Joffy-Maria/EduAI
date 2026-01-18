from typing import Dict, Any, List

class VisualGenerationAgent:
    def generate(self, content_text: str) -> List[Dict[str, Any]]:
        print("[VisualAgent] Generating diagrams and plots...")
        return [
            {"type": "diagram", "description": "Free body diagram", "url": "assets/diagram_1.png"},
            {"type": "plot", "description": "Velocity vs Time", "url": "assets/plot_1.png"}
        ]
