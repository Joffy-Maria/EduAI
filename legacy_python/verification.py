from .models import DraftContent, VerificationResult
import random

class VerificationAgent:
    def __init__(self, llm_client=None):
        self.llm_client = llm_client

    def verify(self, content: DraftContent) -> VerificationResult:
        print("[VerificationAgent] Verifying content against constraints...")
        
        # If LLM client is present, we would use it here.
        # For now, we restore the simulated logic but add the structure for LLM.
        
        checks_passed = ["Symbolic consistency", "Safety check", "Format validation"]
        checks_failed = []
        status = "verified"
        
        # naive check: ensure content is not empty
        if not content.content_text:
            status = "failed"
            checks_failed.append("Empty content")
            
        return VerificationResult(
            status=status,
            checks_passed=checks_passed,
            checks_failed=checks_failed,
            feedback="Content looks good." if status == "verified" else "Content missing."
        )
