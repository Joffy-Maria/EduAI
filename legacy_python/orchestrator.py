from .models import FinalResponse, LessonPlan, Subject, MultimodalAssets
from .planner import PlannerAgent
from .router import DomainRouter
from .reasoning.math_agent import MathReasoningAgent
from .reasoning.physics_agent import PhysicsReasoningAgent
from .reasoning.chemistry_agent import ChemistryReasoningAgent
from .content import ContentGenerationAgent
from .verification import VerificationAgent
from .multimodal import VisualGenerationAgent, AudioNarrationAgent, VideoStoryboardAgent
from .assembly import ResponseAssemblyLayer

from .llm_client import LLMClient, MockLLM

class Orchestrator:
    def __init__(self, llm_client: LLMClient = None):
        self.llm_client = llm_client or MockLLM()
        
        self.planner = PlannerAgent(self.llm_client)
        self.router = DomainRouter() # Router might stay heuristic for now
        self.math_agent = MathReasoningAgent() # Logic agents might stay logic-based or become hybrids
        self.physics_agent = PhysicsReasoningAgent()
        self.chemistry_agent = ChemistryReasoningAgent()
        self.content_agent = ContentGenerationAgent(self.llm_client)
        self.verification_agent = VerificationAgent(self.llm_client)
        self.visual_agent = VisualGenerationAgent()
        self.audio_agent = AudioNarrationAgent()
        self.video_agent = VideoStoryboardAgent()
        self.assembly_agent = ResponseAssemblyLayer()

    def proccess_request(self, user_input: str) -> FinalResponse:
        print(f"\n[Orchestrator] Processing request: '{user_input}'")

        # 1. Plan
        plan = self.planner.plan(user_input)

        # 2. Route
        agent_key = self.router.route(plan)
        
        # 3. Reason
        reasoning_agent = self._get_reasoning_agent(agent_key)
        context = reasoning_agent.reason(plan)

        # 4. Content Generation & Verification Loop
        max_retries = 3
        attempts = 0
        verified_content = None
        verification_result = None

        while attempts < max_retries:
            draft_content = self.content_agent.generate(context)
            verification_result = self.verification_agent.verify(draft_content)
            
            if verification_result.status == "verified":
                verified_content = draft_content
                break
            else:
                print(f"[Orchestrator] Verification failed: {verification_result.checks_failed}. Retrying...")
                # In a real system, we'd feedback errors to context
                attempts += 1
        
        if not verified_content:
            raise RuntimeError("Content verification failed after max retries.")

        # 5. Multimodal Generation
        # These depend on the verified text
        visuals = self.visual_agent.generate(verified_content.content_text)
        audio = self.audio_agent.generate(verified_content.content_text)
        storyboard = self.video_agent.generate(verified_content.content_text, audio)
        
        assets = MultimodalAssets(
            visuals=visuals,
            audio_script=audio,
            video_storyboard=storyboard
        )

        # 6. Assembly
        final_response = self.assembly_agent.assemble(verified_content, assets, verification_result)
        
        return final_response

    def _get_reasoning_agent(self, key: str):
        if key == "MATH_AGENT":
            return self.math_agent
        elif key == "PHYSICS_AGENT":
            return self.physics_agent
        elif key == "CHEMISTRY_AGENT":
            return self.chemistry_agent
        else:
            return self.math_agent
