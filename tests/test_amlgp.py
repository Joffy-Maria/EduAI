import unittest
from amlgp.models import LessonPlan, Subject, DraftContent
from amlgp.planner import PlannerAgent
from amlgp.router import DomainRouter
from amlgp.verification import VerificationAgent

class TestAMLGP(unittest.TestCase):
    def test_planner_output(self):
        planner = PlannerAgent()
        plan = planner.plan("Teach me about Physics")
        self.assertIsInstance(plan, LessonPlan)
        self.assertEqual(plan.subject, Subject.PHYSICS)

    def test_router_logic(self):
        router = DomainRouter()
        plan = LessonPlan(
            subject=Subject.CHEMISTRY,
            topic="Acids",
            level="Basic",
            objectives=[],
            required_concepts=[],
            modalities=[],
            verification_requirements=[]
        )
        agent_key = router.route(plan)
        self.assertEqual(agent_key, "CHEMISTRY_AGENT")

    def test_verification_pass(self):
        verifier = VerificationAgent()
        # Create a dummy plan for valid DraftContent
        plan = LessonPlan(
            subject=Subject.MATH, topic="Test", level="1", objectives=[],
            required_concepts=[], modalities=[], verification_requirements=[]
        )
        content = DraftContent(
            plan=plan,
            content_text="Some valid content",
            sections={},
            modality_specs={}
        )
        result = verifier.verify(content)
        self.assertEqual(result.status, "verified")

    def test_verification_fail(self):
        verifier = VerificationAgent()
        plan = LessonPlan(
            subject=Subject.MATH, topic="Test", level="1", objectives=[],
            required_concepts=[], modalities=[], verification_requirements=[]
        )
        content = DraftContent(
            plan=plan,
            content_text="", # Empty content should fail
            sections={},
            modality_specs={}
        )
        result = verifier.verify(content)
        self.assertEqual(result.status, "failed")

if __name__ == '__main__':
    unittest.main()
