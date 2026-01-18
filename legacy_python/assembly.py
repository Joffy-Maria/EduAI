from .models import FinalResponse, DraftContent, MultimodalAssets, VerificationResult

class ResponseAssemblyLayer:
    def assemble(
        self, 
        content: DraftContent, 
        assets: MultimodalAssets, 
        verification: VerificationResult
    ) -> FinalResponse:
        print("[Assembly] assembling final verified payload...")
        return FinalResponse(
            lesson_text=content.content_text,
            assets=assets,
            verification_log=verification
        )
